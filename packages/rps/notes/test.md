```nomnoml

[<start>]->[Empty]
[Empty]->[NeedAddress]
[NeedAddress]->[Lobby]
[Lobby]-:>[<actor>A]
[<actor>A]-:>[<a>GameChosen]
[<a>GameChosen]-:>[ChooseWeapon]

[Lobby]->[<actor>B]
[<actor>B]->[<b>CreatingOpenGame]
[<b>CreatingOpenGame]->[<b>WaitingRoom]
[<b>WaitingRoom]->[<b>OpponentJoined]
[<b>OpponentJoined]->[<b>ChooseWeapon]


[Empty]
[NeedAddress]
[Lobby]
[<b>CreatingOpenGame]
[<b>WaitingRoom]
[<a>GameChosen]
[OpponentJoined]
[ChooseWeapon]
[WeaponChosen]
[WeaponAndSaltChosen]
[ResultPlayAgain]
[WaitForRestart]
[InsufficientFunds]
[Resigned]
[GameOver]

#.a: fill=#8f8 align=center visual=roundrect direction=right
#.b: fill=#fff align=center visual=roundrect
# edges: rounded

```
