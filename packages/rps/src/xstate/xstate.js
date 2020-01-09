import {Machine, interpret} from 'xstate';

const PlayerAStates = {
  initial: 'GameChosen',
  states: {
    GameChosen: {on: {START_ROUND: 'ChooseWeapon'}},
    ChooseWeapon: {on: {CHOOSE_WEAPON: 'WeaponChosen'}},
    WeaponChosen: {on: {CHOOSE_SALT: 'WeaponAndSaltChosen'}},
    WeaponAndSaltChosen: {
      on: {
        RESULT_ARRIVED: [
          {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
          {target: 'InsufficientFunds', cond: 'insufficientFunds'},
        ],
      },
    },
    ResultPlayAgain: {on: {PLAY_AGAIN: 'WaitForRestart'}},
    WaitForRestart: {on: {START_ROUND: 'ChooseWeapon'}},
    InsufficientFunds: {},
    Resigned: {},
  },
};

const PlayerBStates = {
  initial: 'CreatingOpenGame',
  states: {
    CreatingOpenGame: {on: {CREATE_GAME: 'WaitingRoom'}},
    WaitingRoom: {on: {GAME_JOINED: 'OpponentJoined'}},
    OpponentJoined: {on: {START_ROUND: 'ChooseWeapon'}},
    ChooseWeapon: {on: {CHOOSE_WEAPON: 'WeaponChosen'}},
    WeaponChosen: {
      on: {
        RESULT_ARRIVED: [
          {target: 'ResultPlayAgain', cond: 'sufficientFunds'},
          {target: 'InsufficientFunds', cond: 'insufficientFunds'},
        ],
      },
    },
    ResultPlayAgain: {on: {PLAY_AGAIN: 'WaitForRestart'}},
    WaitForRestart: {on: {START_ROUND: 'ChooseWeapon'}},
    InsufficientFunds: {},
    Resigned: {},
  },
};

const game = {
  initial: 'Empty',
  states: {
    Empty: {
      on: {
        UPDATE_PROFILE: 'NeedAddress',
      },
    },
    NeedAddress: {
      on: {
        GOT_ADDRESS_FROM_WALLET: 'Lobby',
      },
    },
    Lobby: {
      on: {
        JOIN_OPEN_GAME: 'PlayerA',
        CREATE_OPEN_GAME: 'PlayerB',
      },
    },
    PlayerA: {
      on: {GAME_OVER: 'GameOver'},
      ...PlayerAStates,
    },
    PlayerB: {
      on: {GAME_OVER: 'GameOver'},
      ...PlayerBStates,
    },
    GameOver: {on: {EXIT_TO_LOBBY: 'Lobby'}},
  },
};

const rps = Machine({
  id: 'rps',
  type: 'parallel',
  states: {
    game,
  },
});
