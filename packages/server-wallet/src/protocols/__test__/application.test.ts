import {protocol} from '../application';
import {channelWithVars} from '../../models/__test__/fixtures/channel';

const c = channelWithVars();

describe('updateChannel', () =>
  it.skip('validUpdate', () => {
    expect(protocol(c.protocolState)).toMatchObject([
      {type: 'SignState', channelId: c.channelId, hash: c.latest.stateHash},
    ]);
  }));
