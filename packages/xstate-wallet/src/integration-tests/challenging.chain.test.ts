import {ChainWatcher} from '../chain';
import {Player, hookUpMessaging, generateChallengeRequest} from './helpers';
import {simpleEthAllocation} from '../utils';
import {CHAIN_NETWORK_ID} from '../config';
import {BigNumber, constants} from 'ethers';

jest.setTimeout(30000);
// TODO: This should be done in contract setup but I couldn't figure out how to access the window object there
(window as any).ethereum = {
  enable: () => {
    /* NOOP */
  },

  selectedAddress: '0x760bf27cd45036a6C486802D30B5D90CfFBE31FE',
  fake: true // This allows the chainwatcher to work directly against ganache
};

// const resolveOnError = (player: Player, errorCode: ErrorResponse['error']['code']) =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => reject(`Timed out waiting for error code ${errorCode}`), 3000);
//     player.messagingService.outboxFeed.subscribe(message => {
//       if ('error' in message) {
//         if (message.error.code === errorCode) resolve(message.error);
//         else reject(`Expected code ${errorCode} but received code ${message.error.code}`);
//       }
//     });
//   });

const resolveOnResponse = (player: Player) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject('Timed out waiting for update channel response'), 3000);
    player.messagingService.outboxFeed.subscribe(
      message => 'id' in message && 'result' in message && resolve(message.result)
    );
  });

// const resolveOnNotification = (player: Player) =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => reject('Timed out waiting for channel updated notification'), 3000);
//     player.messagingService.outboxFeed.subscribe(
//       message =>
//         !('id' in message) &&
//         'method' in message &&
//         message.method === 'ChannelUpdated' &&
//         resolve(message.params)
//     );
//   });

// eslint-disable-next-line jest/expect-expect
test('handles a challenge', async () => {
  const chain = new ChainWatcher();
  await chain.initialize();

  const playerA = await Player.createPlayer(
    '0x275a2e2cd9314f53b42246694034a80119963097e3adf495fbf6d821dc8b6c8e',
    'PlayerA',
    chain
  );
  const playerB = await Player.createPlayer(
    '0x3341c348ea8ade1ba7c3b6f071bfe9635c544b7fb5501797eaa2f673169a7d0d',
    'PlayerB',
    chain
  );
  const players = [playerA, playerB];
  // const expectTurnNumber = async (n: number) =>
  //   Promise.all(
  //     players.map(async player => {
  //       expect(player.workflowState).toEqual('running');
  //       expect((await player.store.getEntry(channelId)).latest.turnNum.toNumber()).toBe(n);
  //     })
  //   );

  const amount = BigNumber.from('0x06f05b59d3b20000');
  const outcome = simpleEthAllocation(players.map(({destination}) => ({destination, amount})));

  hookUpMessaging(playerA, playerB);

  const turnNum = BigNumber.from(5);
  const signedState = players.reduce((state, player) => player.signState(state), {
    outcome,
    turnNum,
    appData: '0x0',
    isFinal: false,
    participants: [playerA.participant, playerB.participant],
    challengeDuration: BigNumber.from(4),
    chainId: CHAIN_NETWORK_ID,
    appDefinition: constants.AddressZero,
    channelNonce: BigNumber.from(4),
    signatures: []
  });
  const {channelId} = await players.map(({store}) => store.addState(signedState))[0];
  const applicationDomain = 'localhost';

  const context: any = {channelId, applicationDomain, fundingStrategy: 'Direct'};
  playerA.startAppWorkflow('running', context);
  playerB.startAppWorkflow('running', context);
  playerA.workflowMachine?.send('SPAWN_OBSERVERS');
  playerB.workflowMachine?.send('SPAWN_OBSERVERS');

  const challenge = generateChallengeRequest(channelId);
  playerB.messagingService.receiveRequest(challenge, applicationDomain);
  await resolveOnResponse(playerA);
});
