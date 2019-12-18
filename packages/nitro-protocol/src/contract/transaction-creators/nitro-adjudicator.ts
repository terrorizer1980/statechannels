// @ts-ignore
import {TransactionRequest} from 'ethers/providers';
import {Interface, Signature} from 'ethers/utils';
import NitroAdjudicatorArtifact from '../../../build/contracts/NitroAdjudicator.json';
import {getChannelId} from '../channel';
import {encodeOutcome, Outcome} from '../outcome';
import {getFixedPart, hashAppPart, hashState, State} from '../state';

// TODO: Currently we are setting some arbitrary gas limit
// To avoid issues with Ganache sendTransaction and parsing BN.js
// If we don't set a gas limit some transactions will fail
const GAS_LIMIT = 3000000;

const NitroAdjudicatorContractInterface = new Interface(NitroAdjudicatorArtifact.abi);

export function createPushOutcomeTransaction(
  turnNumRecord: number,
  finalizesAt: number,
  state: State,
  outcome: Outcome
): TransactionRequest {
  const channelId = getChannelId(state.channel);
  const stateHash = hashState(state);
  const {participants} = state.channel;
  const challengerAddress = participants[state.turnNum % participants.length];
  const encodedOutcome = encodeOutcome(outcome);

  const data = NitroAdjudicatorContractInterface.functions.pushOutcome.encode([
    channelId,
    turnNumRecord,
    finalizesAt,
    stateHash,
    challengerAddress,
    encodedOutcome,
  ]);

  return {data, gasLimit: GAS_LIMIT};
}

export function concludePushOutcomeAndTransferAllArgs(
  states: State[],
  signatures: Signature[],
  whoSignedWhat: number[]
): any[] {
  // Sanity checks on expected lengths
  if (states.length === 0) {
    throw new Error('No states provided');
  }
  const {participants} = states[0].channel;
  if (participants.length !== signatures.length) {
    throw new Error(
      `Participants (length:${participants.length}) and signatures (length:${signatures.length}) need to be the same length`
    );
  }

  const lastState = states.reduce((s1, s2) => (s1.turnNum >= s2.turnNum ? s1 : s2), states[0]);
  const largestTurnNum = lastState.turnNum;
  const fixedPart = getFixedPart(lastState);
  const appPartHash = hashAppPart(lastState);

  const outcomeBytes = encodeOutcome(lastState.outcome);

  const numStates = states.length;

  return [
    largestTurnNum,
    fixedPart,
    appPartHash,
    outcomeBytes,
    numStates,
    whoSignedWhat,
    signatures,
  ];
}

export function createConcludePushOutcomeAndTransferAllTransaction(
  states: State[],
  signatures: Signature[],
  whoSignedWhat: number[]
): TransactionRequest {
  return {
    data: NitroAdjudicatorContractInterface.functions.concludePushOutcomeAndTransferAll.encode(
      concludePushOutcomeAndTransferAllArgs(states, signatures, whoSignedWhat)
    ),
    gasLimit: GAS_LIMIT,
  };
}