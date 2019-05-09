import * as scenarios from './scenarios';
import { IndirectDefundingState } from '../state';
import { ProtocolStateWithSharedData } from '../..';
import { getLastMessage } from '../../../state';
import { SignedCommitment } from '../../../../domain';
import * as states from '../state';
import { initialize, indirectDefundingReducer } from '../reducer';

describe('player A happy path', () => {
  const scenario = scenarios.playerAHappyPath;
  const {
    processId,
    channelId,
    ledgerId,
    store,
    proposedAllocation,
    proposedDestination,
  } = scenario.initialParams;

  describe('when initializing', () => {
    const result = initialize(
      processId,
      channelId,
      ledgerId,
      proposedAllocation,
      proposedDestination,
      store,
    );
    itTransitionsTo(result, states.WAIT_FOR_LEDGER_UPDATE);
    itSendsMessage(result, scenario.initialParams.reply);
  });

  describe('when in WaitForLedgerUpdate', () => {
    const { state, action } = scenario.waitForLedgerUpdate;
    const updatedState = indirectDefundingReducer(state.state, state.store, action);
    itTransitionsTo(updatedState, states.SUCCESS);
  });
});

describe('player A invalid commitment', () => {
  const scenario = scenarios.playerAInvalidCommitment;

  describe('when in WaitForLedgerUpdate', () => {
    const { state, action } = scenario.waitForLedgerUpdate;
    const updatedState = indirectDefundingReducer(state.state, state.store, action);
    itTransitionsTo(updatedState, states.FAILURE);
  });
});

describe('player B happy path', () => {
  const scenario = scenarios.playerBHappyPath;
  const {
    processId,
    channelId,
    ledgerId,
    store,
    proposedAllocation,
    proposedDestination,
  } = scenario.initialParams;

  describe('when initializing', () => {
    const result = initialize(
      processId,
      channelId,
      ledgerId,
      proposedAllocation,
      proposedDestination,
      store,
    );
    itTransitionsTo(result, states.WAIT_FOR_LEDGER_UPDATE);
  });

  describe('when in WaitForLedgerUpdate', () => {
    const { state, action, reply } = scenario.waitForLedgerUpdate;
    const updatedState = indirectDefundingReducer(state.state, state.store, action);
    itTransitionsTo(updatedState, states.SUCCESS);
    itSendsMessage(updatedState, reply);
  });
});

describe('player B invalid commitment', () => {
  const scenario = scenarios.playerBInvalidCommitment;

  describe('when in WaitForLedgerUpdate', () => {
    const { state, action } = scenario.waitForLedgerUpdate;
    const updatedState = indirectDefundingReducer(state.state, state.store, action);
    itTransitionsTo(updatedState, states.FAILURE);
  });
});

describe('not defundable', () => {
  const scenario = scenarios.notDefundable;
  const {
    processId,
    channelId,
    ledgerId,
    store,
    proposedAllocation,
    proposedDestination,
  } = scenario.initialParams;
  describe('when initializing', () => {
    const result = initialize(
      processId,
      channelId,
      ledgerId,
      proposedAllocation,
      proposedDestination,
      store,
    );
    itTransitionsTo(result, states.FAILURE);
  });
});

type ReturnVal = ProtocolStateWithSharedData<IndirectDefundingState>;
function itTransitionsTo(state: ReturnVal, type: IndirectDefundingState['type']) {
  it(`transitions protocol state to ${type}`, () => {
    expect(state.protocolState.type).toEqual(type);
  });
}

function itSendsMessage(state: ReturnVal, message: SignedCommitment) {
  it('sends a message', () => {
    const lastMessage = getLastMessage(state.sharedData);
    if (lastMessage && 'messagePayload' in lastMessage) {
      const dataPayload = lastMessage.messagePayload.data;
      // This is yuk. The data in a message is currently of 'any' type..
      if (!('signedCommitment' in dataPayload)) {
        fail('No signedCommitment in the last message.');
      }
      const { commitment, signature } = dataPayload.signedCommitment;
      expect({ commitment, signature }).toEqual(message);
    } else {
      fail('No messages in the outbox.');
    }
  });
}
// import * as states from '../state';
// import { initialize, indirectDefundingReducer } from '../reducer';
// import * as scenarios from './scenarios';
// import { Commitment } from 'magmo-wallet-client/node_modules/fmg-core';
// import { ProtocolStateWithSharedData } from '../..';
// import { expectThisCommitmentSent } from '../../../__tests__/helpers';
// import * as SigningUtil from '../../../../domain/signing-utils';

// // Mocks
// const validateMock = jest.fn().mockReturnValue(true);
// Object.defineProperty(SigningUtil, 'validCommitmentSignature', { value: validateMock });

