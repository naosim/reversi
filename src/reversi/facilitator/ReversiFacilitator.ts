/// <reference path="../core/player.ts"/>
/// <reference path="../core/board.ts"/>
class ReversiFacilitator {
  private board: Board
  private boardLog :Array<[Board, Side]> = []
  private listener: ReversiFacilitatorListener
  private currentTurn: Side
  setEventListener(
    onDarkPlayerTurn: (Player, callback:(Board) => void) => Board,
    onLightPlayerTurn: (Player, callback:(Board) => void) => Board,
    onEnd: (Board) => void
  ) {
    this.listener = new ReversiFacilitatorListener(
      onDarkPlayerTurn,
      onLightPlayerTurn,
      onEnd
    )
  }
  
  start() {
    let board = new Board([])
      .place(new Pos(new Horizontal("d"), new Vertical("4")), new Disk(Side.dark))
      .place(new Pos(new Horizontal("e"), new Vertical("4")), new Disk(Side.light))
      .place(new Pos(new Horizontal("d"), new Vertical("5")), new Disk(Side.light))
      .place(new Pos(new Horizontal("e"), new Vertical("5")), new Disk(Side.dark));
    this.update(board)
  }

  back() {
    if(this.boardLog.length < 2) {
      throw 'log not exists'
    }
    this.boardLog.pop() // remove
    let t: [Board, Side] = this.boardLog.pop()
    this.update(t[0], t[1])
  }

  private update(board: Board, currentSide: Side = Side.light) {
    this.boardLog.push([board, currentSide])
    this.board = board

    let nextTurnType = ReversiFacilitator.decideNextTurnType(board, currentSide)
    nextTurnType.eachCase(
      (side) => {// onDark
        this.currentTurn = side
        this.listener.onDarkPlayerTurn(this.getCurrentPlayer(), (b) => this.update(b, this.currentTurn))
      },
      (side) => {// onLight
        this.currentTurn = side
        this.listener.onLightPlayerTurn(this.getCurrentPlayer(), (b) => this.update(b, this.currentTurn))
      },// onEnd
      () => this.listener.onEnd(this.board)
    )
  }

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
  
  getCurrentBoard(): Board { return this.board }
  getCurrentPlayer(): Player { return new Player(this.currentTurn, this.board) }
}

class ReversiFacilitatorListener {
  onDarkPlayerTurn: (Player, callback:(Board) => void) => Board
  onLightPlayerTurn: (Player, callback:(Board) => void) => Board
  onEnd: (Board) => void
  constructor(
    onDarkPlayerTurn: (Player, callback:(Board) => void) => Board,
    onLightPlayerTurn: (Player, callback:(Board) => void) => Board,
    onEnd: (Board) => void
  ) {
    this.onDarkPlayerTurn = onDarkPlayerTurn
    this.onLightPlayerTurn = onLightPlayerTurn
    this.onEnd = onEnd
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
  eachCase(onDark: (Side)=>void, onLight: (Side)=>void, onGameOver: ()=>void) {
    if(this == NextTurnType.dark) {
      onDark(Side.dark)
    } else if(this == NextTurnType.light) {
      onLight(Side.light)
    } else {
      onGameOver()
    }
  }
  static create(side: Side): NextTurnType { return side.isDark() ? this.dark : this.light }
}