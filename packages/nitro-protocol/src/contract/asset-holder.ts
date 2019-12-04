import {BigNumber, bigNumberify, getAddress} from 'ethers/utils';
import {parseEventResult} from '../ethers-utils';

export interface DepositedEvent {
  destination: string;
  amountDeposited: BigNumber;
  destinationHoldings: BigNumber;
}

export interface AssetTransferredEvent {
  channelId: string;
  destination: string;
  amount: BigNumber;
}

export function getDepositedEvent(eventResult: any[]): DepositedEvent {
  const {destination, amountDeposited, destinationHoldings} = parseEventResult(eventResult);
  return {
    destination,
    amountDeposited: bigNumberify(amountDeposited),
    destinationHoldings: bigNumberify(destinationHoldings),
  };
}

export function getAssetTransferredEvent(eventResult: any[]): AssetTransferredEvent {
  const {channelId, destination, amount} = parseEventResult(eventResult);
  return {
    channelId,
    destination,
    amount: bigNumberify(amount),
  };
}

export function convertBytes32ToAddress(bytes32: string): string {
  const normalized = bigNumberify(bytes32).toHexString();
  return getAddress(`0x${normalized.slice(-40)}`);
}

// e.g.,
// 0x9546E319878D2ca7a21b481F873681DF344E0Df8 becomes
// 0x0000000000000000000000009546E319878D2ca7a21b481F873681DF344E0Df8
export function convertAddressToBytes32(address: string): string {
  const normalizedAddress = bigNumberify(address).toHexString();
  if (normalizedAddress.length !== 42) {
    throw new Error(
      `Address value is not right length. Expected length of 42 received length ${normalizedAddress.length} instead.`
    );
  }
  // We pad to 66 = (32*2) + 2('0x')
  return `0x${normalizedAddress
    .toLowerCase()
    .substr(2)
    .padStart(64, '0')}`;
}
