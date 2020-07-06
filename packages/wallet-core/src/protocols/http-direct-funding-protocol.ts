import {Outcome, State} from '../store/types';
import {TransitionConfig, Machine, MachineConfig} from 'xstate';
import {ChannelStoreEntry} from '../store/channel-store-entry';
import {ChannelChainInfo} from '../chain';
import {unreachable} from '../utils';

type Stage = 'PrefundSetup' | 'PostfundSetup' | 'Running' | 'Final';
type Purpose = 'app' | 'joint' | 'guarantor' | 'ledger';
type AdjudicatorStatus = 'open' | 'challenge' | 'finalized';
type AdjudicatorState = {
  type: 'AdjudicatorState';
  channelStatus: AdjudicatorStatus;
  turnNumRecord: number;
  state?: State;
};

type AssetHolderState = {type: 'AssetHolderState'; amount: string} & (
  | {isFinalized: true; finalizedOutcome?: Outcome}
  | {isFinalized: false}
);

type SupportedState = {stage: Stage; outcome};
type LatestState = {stage: 'supported'} | SupportedState;

type ProtocolState = {
  channelId: string;
  purpose: Purpose;
  myIndex;
  adjudicatorState: AdjudicatorState;
  assetHolderState: AssetHolderState;
  // turn number == 0 <==> prefund setup
  // turn number == 3 <==> postfund setup
  // turn number > 3 <=> channel is set up
  supported: SupportedState;
  latest: LatestState;
  myLatest: LatestState;
};

export function protocolState(
  entry: ChannelStoreEntry,
  chainInfo: ChannelChainInfo
): ProtocolState {
  const {channelId, funding, myIndex} = entry;
  const purpose: Purpose = ((): Purpose => {
    if (typeof funding === 'undefined') throw 'No funding';
    switch (funding.type) {
      case 'Direct':
        return 'ledger';
      case 'Guarantee':
      case 'Guarantees':
        return 'joint';
      case 'Virtual':
        return 'app';
      case 'Indirect':
        return 'guarantor';

      default:
        return unreachable(funding);
    }
  })();

  const {
    channelStorage: {finalizesAt, turnNumRecord},
    amount
  } = chainInfo;

  const adjudicatorState: AdjudicatorState = {
    type: 'AdjudicatorState',
    channelStatus:
      finalizesAt === 0 ? 'open' : finalizesAt > Date.now() ? 'challenge' : 'finalized',
    turnNumRecord
  };

  const assetHolderState: AssetHolderState = {
    type: 'AssetHolderState',
    isFinalized: chainInfo.finalized,
    amount: amount.toHexString()
  };

  const supported = ((): {stage: Stage; outcome} => ({
    stage: !entry.isSupported ? 'PrefundSetup' : stage(entry.supported),
    outcome: entry.supported.outcome
  }))();

  const latest = comparedWithSupported(entry, e => e.latest);
  const myLatest = comparedWithSupported(entry, e => e.latestSignedByMe);
  return {
    myIndex,
    channelId,
    purpose,
    adjudicatorState,
    assetHolderState,
    supported,
    latest,
    myLatest
  };
}

const stage = (state: State): Stage =>
  state.turnNum === 0
    ? 'PrefundSetup'
    : state.turnNum === 3
    ? 'PostfundSetup'
    : state.isFinal
    ? 'Final'
    : 'Running';

const comparedWithSupported = (
  e: ChannelStoreEntry,
  prop: (e: ChannelStoreEntry) => State
): LatestState =>
  !e.supported
    ? {stage: stage(prop(e)), outcome: prop(e).outcome}
    : e.supported.turnNum === prop(e).turnNum
    ? {stage: 'supported'}
    : {stage: stage(prop(e)), outcome: prop(e).outcome};

type Guard = (ctx: ProtocolState) => boolean;
const autoTransition = (...opts: ([string, Guard] | string)[]) => {
  const transitions: TransitionConfig<ProtocolState, Event>[] = [];
  opts.map(opt => transitions.push({target: opt[0], cond: opt[1]}));

  return {on: {'': transitions}};
};

type FinalizedStateSchema = {
  initial: 'defund';
  states: {defund: {}};
};
type ChallengeOngoingStateSchema = {
  initial: 'checkFunding';
  states: {checkFunding: {}};
};
type ChannelOpenStateSchema = {
  initial: 'start';
  states: {start: {}};
};

type MachineStateSchema = {
  initial: 'start';
  states: {
    start: {};
    finalizedOnChain: FinalizedStateSchema;
    challengeOngoing: ChallengeOngoingStateSchema;
    channelOpen: ChannelOpenStateSchema;
  };
};

type Event = {type: 'xstate.init'};

const adjudicatorGuard = (s: AdjudicatorStatus) => (c: ProtocolState) =>
  c.adjudicatorState.channelStatus === s;

const finalizedOnChain: MachineConfig<ProtocolState, FinalizedStateSchema, Event> = {
  initial: 'defund',
  states: {defund: {type: 'final'}}
};

const notInChannel = (_ctx: ProtocolState) => true;
const challengeOngoing: MachineConfig<ProtocolState, ChallengeOngoingStateSchema, Event> = {
  initial: 'checkFunding',
  states: {checkFunding: autoTransition(['abort', notInChannel], 'monitor')}
};

const fullyFunded = () => true;
const partiallyFunded = () => true;
const unFunded = () => true;

const channelOpen: MachineConfig<ProtocolState, ChannelOpenStateSchema, Event> = {
  initial: 'start',
  states: {
    start: autoTransition(
      ['unFunded', unFunded],
      ['fundingStarted', partiallyFunded],
      ['funded', fullyFunded]
    )
  }
};

export const machine = Machine<ProtocolState, MachineStateSchema, Event>({
  initial: 'start',
  states: {
    start: autoTransition(
      ['finalizedOnChain', adjudicatorGuard('finalized')],
      ['challengeOngoing', adjudicatorGuard('challenge')],
      ['channelOpen', adjudicatorGuard('open')]
    ),
    finalizedOnChain,
    challengeOngoing,
    channelOpen
  }
});
