---
id: version-0.2.0-channel-client.channelclient.onmessagequeued
title: ChannelClient.onMessageQueued() method
hide_title: true
original_id: channel-client.channelclient.onmessagequeued
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@statechannels/channel-client](./channel-client.md) &gt; [ChannelClient](./channel-client.channelclient.md) &gt; [onMessageQueued](./channel-client.channelclient.onmessagequeued.md)

## ChannelClient.onMessageQueued() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Registers a callback that will fire when an outbound message is ready to be dispatched.

<b>Signature:</b>

```typescript
onMessageQueued(callback: (result: MessageQueuedNotification['params']) => void): UnsubscribeFunction;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  callback | (result: [MessageQueuedNotification](./client-api-schema.messagequeuednotification.md)<!-- -->\['params'\]) =&gt; void | An function that accepts a MessageQueuedNotification. |

<b>Returns:</b>

[UnsubscribeFunction](./channel-client.unsubscribefunction.md)

A function that will unregister the callback when invoked

## Remarks

This method should be hooked up to your applications's messaging layer.