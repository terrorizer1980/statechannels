import {createMachine, StateNodeConfig} from 'xstate';
import {GameAction} from 'src/redux/game/actions';
import {GlobalAction} from 'src/redux/global/actions';
import {AnyAction} from 'src/redux/login/actions';
import {MetamaskAction} from 'src/redux/metamask/actions';
import {MetamaskState} from 'src/redux/metamask/state';

type TContext = any;
interface TState {
  value: any;
  context: any;
}
type TEvent = any;

// game machine
interface PlayerASchema {
  states: {
    GameChosen: any;
    ChooseWeapon: any;
    WeaponChosen: any;
    WeaponAndSaltChosen: any;
    ResultPlayAgain: any;
    WaitForRestart: any;
    InsufficientFunds: any;
    Resigned: any;
  };
}
const PlayerAStates: StateNodeConfig<TContext, PlayerASchema, GameAction> = {
  initial: 'GameChosen',
  states: {
    GameChosen: {on: {StartRound: 'ChooseWeapon'}},
    ChooseWeapon: {on: {ChooseWeapon: 'WeaponChosen'}},
    WeaponChosen: {on: {ChooseSalt: 'WeaponAndSaltChosen'}},
    WeaponAndSaltChosen: {
      on: {
        ResultArrived: [
          {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
          {target: 'InsufficientFunds', cond: 'insufficientFunds'},
        ],
      },
    },
    ResultPlayAgain: {on: {PlayAgain: 'WaitForRestart'}},
    WaitForRestart: {on: {StartRound: 'ChooseWeapon'}},
    InsufficientFunds: {},
    Resigned: {},
  },
};

interface PlayerBSchema {
  states: {
    CreatingOpenGame: any;
    WaitingRoom: any;
    OpponentJoined: any;
    ChooseWeapon: any;
    WeaponChosen: any;
    ResultPlayAgain: any;
    WaitForRestart: any;
    InsufficientFunds: any;
    Resigned: any;
  };
}
const PlayerBStates: StateNodeConfig<TContext, PlayerBSchema, GameAction> = {
  initial: 'CreatingOpenGame',
  states: {
    CreatingOpenGame: {on: {CreateGame: 'WaitingRoom'}},
    WaitingRoom: {on: {GameJoined: 'OpponentJoined'}},
    OpponentJoined: {on: {StartRound: 'ChooseWeapon'}},
    ChooseWeapon: {on: {ChooseWeapon: 'WeaponChosen'}},
    WeaponChosen: {
      on: {
        ResultArrived: [
          {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
          {target: 'InsufficientFunds', cond: 'insufficientFunds'},
        ],
      },
    },
    ResultPlayAgain: {on: {PlayAgain: 'WaitForRestart'}},
    WaitForRestart: {on: {StartRound: 'ChooseWeapon'}},
    InsufficientFunds: {},
    Resigned: {},
  },
};

interface GameSchema {
  states: {
    Empty: any;
    NeedAddress: any;
    Lobby: any;
    PlayerA: PlayerASchema;
    PlayerB: PlayerBSchema;
    GameOver: any;
  };
}
const game: StateNodeConfig<TContext, GameSchema, GameAction> = {
  initial: 'Empty',
  states: {
    Empty: {
      on: {
        UpdateProfile: 'NeedAddress',
      },
    },
    NeedAddress: {
      on: {
        GotAddressFromWallet: 'Lobby',
      },
    },
    Lobby: {
      on: {
        JoinOpenGame: 'PlayerA',
        NewOpenGame: 'PlayerB',
      },
    },
    PlayerA: {
      on: {GameOver: 'GameOver'},
      ...PlayerAStates,
    },
    PlayerB: {
      on: {GameOver: 'GameOver'},
      ...PlayerBStates,
    },
    GameOver: {on: {ExitToLobby: 'Lobby'}},
  },
};

// global machine
interface GlobalSchema {
  states: {
    rules: VisibilitySchema;
    wallet: VisibilitySchema;
  };
}

interface VisibilitySchema {
  states: {
    visible: any;
    invisible: any;
  };
}
const rules: StateNodeConfig<TContext, VisibilitySchema, GlobalAction> = {
  initial: 'invisible',
  states: {
    visible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'invisible'}},
    invisible: {on: {'APP.TOGGLE_RULES_VISIBILITY': 'visible'}},
  },
};
const wallet: StateNodeConfig<TContext, VisibilitySchema, GlobalAction> = {
  initial: 'invisible',
  states: {
    visible: {on: {'APP.HIDE_WALLET': 'invisible'}},
    invisible: {on: {'APP.SHOW_WALLET': 'visible'}},
  },
};
const global: StateNodeConfig<TContext, GlobalSchema, GlobalAction> = {
  type: 'parallel',
  states: {
    rules,
    wallet,
  },
};

// login machine
interface LoadingSchema {
  states: {
    loading: any;
    loggedIn: any;
  };
}
const loading: StateNodeConfig<TContext, BooleanSchema, AnyAction> = {
  initial: 'false',
  states: {
    true: {on: {'LOGIN.SUCCESS': 'false'}},
    false: {on: {'LOGIN.REQUEST': 'true'}},
  },
};
const loggedIn: StateNodeConfig<TContext, BooleanSchema, AnyAction> = {
  initial: 'false',
  states: {
    true: {},
    false: {on: {'LOGIN.SUCCESS': 'true'}},
  },
};
const login: StateNodeConfig<TContext, LoadingSchema, AnyAction> = {
  initial: 'loading',
  states: {
    loading,
    loggedIn,
  },
};

// metamask machine

interface BooleanSchema {
  states: {
    true: any;
    false: any;
  };
}

interface MMStateSchema {
  states: {
    metamaskState: {context: MetamaskState};
  };
}

const metamask: StateNodeConfig<TContext, MMStateSchema, MetamaskAction> = {
  initial: 'metamaskState',
  states: {
    metamaskState: {},
  },
};

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
