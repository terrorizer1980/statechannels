/* eslint-disable no-undef */

import {IFrameChannelProviderInterface} from '@statechannels/iframe-channel-provider';
import {ChannelClient} from '@statechannels/channel-client';

import {sleep} from './helpers';
import {Message} from '@statechannels/client-api-schema';
jest.setTimeout(10000);
require('@statechannels/iframe-channel-provider');

let channelProvider: IFrameChannelProviderInterface;
let channelClient: ChannelClient;
let iframe: HTMLIFrameElement;
let signingAddress: string;

beforeAll(async () => {
  channelProvider = (window as any).channelProvider;
  channelClient = new ChannelClient(channelProvider);
  await channelProvider.mountWalletComponent('http://localhost:3055');
  iframe = document.getElementById('channelProviderUi') as HTMLIFrameElement;
  const enablePromise = channelProvider.enable();
  await sleep(100); // wait for UI
  iframe.contentWindow?.document.getElementById('connect-with-metamask-button')?.click();
  await enablePromise;
});

describe('Client-Provider-Wallet', () => {
  it('Calls pushMessage()', async () => {
    signingAddress = channelProvider.signingAddress as string;

    const message: Message = {
      sender: '0xAE363d29fc0f6A9bbBbEcC87751e518Cd9CA83C0',
      recipient: signingAddress,
      data: {signedStates: [], objectives: ''}
    };

    const result = await channelClient.pushMessage(message);
    expect(result.success).toBe(true);
  });
});
