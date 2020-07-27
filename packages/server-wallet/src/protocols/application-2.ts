import {BN, isSimpleEthAllocation, SignedStateWithHash} from '@statechannels/wallet-core';

import {ProtocolAction} from './actions';
import {ProtocolState} from './application';

export const protocol = (ps: ProtocolState): ProtocolAction | undefined => {
  const {latestSignedByMe, channelId} = ps.app;

  if (!latestSignedByMe) {
    throw Error(`The application protocol requires a signed prefund setup`); // or return?
  }

  if (isPreFundSetup(latestSignedByMe) && isFullyFunded(ps)) {
    return signPostFundSetup(channelId, latestSignedByMe);
  }

  return;
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

const signPostFundSetup = (channelId: string, s: SignedStateWithHash): ProtocolAction => {
  return {
    type: 'SignState',
    channelId,
    ...s,
    turnNum: 3,
  };
};
