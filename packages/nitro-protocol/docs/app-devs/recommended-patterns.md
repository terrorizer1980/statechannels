---
id: recommended-patterns
title: Recommended patterns
---

## Wrapping the channelClient

We recommend that you wrap the channelClient in an `appSecificChannelClient`, which can translate the general-purpose, protocol-level concepts of `appData`and `outcomes` into something easier to work with. This additional layer of abstraction should result in cleaner code for the rest of your application. 

Here's a sketch of what you could do, for the example of a unidirectional payment application: 

```typescript
export class PaymentChannelClient {
  channelCache: ChannelCache = {};

  // store our instance of the ChannelClient as a propery of this class
  constructor(readonly channelClient: ChannelClient) {}

  async createChannel(peers: Peers): Promise<ChannelState> {
    const channelResult = await this.channelClient.createChannel(
      formatParticipants(peers),
      formatAllocations(peers),
      SINGLE_ASSET_PAYMENT_CONTRACT_ADDRESS,
      INITIAL_APP_DATA,
      FUNDING_STRATEGY
    );
    return channelState;
  }

  // Accepts an app-specific (payment-channel-friendly) callback,
  // performs the necessary encoding, and subscribes to the 
  // channelClient with an appropriate, API-compliant callback
  onChannelUpdated(appCallback: (channelState: ChannelState) => any) {
    return this.channelClient.onChannelUpdated(async cr => {
      const channelState = convertToChannelState(cr);
      appCallback(channelState);
    });
  }



  
  // payer may use this method to make payments (if they have sufficient funds)
  async makePayment(channelId: string, amount: string) {
    let amountWillPay = amount;
    // First, wait for my turn
    const {payer, beneficiary} = await this.channelState(channelId)
      .pipe(first(cs => this.canUpdateChannel(cs)))
      .toPromise();

    if (bigNumberify(payer.balance).eq(0)) {
      logger.error('Out of funds. Closing channel.');
      await this.closeChannel(channelId);
      return;
    }

    if (bigNumberify(payer.balance).lt(amount)) {
      amountWillPay = payer.balance;
      logger.debug({amountAskedToPay: amount, amountWillPay}, 'Paying less than PEER_TRUST');
    }

    try {
      await this.updateChannel(channelId, {
        beneficiary: {...beneficiary, balance: add(beneficiary.balance, amountWillPay)},
        payer: {...payer, balance: subtract(payer.balance, amountWillPay)}
      });
    } catch (error) {
      if (error.error.code === ErrorCode.UpdateChannel.NotYourTurn) {
        logger.warn({channelId}, 'Possible race condition detected');
      } else {
        logger.error({error}, 'makePayment: Unexpected error');
      }
    }
  }

  // beneficiary may use this method to accept payments
  async acceptChannelUpdate(channelState: ChannelState) {
    const {channelId, beneficiary, payer} = channelState;
    await this.updateChannel(channelId, {beneficiary, payer});
  }

}

const convertToChannelState = (channelResult: ChannelResult): ChannelState => {
  const {
    turnNum,
    channelId,
    participants,
    allocations,
    challengeExpirationTime,
    status
  } = channelResult;

  return {
    channelId,
    turnNum: utils.bigNumberify(turnNum),
    status,
    challengeExpirationTime,
    beneficiary: peer(
      participants[Index.Beneficiary].participantId,
      participants[Index.Beneficiary].destination,
      allocations[0].allocationItems[Index.Beneficiary].amount
    ),
    payer: peer(
      participants[Index.Payer].participantId,
      participants[Index.Payer].destination,
      allocations[0].allocationItems[Index.Payer].amount
    )
  };
};

```
### Maintain a cache of channel state
This is convenient data structure to maintain, as it can provide data synchronously to your UI.