// // Helper functions
// const itTransitionsTo = (
//   result: { protocolState: states.IndirectDefundingState },
//   type: string,
// ) => {
//   it(`transitions to ${type}`, () => {
//     expect(result.protocolState.type).toEqual(type);
//   });
// };

// const itTransitionsToFailure = (
//   result: { protocolState: states.IndirectDefundingState },
//   failure: states.Failure,
// ) => {
//   it(`transitions to failure with reason ${failure.reason}`, () => {
//     expect(result.protocolState).toMatchObject(failure);
//   });
// };

// export const itSendsThisCommitment = (
//   state: ProtocolStateWithSharedData<states.IndirectDefundingState>,
//   commitment: Partial<Commitment>,
// ) => {
//   it('sends the correct commitment', () => {
//     expectThisCommitmentSent(state.sharedData, commitment);
//   });
// };

// // Tests
// describe('player A happy path', () => {
//   const scenario = scenarios.playerAHappyPath;
//   const { processId, channelId, sharedData, proposedAllocation, proposedDestination } = scenario;

//   describe('when initializing', () => {
//     const result = initialize(
//       processId,
//       channelId,
//       proposedAllocation,
//       proposedDestination,
//       sharedData.initializingSharedData,
//     );
//     itTransitionsTo(result, states.WAIT_FOR_LEDGER_UPDATE);
//     itSendsThisCommitment(result, scenario.firstUpdateCommitment);
//   });

//   describe(`when in ${states.WAIT_FOR_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForLedgerUpdate;
//     const action = scenario.actions.commitmentReceived;
//     const result = indirectDefundingReducer(
//       state,
//       sharedData.waitForLedgerUpdateSharedData,
//       action,
//     );

//     itSendsThisCommitment(result, scenario.secondUpdateCommitment);
//     itTransitionsTo(result, states.SUCCESS);
//   });
// });

// describe('player B happy path', () => {
//   const scenario = scenarios.playerBHappyPath;
//   const { processId, channelId, proposedAllocation, proposedDestination, sharedData } = scenario;

//   describe('when initializing', () => {
//     const result = initialize(
//       processId,
//       channelId,
//       proposedAllocation,
//       proposedDestination,
//       sharedData.initializingSharedData,
//     );
//     itTransitionsTo(result, states.WAIT_FOR_LEDGER_UPDATE);
//   });

//   describe(`when in ${states.WAIT_FOR_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForLedgerUpdate;
//     const action = scenario.actions.firstCommitmentReceived;
//     const result = indirectDefundingReducer(state, sharedData.initializingSharedData, action);

//     itSendsThisCommitment(result, scenario.updateCommitment);
//     itTransitionsTo(result, states.WAIT_FOR_FINAL_LEDGER_UPDATE);
//   });

//   describe(`when in ${states.WAIT_FOR_FINAL_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForFinalLedgerUpdate;
//     const action = scenario.actions.finalCommitmentReceived;
//     const result = indirectDefundingReducer(state, sharedData.waitForFinalUpdateSharedData, action);

//     itTransitionsTo(result, states.SUCCESS);
//   });
// });

// describe('not defundable', () => {
//   const scenario = scenarios.notDefundable;
//   const { processId, channelId, proposedAllocation, proposedDestination, sharedData } = scenario;

//   describe('when initializing', () => {
//     const result = initialize(
//       processId,
//       channelId,
//       proposedAllocation,
//       proposedDestination,
//       sharedData,
//     );
//     itTransitionsToFailure(result, scenario.states.failure);
//   });
// });

// describe('player A invalid commitment', () => {
//   const scenario = scenarios.playerAInvalidCommitment;
//   const { sharedData } = scenario;

//   describe(`when in ${states.WAIT_FOR_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForLedgerUpdate;
//     const action = scenario.actions.commitmentReceived;
//     const result = indirectDefundingReducer(state, sharedData, action);
//     itTransitionsToFailure(result, scenario.states.failure);
//   });
// });

// describe('player B invalid first commitment', () => {
//   const scenario = scenarios.playerBInvalidFirstCommitment;
//   const { sharedData } = scenario;

//   describe(`when in ${states.WAIT_FOR_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForLedgerUpdate;
//     const action = scenario.actions.firstCommitmentReceived;
//     const result = indirectDefundingReducer(state, sharedData, action);
//     itTransitionsToFailure(result, scenario.states.failure);
//   });
// });

// describe('player B invalid final commitment', () => {
//   const scenario = scenarios.playerBInvalidFinalCommitment;
//   const { sharedData } = scenario;

//   describe(`when in ${states.WAIT_FOR_FINAL_LEDGER_UPDATE}`, () => {
//     const state = scenario.states.waitForFinalLedgerUpdate;
//     const action = scenario.actions.finalCommitmentReceived;
//     const result = indirectDefundingReducer(state, sharedData, action);
//     itTransitionsToFailure(result, scenario.states.failure);
//   });
// });
