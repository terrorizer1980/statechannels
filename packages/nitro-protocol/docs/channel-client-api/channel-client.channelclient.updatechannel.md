---
id: channel-client.channelclient.updatechannel
title: ChannelClient.updateChannel() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@statechannels/channel-client](./channel-client.md) &gt; [ChannelClient](./channel-client.channelclient.md) &gt; [updateChannel](./channel-client.channelclient.updatechannel.md)

## ChannelClient.updateChannel() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Updates the state of a channel

<b>Signature:</b>

```typescript
updateChannel(channelId: string, allocations: TokenAllocations, appData: string): Promise<ChannelResult>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  channelId | string | id for the state channel |
|  allocations | [TokenAllocations](./channel-client.tokenallocations.md) | Updated allocation of funds for this channel |
|  appData | string | Updated application data for this channel |

<b>Returns:</b>

Promise&lt;ChannelResult&gt;

A promise that resolves to a ChannelResult.