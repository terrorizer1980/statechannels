import {SignedStateWithHash, Outcome, State} from '@statechannels/wallet-core';
import {ChannelId} from '@statechannels/client-api-schema';

import {ChannelState} from '../protocols/state';

type ChangeLog = {changedChannelIds: string[]; messages: any[]};

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

export async function updateChannel(
  args: UpdateChannelHandlerParams,
  channelState: ChannelState,
  store: Store
): Promise<ChangeLog> {
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

  const newState = await store.updateChannel(args.channelId, {...args});
  const messages = newState.participants.map(p => stateUpdatedMessage(p.participantId, newState));

  return {changedChannelIds: [args.channelId], messages};
}

interface Store {
  updateChannel(channelId: string, state: Partial<State>): Promise<State>;
}

const stateUpdatedMessage = (to: string, state: State) => ({});
