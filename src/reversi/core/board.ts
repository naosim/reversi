/// <reference path="disk.ts"/>
class Board {
  private square: Array<Disk>
  constructor(square: Array<Disk>) {
    this.square = square;
  }

  getSquareMap(): Array<Disk> {
    // copy object
    return Object.keys(this.square).reduce((memo, k) => {
      memo[k] = this.square[k];
      return memo;
    }, []);
  }

  private posToHash(pos: Pos) {
    return `Pos(Horizontal(${pos.getHorizontal().getValue()}), Vertical(${pos.getVertical().getValue()}))`
  }

  place(pos: Pos, disk: Disk): Board {
    if(this.look(pos)) {
      throw "disk already exists"
    }
    let newSquare: Array<Disk> = this.getSquareMap()// copy
    let key = this.posToHash(pos)
    newSquare[key] = disk
    return new Board(newSquare)
  }

  replace(pos: Pos, disk: Disk): Board {
    if(!this.look(pos)) {
      throw "disk not exists"
    }
    let newSquare: Array<Disk> = this.getSquareMap()// copy
    let key = this.posToHash(pos)
    newSquare[key] = disk
    return new Board(newSquare)
  }

  look(pos: Pos): Disk {
    return this.square[this.posToHash(pos)]
  }
}