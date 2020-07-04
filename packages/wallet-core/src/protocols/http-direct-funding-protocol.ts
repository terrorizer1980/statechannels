import _ from 'lodash';
import {Outcome, State} from '../store/types';
import {ChannelStoreEntry} from '../store/channel-store-entry';
import {ChannelChainInfo} from '../chain';
import {unreachable} from '../utils';
import {logger} from 'ethers';

type Stage = 'PrefundSetup' | 'PostfundSetup' | 'Running' | 'Closing' | 'Closed';
type Purpose = 'app' | 'joint' | 'guarantor' | 'ledger';
type AdjudicatorState = {
  type: 'AdjudicatorState';
  channelStatus: 'open' | 'challenge' | 'concluded';
  turnNumRecord: number;
  state?: State;
};

type AssetHolderState = {type: 'AssetHolderState'; amount: string} & (
  | {isFinalized: true; finalizedOutcome?: Outcome}
  | {isFinalized: false}
);

type ProtocolState = {
  channelId: string;
  purpose: Purpose;
  myIndex;
  adjudicatorState: AdjudicatorState;
  assetHolderState: AssetHolderState;
  // turn number == 0 <==> prefund setup
  // turn number == 3 <==> postfund setup
  // turn number > 3 <=> channel is set up
  supported: {stage: Stage; outcome};
  latest: {stage: 'supported' | Stage; outcome};
  myLatest: {stage: 'supported' | Stage; outcome};
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
  const adjudicatorState = ((): AdjudicatorState => {
    logger.info('foo');
    return {
      type: 'AdjudicatorState',
      channelStatus:
        finalizesAt === 0 ? 'open' : finalizesAt > Date.now() ? 'challenge' : 'concluded',
      turnNumRecord
    };
  })();

  const assetHolderState = ((): AssetHolderState => ({
    type: 'AssetHolderState',
    isFinalized: chainInfo.finalized,
    amount: amount.toHexString()
  }))();

  const supported = (() => {
    {
      stage: !supported ? 'PrefundSetup' : '';
      outcome: supported.outcome;
    }
  })();

  return {
    myIndex,
    channelId,
    purpose,
    adjudicatorState,
    assetHolderState,
    supported
  };
}
