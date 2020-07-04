import _ from 'lodash';

type Outcome = any;

type ChannelState<T extends number | undefined = number> = {
  turnNum: T;
  outcome: Outcome;
};

type ChannelEntry<
  S extends number | undefined = number | undefined,
  L extends number = number,
  M extends number | undefined = number | undefined
> = {
  channelId: string;
  myIndex: 0 | 1;
  supported: ChannelState<S>;
  latest: ChannelState<L>;
  myLatest: ChannelState<M>;
};

type SupportedType = 'prefund' | 'postfund' | 'running' | 'closing' | 'closed';

type ChannelState2 = {
  channelId: string;
  purpose: 'app' | 'joint' | 'guarantor' | 'ledger';
  myIndex;
  adjudicatorState: ('open' | 'challenge' | 'concluded') & {turnNumRecord: number; state?: any};
  assetHolderState: {amount: string} & (
    | {isFinalized: true; finalizedOutcome?: Outcome}
    | {isFinalized: false}
  );
  // turn number == 0 <==> prefund setup
  // turn number == 3 <==> postfund setup
  // turn number > 3 <=> channel is set up
  supported: {stage: SupportedType; outcome};
  latest: {stage: 'supported' | SupportedType; outcome};
  myLatest: {stage: 'supported' | SupportedType; outcome};
};

type Mark<T, Keys extends string = string, V extends boolean = true> = T & {[k in Keys]: V};
export const validate = <
  S extends number | undefined = number,
  L extends number = number,
  M extends number | undefined = number
>(
  s: ChannelEntry<S, L, M>
): s is Mark<ChannelEntry<S, L, M>, 'validated'> => {
  const {latest, myLatest, supported} = s;
  return (
    typeof supported !== 'number' ||
    (latest >= supported && (typeof myLatest !== 'number' || myLatest >= supported))
  );
};

type StartedByPeer = ChannelEntry<undefined, 0, undefined>;
type StartedByMe = ChannelEntry<undefined, 0, 0>;
type PreFundSetupComplete = ChannelEntry<0, 0, 0>;
type PreFundSetup = StartedByPeer | StartedByMe | PreFundSetupComplete;

// Assumes 2-party channels, but also works for n-party null apps
type PostFundStartedByPeer = ChannelEntry<0, 0, 3>;
type PostFundStartedByMe = ChannelEntry<0, 3, 0>;
type PostFundSetupComplete = ChannelEntry<3, 3, 3>;
type PostFundSetup = PostFundStartedByPeer | PostFundStartedByMe | PostFundSetupComplete;

type Ledger<T> = {ledger: ChannelEntry<number, number, number> & T};
type LedgerAvailable = Ledger<{available: true}>;
type LedgerUpdating = Ledger<{available: false}>;
type LedgerRunning = LedgerAvailable | LedgerUpdating;

type App<T> = {app: T};
type Joint<T> = {joint: T};
type Guarantor<T> = {guarantor: T};

type IDX = 0 | 1 | 'H';
type Participant = {address: string; index: IDX};
type VirtualStep0 = LedgerRunning & {peer: Participant; hub: Participant};

type VirtualStep1 = VirtualStep0 & App<PreFundSetup> & Joint<PreFundSetup> & Guarantor<StartedByMe>;

const store: {
  sign<T extends ChannelState = ChannelState>(_s: T): T;
  update<T extends ChannelState = ChannelState>(_s: T, opts: any): T;
  createChannelWith(...peers: Participant[]): ChannelState;
} = {} as any;
const request = (_to: Participant, states: ChannelState[]): Promise<ChannelState[]> =>
  Promise.resolve(states);
const respond = (states: ChannelState[]): Promise<ChannelState[]> => Promise.resolve(states);

