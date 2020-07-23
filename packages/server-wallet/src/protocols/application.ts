import {right} from 'fp-ts/lib/Either';
import {none} from 'fp-ts/lib/Option';

import {Protocol, ChannelState} from './state';

// Responsibilities

//  sendChallengeChannelResponse
//  sendCreateChannelResponse
//  sendJoinChannelResponse
//  updateChannel
//  closeChannel

export const protocol: Protocol<ChannelState> = (_ps: ChannelState) => Promise.resolve(right(none));
