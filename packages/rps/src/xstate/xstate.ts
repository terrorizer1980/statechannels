import {createMachine} from 'xstate';
import {game} from '../machines/game/state';
import {global} from '../machines/global/state';
import {login} from '../machines/login/state';
import {metamask} from '../machines/metamask/state';
import {default as firebase} from '../gateways/firebase';

type TContext = any;

interface TState {
  value: any;
  context: any;
}
type TEvent = any;

export const rps = createMachine<TContext, TEvent, TState>(
  {
    id: 'rps',
    type: 'parallel',
    context: {},
    states: {
      game,
      global,
      login,
      metamask,
    },
  },
  {
    activities: {
      syncOpenGames: (context, activity) => {
        const openGamesRef = firebase.database().ref('/challenges/');
        openGamesRef.on('value', function(snapshot) {
          context.openGames = snapshot.val();
        });
        return () => {
          context.openGames = [];
          openGamesRef.off('value');
        };
      },
    },
    guards: {
      sufficientFunds: (context, event) => {
        return event.fundingSituation === 'Ok';
      },
      insufficientFunds: (context, event) => {
        return event.fundingSituation !== 'Ok';
      },
    },
  }
);