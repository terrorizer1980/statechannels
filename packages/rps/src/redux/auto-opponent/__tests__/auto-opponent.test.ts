import { RPSChannelClient } from '../../../utils/rps-channel-client';
import { fork } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { lobby } from '../../game/state';
import { gameSaga } from '../../game/saga';
import { combineReducers } from 'redux';
import { gameReducer } from '../../game/reducer';
import { openGamesReducer } from '../../open-games/reducer';
import { channelUpdatedListener } from '../../message-service/channel-updated-listener';
import { autoPlayer, autoOpponent } from '../';

const SUFFICIENT_TIME_TO_GET_TO_TURNUM_14 = 7000; // test will take at least this long to run
const reducer = combineReducers({
  game: gameReducer,
  openGames: openGamesReducer,
});

it(
  'runs to GameOver',
  async () => {
    const client = new RPSChannelClient();
    function* saga() {
      yield fork(gameSaga, client);
      yield fork(autoPlayer, 'A');
      yield fork(autoOpponent, 'B', client);
      yield fork(channelUpdatedListener, client);
    }
    const initialState = {
      game: {
        localState: lobby({ name: 'Player A', address: 'blah' }),
        channelState: null,
      },
      openGames: [],
    };

    const { storeState } = await expectSaga(saga)
      .withReducer(reducer, initialState)
      .silentRun(SUFFICIENT_TIME_TO_GET_TO_TURNUM_14); // Kill the saga after (hopefully) enough time. Brittle.
    expect(storeState.game.localState.type).toEqual('GameOver');
  },
  SUFFICIENT_TIME_TO_GET_TO_TURNUM_14 + 1000
); // We don't want jest to timeout