// 1.
//   1. X prefund: Http request A → B
//     1. A requests XAB0 and JABH0 to B.
//     2. B responds XAB0 and JABH0 to A
//   2. *Independent http requests to H:*
//     1. A → H
//         1. A sends a request with JABH0, GAH0 to H
//         2. H responds with JABH0, GAH0, LAHn to A (where n is the next turn)
//     2. B → H
//         1. B requests JABH0, JABH0, GBH0 to H
//         2. H responds JABH0, GBH0, LBHm to B (where m is the next turn)

export function request1(state: VirtualStep0) {
  const app = store.createChannelWith(state.peer);
  const joint = store.createChannelWith(state.peer, state.hub);
  const guarantor = store.createChannelWith(state.hub);

  request(state.peer, [app, joint]);
  request(state.hub, [joint, guarantor]);
}

export function peerRespond1(state: VirtualStep1) {
  // validate first
  const app = store.sign(state.app.latest);
  const joint = store.sign(state.joint.latest);
  const guarantor = store.createChannelWith(state.hub);

  respond([app, joint]);
  request(state.hub, [joint, guarantor]);
}

export function hubRespond1(state: any): any {
  // TODO

  return state;
}

type VirtualStep2 = VirtualStep1 &
  App<PreFundSetupComplete> &
  Joint<PreFundSetupComplete> &
  Guarantor<StartedByMe | PreFundSetupComplete>;

// 3. HTTP *request A → B:*
//     1. A requests JABH3 to [B, H]
//     2. B responds to A JABH3
//     3. H responds to A JABH3
// 4. concurrent HTTP *request A → B:*
//     1. B requests JABH3 to [A, H]
//     2. A responds to B JABH3
//     3. H responds to B JABH3
export function request2(state: VirtualStep2) {
  const joint = store.update(state.joint.supported, {turnNum: 3});

  request(state.peer, [joint]);
  request(state.hub, [joint]);
}

export function respond2(state: VirtualStep1) {
  // All participants respond this way
  const joint = store.sign(state.joint.latest);
  respond([joint]);
}

// 3. *Fire and forget messages to H*
//     1. A sends LAH(n+1) to H
//     2. B sends LBH(m+1) to H
type VirtualStep3 = VirtualStep2 & LedgerUpdating;
export function request3(state: VirtualStep3) {
  const ledger = store.update(state.ledger.supported, {outcome: 'allocate to guarantor'});

  request(state.hub, [ledger]);
}

export function respond3(state: VirtualStep3) {
  respond([store.sign(state.ledger.latest)]);
}

// 5. Concurrent *Http requests to H & peer:*
//     1. A → B, H
//         1. A requests JABH3 to H & B
//         2. H responds JABH3 to A if 5.2.1 has arrived
//     2. B → A, H
//         1. B requests JABH3 to H & A
//         2. H responds JABH3 to B if 5.2.1 has arrived

type VirtualStep4 = VirtualStep3 & Joint<PostFundSetup> & Guarantor<PreFundSetupComplete>;
export function request4(state: VirtualStep3) {
  const joint = store.update(state.joint.supported, {outcome: 'allocate to target channel'});

  request(state.hub, [joint]);
  request(state.peer, [joint]);
}

export function peerRespond4(state: VirtualStep3) {
  request(state.hub, [store.sign(state.joint.latest)]);
  respond([state.joint.latest]);
}

// 6. Virtual funding complete. A & B exchange post fund setups
//    1. A requests XAB3 to B
//    2. B responds XAB3

type VirtuallyFunded = VirtualStep4 & App<PostFundSetup> & Joint<PostFundSetupComplete>;
export function request5(state: VirtuallyFunded) {
  const app = store.update(state.app.supported, {turnNum: 3});
  request(state.peer, [app]);
}

export function respond5(state: VirtuallyFunded) {
  respond([store.sign(state.app.latest)]);
}

// App channel is now running
type Running = VirtuallyFunded & App<PostFundSetupComplete>;
export function isRunning(s: any): s is Running {
  return true; // YOLO
}
