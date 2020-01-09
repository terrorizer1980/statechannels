import {Machine, interpret} from 'xstate';

const PlayerAStates = {
  initial: 'GameChosen',
  states: {
    GameChosen: {},
    ChooseWeapon: {},
    WeaponChosen: {},
    WeaponAndSaltChosen: {},
    ResultPlayAgain: {},
    WaitForRestart: {},
    InsufficientFunds: {},
    Resigned: {},
  },
};

const PlayerBStates = {
  initial: 'CreatingOpenGame',
  states: {
    CreatingOpenGame: {},
    WaitingRoom: {},
    OpponentJoined: {},
    ChooseWeapon: {},
    WeaponChosen: {},
    InsufficientFunds: {},
    ResultPlayAgain: {},
    WaitForRestart: {},
    Resigned: {},
  },
};

const setupMachine = Machine({
  id: 'Setup',
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
      ...PlayerAStates,
    },
    PlayerB: {
      ...PlayerBStates,
    },
  },
});

const promiseService = interpret(promiseMachine).onTransition(state => console.log(state.value));

// Start the service
promiseService.start();
// => 'pending'

promiseService.send('RESOLVE');
// => 'resolved'
