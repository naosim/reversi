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