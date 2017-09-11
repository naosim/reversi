/// <reference path="../volib.ts"/>
/// <reference path="side.ts"/>
/// <reference path="board.ts"/>
/// <reference path="pos.ts"/>
/// <reference path="placelogic.ts"/>
class Player {
  private side: Side;
  private board: Board;
  private placeLogic: PlaceLogic
  constructor(side :Side, board :Board) {
    this.side = side
    this.board = board
    this.placeLogic = new PlaceLogic(board)
  }
  place(pos: Pos): Board {
    let posList: Array<Pos> = this.placeLogic.getFlipablePositionsIfPlace(pos, this.side)
    if(posList.length == 0) {
      throw `${this.side.getValue()} player cant place at ${pos.getLogValue()}`
    }
    return posList
      .reduce((board, pos) => board.replace(pos, new Disk(this.side)), this.board)
      .place(pos, new Disk(this.side))
  }
}
