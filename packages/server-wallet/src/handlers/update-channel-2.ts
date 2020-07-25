import {SignedStateWithHash, Outcome} from '@statechannels/wallet-core';
import {ChannelId} from '@statechannels/client-api-schema';

import {ProtocolAction, SignState} from '../protocols/actions';
import {ChannelState} from '../protocols/state';

type ChannelStateWithSupported = ChannelState & {
  supported: SignedStateWithHash;
};

export interface UpdateChannelHandlerParams {
  channelId: ChannelId;
  outcome: Outcome;
  appData: string;
}

const hasSupportedState = (cs: ChannelState): cs is ChannelStateWithSupported => !!cs.supported;
const isMyTurn = (cs: ChannelStateWithSupported): boolean =>
  cs.supported.turnNum % cs.supported.participants.length === cs.myIndex;

export function updateChannel(
  args: UpdateChannelHandlerParams,
  channelState: ChannelState
): ProtocolAction {
  // todo: check if the channel is funded and that no challenge exists once that data is part of the ChannelState

  if (!hasSupportedState(channelState)) {
    throw Error('must have latest state');
  }

  if (channelState.supported.turnNum < 3) {
    throw Error('channel must be in running state');
  }

  if (!isMyTurn(channelState)) {
    throw Error('it is not my turn');
  }

  // todo: use Action creator from another branch
  const finalAction: SignState = {
    type: 'SignState',
    ...args,
    turnNum: channelState.supported.turnNum + 1,
    isFinal: false,
  };

  return finalAction;
}
