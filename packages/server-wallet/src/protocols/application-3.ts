import {BN, isSimpleEthAllocation, SignedStateWithHash, State} from '@statechannels/wallet-core';

import {ProtocolState} from './application';

type ChangeLog = {changedChannelIds: string[]; messages: any[]};

export const protocol = async (ps: ProtocolState, store: Store): Promise<ChangeLog> => {
  const {latestSignedByMe, channelId} = ps.app;

  if (!latestSignedByMe) {
    throw Error(`The application protocol requires a signed prefund setup`);
  }

  if (isPreFundSetup(latestSignedByMe) && isFullyFunded(ps)) {
    return signPostFundSetup(channelId, latestSignedByMe, store);
  }

  return {changedChannelIds: [], messages: []};
};

const isFullyFunded = (ps: ProtocolState): boolean => {
  if (!ps.app.supported || !isSimpleEthAllocation(ps.app.supported.outcome)) {
    return false;
  }
  const allocation = ps.app.supported?.outcome;

  const currentFunding = ps.app.funding(allocation.assetHolderAddress);
  const targetFunding = allocation.allocationItems.map(a => a.amount).reduce(BN.add);
  return BN.gte(currentFunding, targetFunding);
};

const isPreFundSetup = (s: SignedStateWithHash): boolean => s.turnNum === 0;

const signPostFundSetup = async (
  channelId: string,
  s: SignedStateWithHash,
  store: Store
): Promise<ChangeLog> => {
  const newState = await store.signState(channelId, {...s, turnNum: 3});

  const messages = newState.participants.map(p => stateUpdatedMessage(p.participantId, newState));
  return {changedChannelIds: [channelId], messages};
};

interface Store {
  signState(channelId: string, state: State): Promise<State>;
}

const stateUpdatedMessage = (to: string, state: State) => ({});
