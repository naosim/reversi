/// <reference path="../core/player.ts"/>
/// <reference path="../core/board.ts"/>
/// <reference path="../core/side.ts"/>
/// <reference path="nextturntype.ts"/>
/// <reference path="context.ts"/>

class State {
  private endState: Option<EndState>
  private playerState: Option<PlayerState>
  constructor(endState: Option<EndState>, playerState: Option<PlayerState>) {
    this.endState = endState
    this.playerState = playerState
  }
  getContext(): Context {
    return [this.endState, this.playerState].filter(v => v.isDefined()).map(v => v.get().getContext())[0]
  }

  getEndState(): Option<EndState> { return this.endState }

  place(pos:Pos): State {
    if(this.playerState.isEmpty()) {
      throw 'game over'
    }
    return this.playerState.get().place(pos)
  }

  static createFromEndState(endState: EndState): State {
    return new State(OptionFactory.some(endState), OptionFactory.empty())
  }
  static createFromPlayerState(playerState: PlayerState): State {
    return new State(OptionFactory.empty(), OptionFactory.some(playerState))
  }

  static createStart(): State {
    let board = new Board([])
      .place(new Pos(new Horizontal("d"), new Vertical("4")), new Disk(Side.dark))
      .place(new Pos(new Horizontal("e"), new Vertical("4")), new Disk(Side.light))
      .place(new Pos(new Horizontal("d"), new Vertical("5")), new Disk(Side.light))
      .place(new Pos(new Horizontal("e"), new Vertical("5")), new Disk(Side.dark));
    let context = new Context(board, Side.dark)
    return this.createFromPlayerState(new PlayerState(context))
  }
}

class EndState {
  private context: Context
  constructor(context: Context) {
    this.context = context
  }

  getContext(): Context { return this.context }

  getScore(): Score { return this.context.getBoard().getScore() }

  restart(): State { return State.createStart() }
}

class PlayerState {
  private context: Context
  private player: Player
  constructor(context: Context) {
    this.context = context
    this.player = new Player(context.getSide(), context.getBoard())
  }
  getContext(): Context { return this.context }

  place(pos:Pos): State {
    let board = this.player.place(pos)
    let nextTurnType: NextTurnType = NextTurnType.decideNextTurnType(board, this.player.getSide())
    return nextTurnType.eachCase(
      darkSide => State.createFromPlayerState(new PlayerState(this.context.createNext(board, darkSide, pos))),
      lightSide => State.createFromPlayerState(new PlayerState(this.context.createNext(board, lightSide, pos))),
      () => State.createFromEndState(new EndState(new Context(board, this.context.getSide(), this.context.getStep())))
    )
  }
}

