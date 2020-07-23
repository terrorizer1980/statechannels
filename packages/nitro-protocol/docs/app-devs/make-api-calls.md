---
id: make-api-calls
title: Make API calls using the ChannelClient
---


## Sequence diagram
In the following, `p` is shorthand for `window.channelProvider`, and Client(A/B) is an instance of the [`ChannelClient` class](../channel-client-api/channel-client.channelclient) created by each participants' application. 

Also shown is the "activation" of each wallet at certain times, indicating the UI will popup and the user may be required to send a blockchain transaction or otherwise signal their intent to perform an action. 

<div class="mermaid" align="center">
sequenceDiagram
participant WalletA
participant ClientA
participant ClientB
participant WalletB
    par concurrent
    note left of WalletB: Handshake & Enable
        ClientA->>WalletA: p.mountWalletComponent('https:/...');
        ClientA->>WalletA: p.enable();
        ClientB->>WalletB: p.mountWalletComponent('https:/...');
        ClientB->>WalletB: p.enable();
        ClientA->>WalletA: c.onMessageQueued(callback)
        ClientA->>WalletA: c.onChannelProposed(callback)
        ClientA->>WalletA: c.onChannelUpdated(callback)
        ClientB->>WalletB: c.onMessageQueued(callback)
        ClientB->>WalletB: c.onChannelProposed(callback)
        ClientB->>WalletB: c.onChannelUpdated(callback)
    end
rect rgba(0, 0, 255, .1)
    note left of WalletB: Opening a channel
    ClientA->>WalletA: c.createChannel();
    WalletA-->>ClientA: ChannelUpdated('proposed')
    WalletA-->>ClientA: MessageQueued(msg)
    ClientA->>ClientB: msg
    ClientB->>WalletB: pushMessage(msg)
    WalletB-->>ClientB: ChannelProposed('id')
    ClientB->>+WalletB: c.joinChannel('id');
    WalletB-->>ClientB: ChannelUpdated('opening');
    WalletB-->>ClientB: MessageQueued(msg)
    ClientB->>ClientA: msg;
    ClientA->>+WalletA: c.pushMessage(msg);
    WalletA-->>-ClientA: ChannelUpdated('running')
    WalletB-->>-ClientB: ChannelUpdated('running')
end
loop n times 
    note left of WalletB: Running a channel
    ClientA->>WalletA: c.updateChannel(state-A);
    WalletA-->>ClientA: ChannelUpdated(state-A)
    WalletA-->>ClientA: MessageQueued(msg)
    ClientA->>ClientB: msg
    ClientB->>WalletB: pushMessage(msg)
    WalletB-->>ClientB: ChannelUpdated(state-A)
    ClientB->>+WalletB: c.updateChannel(state-B);
    WalletB-->>ClientB: ChannelUpdated(state-B);
    WalletB-->>ClientB: MessageQueued(msg)
    ClientB->>ClientA: msg;
    ClientA->>WalletA: pushMessage(msg)
    WalletA-->>ClientA: ChannelUpdated(state-B)
end
rect rgba(0, 0, 255, .1)
note left of WalletB: Closing a channel
    ClientA->>WalletA: c.closeChannel();
    WalletA-->>ClientA: ChannelUpdated('closing')
    WalletA-->>ClientA: MessageQueued(msg)
    ClientA->>ClientB: msg
    ClientB->>WalletB: pushMessage(msg)
    WalletB-->>ClientB: ChannelUpdated('closing')
    WalletB-->>ClientB: ChannelUpdated('closed')
    WalletB-->>ClientB: MessageQueued(msg)
    ClientB->>ClientA: msg;
    ClientA->>+WalletA: c.pushMessage(msg);
    WalletA-->>-ClientA: ChannelUpdated('closed')
end
</div>
