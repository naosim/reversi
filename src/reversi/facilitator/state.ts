/// <reference path="../core/player.ts"/>
/// <reference path="../core/board.ts"/>
/// <reference path="../core/side.ts"/>

class Context {
  private board: Board
  private side: Side
  private step: number
  private log: Array<Pos>
  constructor(board: Board, side: Side, step: number = 1, log: Array<Pos> = []) {
    this.board = board
    this.side = side
    this.step = step
    this.log = log
  }

  getSide(): Side { return this.side }
  getBoard(): Board { return this.board }
  getStep(): number { return this.step }

  createNext(board: Board, side: Side, pos: Pos): Context {
    let ary: Array<Pos> = [].concat(this.log)
    ary.push(pos)
    return new Context(board, side, this.step + 1, ary)
  }
}

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
  getContext(): Context {
    return this.context
  }

  getScore(): Score {
    return this.context.getBoard().getScore()
  }
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

class NextTurnType {
  public static dark = new NextTurnType(OptionFactory.some(Side.dark))
  public static light = new NextTurnType(OptionFactory.some(Side.light))
  public static gameover = new NextTurnType(OptionFactory.empty())

  private sideOption: Option<Side>
  constructor(sideOption: Option<Side>) {
    this.sideOption = sideOption
  }
  getSideForce(): Side { return this.sideOption.get() }
  isGameOver(): boolean { return this == NextTurnType.gameover }
  eachCase<T>(onDark: (Side)=>T, onLight: (Side)=>T, onGameOver: ()=>T) {
    if(this == NextTurnType.dark) {
      return onDark(Side.dark)
    } else if(this == NextTurnType.light) {
      return onLight(Side.light)
    } else {
      return onGameOver()
    }
  }
  static create(side: Side): NextTurnType { return side.isDark() ? this.dark : this.light }

  static decideNextTurnType(board: Board, currentSide: Side): NextTurnType {
    // 次の番手が置ける場所があるか
    if(new PlaceLogic(board).getPlacablePositions(currentSide.reverse()).length > 0) {
      return NextTurnType.create(currentSide.reverse())
    }

    // 今の番手が置ける場所があるか
    if(new PlaceLogic(board).getPlacablePositions(currentSide).length > 0) {
      return NextTurnType.create(currentSide)
    }

    // 置けるプレイヤがいないなら試合終了
    return NextTurnType.gameover
  }
}