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
          console.log(snapshot.val());
          context.openGames = snapshot.val();
        });
        return () => {
          openGamesRef.off('value');
        };
      },
    },
  }
);
