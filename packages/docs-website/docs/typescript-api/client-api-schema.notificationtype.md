---
id: client-api-schema.notificationtype
title: NotificationType type
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@statechannels/client-api-schema](./client-api-schema.md) &gt; [NotificationType](./client-api-schema.notificationtype.md)

## NotificationType type

<b>Signature:</b>

```typescript
export declare type NotificationType = {
    [T in Notification['method']]: [FilterByMethod<Notification, T>['params']];
};
```