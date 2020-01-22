import {createMachine, StateNodeConfig} from 'xstate';
// import {GameAction} from 'src/redux/game/actions';
// import {GlobalAction} from 'src/redux/global/actions';
// import {AnyAction} from 'src/redux/login/actions';
import {MetamaskAction} from 'src/redux/metamask/actions';

type TContext = any;
interface TState {
  value: any;
  context: any;
}
type TEvent = any;

// // game machine
// const PlayerAStates = createMachine<TContext, GameAction, TState>({
//   initial: 'GameChosen',
//   states: {
//     GameChosen: {on: {StartRound: 'ChooseWeapon'}},
//     ChooseWeapon: {on: {ChooseWeapon: 'WeaponChosen'}},
//     WeaponChosen: {on: {ChooseSalt: 'WeaponAndSaltChosen'}},
//     WeaponAndSaltChosen: {
//       on: {
//         ResultArrived: [
//           {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
//           {target: 'InsufficientFunds', cond: 'insufficientFunds'},
//         ],
//       },
//     },
//     ResultPlayAgain: {on: {PlayAgain: 'WaitForRestart'}},
//     WaitForRestart: {on: {StartRound: 'ChooseWeapon'}},
//     InsufficientFunds: {},
//     Resigned: {},
//   },
// });

// const PlayerBStates = createMachine<TContext, GameAction, TState>({
//   initial: 'CreatingOpenGame',
//   states: {
//     CreatingOpenGame: {on: {CreateGame: 'WaitingRoom'}},
//     WaitingRoom: {on: {GameJoined: 'OpponentJoined'}},
//     OpponentJoined: {on: {StartRound: 'ChooseWeapon'}},
//     ChooseWeapon: {on: {ChooseWeapon: 'WeaponChosen'}},
//     WeaponChosen: {
//       on: {
//         ResultArrived: [
//           {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
//           {target: 'InsufficientFunds', cond: 'insufficientFunds'},
//         ],
//       },
//     },
//     ResultPlayAgain: {on: {PlayAgain: 'WaitForRestart'}},
//     WaitForRestart: {on: {StartRound: 'ChooseWeapon'}},
//     InsufficientFunds: {},
//     Resigned: {},
//   },
// });

// const game = createMachine<TContext, GameAction, TState>({
//   initial: 'Empty',
//   states: {
//     Empty: {
//       on: {
//         UpdateProfile: 'NeedAddress',
//       },
//     },
//     NeedAddress: {
//       on: {
//         GotAddressFromWallet: 'Lobby',
//       },
//     },
//     Lobby: {
//       on: {
//         JoinOpenGame: 'PlayerA',
//         CreateGame: 'PlayerB',
//       },
//     },
//     PlayerA: {
//       on: {GameOver: 'GameOver'},
//       ...PlayerAStates.states,
//     },
//     PlayerB: {
//       on: {GameOver: 'GameOver'},
//       ...PlayerBStates.states,
//     },
//     GameOver: {on: {ExitToLobby: 'Lobby'}},
//   },
// });

// // global machine
// const rules = createMachine<TContext, GlobalAction, TState>({
//   initial: 'invisible',
//   states: {
//     visible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'invisible'}},
//     invisible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'visible'}},
//   },
// });
// const wallet = createMachine<TContext, GlobalAction, TState>({
//   initial: 'invisible',
//   states: {
//     visible: {on: {'APP.HIDE_WALLET': 'invisible'}},
//     invisible: {on: {'APP.SHOW_WALLET': 'visible'}},
//   },
// });
// const globall = createMachine<TContext, GlobalAction, TState>({
//   states: {
//     rules: rules.states,
//     wallet: wallet.states,
//   },
// });

// // login machine
// const loading = createMachine<TContext, AnyAction, TState>({
//   initial: 'false',
//   states: {
//     true: {on: {'LOGIN.SUCCESS': 'false'}},
//     false: {on: {'LOGIN.REQUEST': 'true'}},
//   },
// });
// const loggedIn = createMachine<TContext, AnyAction, TState>({
//   initial: 'false',
//   states: {
//     true: {},
//     false: {on: {'LOGIN.SUCCESS': 'true'}},
//   },
// });
// const login = createMachine<TContext, AnyAction, TState>({
//   states: {
//     loading: loading.states,
//     loggedIn: loggedIn.states,
//   },
// });

// metamask machine

interface BooleanSchema {
  states: {
    true: {};
    false: {};
  };
}

interface MMStateSchema {
  states: {
    metamaskLoading: any;
    metamaskSuccess: any;
  };
}

const metamaskLoading: StateNodeConfig<TContext, BooleanSchema, MetamaskAction> = {
  initial: 'false',
  states: {
    true: {},
    false: {},
  },
};

const metamaskSuccess: StateNodeConfig<TContext, BooleanSchema, MetamaskAction> = {
  initial: 'false',
  states: {
    true: {},
    false: {},
  },
};

const metamask: StateNodeConfig<TContext, MMStateSchema, MetamaskAction> = {
  initial: 'metamaskLoading',
  states: {
    metamaskLoading,
    metamaskSuccess,
  },
};

export const rps = createMachine<TContext, TEvent, TState>({
  id: 'rps',
  type: 'parallel',
  states: {
    // game: game.states,
    // global: globall.states,
    // login: login.states,
    metamask,
  },
});
