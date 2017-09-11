/// <reference path="disk.ts"/>
class Board {
  private square: Array<Disk>
  constructor(square: Array<Disk> = []) {
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
    if(this.look(pos).isDefined()) {
      throw "disk already exists"
    }
    let newSquare: Array<Disk> = this.getSquareMap()// copy
    let key = this.posToHash(pos)
    newSquare[key] = disk
    return new Board(newSquare)
  }

  replace(pos: Pos, disk: Disk): Board {
    if(this.look(pos).isEmpty()) {
      throw "disk not exists"
    }
    let newSquare: Array<Disk> = this.getSquareMap()// copy
    let key = this.posToHash(pos)
    newSquare[key] = disk
    return new Board(newSquare)
  }

  look(pos: Pos): Option<Disk> {
    let a = this.square[this.posToHash(pos)]
    return OptionFactory.of(a)
  }

  getScore():Score {
    var d = 0
    var l = 0
    let m = this.getSquareMap()
    Object.keys(this.getSquareMap())
      .map(k => m[k])
      .forEach(v => {
        if(v.getValue().isDark()) {
          d++
        } else {
          l++
        }
      });
    return new Score(d, l);
  }
}

class Score {
  private darkCount: number
  private lightCount: number
  constructor(darkCount: number, lightCount: number) {
    this.darkCount = darkCount
    this.lightCount = lightCount
  }
  getDarkCount(): number { return this.darkCount }
  getLightCount(): number { return this.lightCount }
  getWinner(): Option<Side> {
    if(this.darkCount == this.lightCount) {
      return OptionFactory.empty()
    }
    return OptionFactory.some(this.darkCount > this.lightCount ? Side.dark : Side.light)
  }
}