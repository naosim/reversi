/// <reference path="../core/player.ts"/>
/// <reference path="../core/board.ts"/>
class ReversiFacilitator {
  private board :Board
  private boardLog :Array<[Board, Side]> = []

  private onDarkPlayerTurn: (Player, callback:(Board) => void) => Board
  private onLightPlayerTurn: (Player, callback:(Board) => void) => Board
  private onEnd: (Board) => void
  private currentTurn: Side
  setEventListener(
    onDarkPlayerTurn: (Player, callback:(Board) => void) => Board,
    onLightPlayerTurn: (Player, callback:(Board) => void) => Board,
    onEnd: (Board) => void
  ) {
    this.onDarkPlayerTurn = onDarkPlayerTurn
    this.onLightPlayerTurn = onLightPlayerTurn
    this.onEnd = onEnd
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
    this.currentTurn = currentSide.reverse()

    if(new PlaceLogic(board).getPlacablePositions(this.currentTurn).length == 0) {
      this.currentTurn = this.currentTurn.reverse()
    }
    if(new PlaceLogic(board).getPlacablePositions(this.currentTurn).length == 0) {
      // 試合終了
      this.onEnd(this.board)
    }

    if(this.currentTurn.isDark()) {
      this.onDarkPlayerTurn(this.getCurrentPlayer(), (b) => this.update(b, this.currentTurn))
    } else {
      this.onLightPlayerTurn(this.getCurrentPlayer(), (b) => this.update(b, this.currentTurn))
    }
  }
  
  getCurrentBoard(): Board { return this.board }
  getCurrentPlayer(): Player { return new Player(this.currentTurn, this.board) }
}