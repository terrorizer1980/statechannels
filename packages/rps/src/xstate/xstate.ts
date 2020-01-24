import {createMachine} from 'xstate';
import {game} from '../machines/game/state';
import {global} from '../machines/global/state';
import {login} from '../machines/login/state';
import {metamask} from '../machines/metamask/state';

type TContext = any;
interface TState {
  value: any;
  context: any;
}
type TEvent = any;

export const rps = createMachine<TContext, TEvent, TState>({
  id: 'rps',
  type: 'parallel',
  states: {
    game,
    global,
    login,
    metamask,
  },
});
