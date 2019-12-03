# How we built a rock paper scissors SCapp

# How to channelify your DApp

# How to build a state channel app

### that uses the statechannels nitro wallet

```mermaid
stateDiagram
    [*] --> Empty
    Empty --> NeedAddress
    NeedAddress --> Lobby


    Lobby --> GameChosen
    GameChosen --> ChooseWeapon
    ChooseWeapon --> WeaponChosen

    ChooseWeapon --> WeaponAndSaltChosen
    WeaponAndSaltChosen --> ResultPlayAgain

    WeaponChosen --> ResultPlayAgain
    ResultPlayAgain --> ChooseWeapon
    ResultPlayAgain --> WaitForRestart
    WaitForRestart --> ChooseWeapon

    WeaponAndSaltChosen --> InsufficientFunds
    WeaponChosen --> InsufficientFunds
    InsufficientFunds --> GameOver

    Lobby --> CreatingOpenGame
    CreatingOpenGame --> WaitingRoom
    WaitingRoom --> OpponentJoined
    OpponentJoined --> ChooseWeapon

    any--> Resigned
    Resigned --> GameOver
    GameOver --> Lobby
```

```nomnoml
    # edges: rounded
    [<start>]->[Empty]
    [Empty]->[NeedAddress]
    [NeedAddress]->[Lobby]
    [Lobby]->[GameChosen]
    [GameChosen]->[ChooseWeapon]
    [ChooseWeapon]->[WeaponChosen]
    [ChooseWeapon]->[WeaponAndSaltChosen]
    [WeaponAndSaltChosen]->[ResultPlayAgain]
    [WeaponChosen]->[ResultPlayAgain]
    [ResultPlayAgain]->[ChooseWeapon]
    [ResultPlayAgain]->[WaitForRestart]
    [WaitForRestart]->[ChooseWeapon]
    [WeaponAndSaltChosen]->[InsufficientFunds]
    [WeaponChosen]->[InsufficientFunds]
    [InsufficientFunds]->[GameOver]
    [Lobby]->[CreatingOpenGame]
    [CreatingOpenGame]->[WaitingRoom]
    [WaitingRoom]->[OpponentJoined]
    [OpponentJoined]->[ChooseWeapon]
    [any]->[Resigned]
    [Resigned]->[GameOver]
    [GameOver]->[Lobby]
```

```plantuml
@startuml
(*) --> "
{{
salt
{
<b>Welcome Screen
{^"Your details"
  Name    | "Alice"
  Twitter | "@Alice"
  [Cancel] | [  OK   ]
}
}
}}
" as Welcome

Welcome -down-> "
{{
salt
{
<b>Lobby
[create]
[join]
}
}}
" as Lobby

Lobby -right-> "
{{
salt
{
<b>CreateGame
{^"Create a game"
  BuyIn    | "1 ETH   "
  [Cancel] | [  OK   ]
}
}
}}
" as CreateGame

CreateGame -right-> "
{{
salt{
    <b>WaitingRoom
}
}}
" as WaitingRoom

Lobby -[#blue]-> "
{{
salt
{
<b>GameChosen
}
}}
" as GameChosen


@enduml
```
