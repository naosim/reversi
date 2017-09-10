/// <reference path="../volib.ts"/>
/// <reference path="../lib/option.ts"/>

class _AxisChar {
  private values: string
  constructor(values: string) {
    this.values = values;
  }

  getNext(current: string): Option<string> {
    var i = this.values.indexOf(current) + 1
    if(i >= this.values.length) {
      return OptionFactory.empty()
    }
    return OptionFactory.some(this.values[i])
  }

  getPrev(current: string): Option<string> {
    var i = this.values.indexOf(current) - 1
    if(i < 0) {
      return OptionFactory.empty()
    }
    return OptionFactory.some(this.values[i])
  }

  all(): Array<string> {
    let result = []
    for(var i = 0; i < this.values.length; i++) {
      result.push(this.values[i])
    }
    return result
  }
}
class Horizontal extends StringVO {
  private static axisChar: _AxisChar = new _AxisChar('abcdefgh');
  getNext(): Option<Horizontal> {
    return Horizontal.axisChar.getNext(this.getValue()).map(v => new Horizontal(v))
  }
  getPrev(): Option<Horizontal> {
    return Horizontal.axisChar.getPrev(this.getValue()).map(v => new Horizontal(v))
  }

  static all(): Array<Horizontal> {
    return Horizontal.axisChar.all().map(v => new Horizontal(v))
  }
}
class Vertical extends StringVO {
  private static axisChar: _AxisChar = new _AxisChar('12345678');
  getNext(): Option<Vertical> {
    return Vertical.axisChar.getNext(this.getValue()).map(v => new Vertical(v))
  }
  getPrev(): Option<Vertical> {
    return Vertical.axisChar.getPrev(this.getValue()).map(v => new Vertical(v))
  }
  static all(): Array<Vertical> {
    return Vertical.axisChar.all().map(v => new Vertical(v))
  }
}
class Pos {
  private horizontal:Horizontal;
  private vertical: Vertical;
  constructor(horizontal: Horizontal, vertical: Vertical) {
    this.horizontal = horizontal;
    this.vertical = vertical;
  }

  getHorizontal(): Horizontal { return this.horizontal }

  getVertical(): Vertical { return this.vertical }

  getNext(d: Direction): Option<Pos> {
    if(d == Direction.up) {
      return this.vertical.getPrev().map(v => new Pos(this.horizontal, v))
    } else if(d == Direction.down) {
      return this.vertical.getNext().map(v => new Pos(this.horizontal, v))
    } else if(d == Direction.left) {
      return this.horizontal.getPrev().map(v => new Pos(v, this.vertical))
    } else if(d == Direction.right) {
      return this.horizontal.getNext().map(v => new Pos(v, this.vertical))
    } else if(d == Direction.up_left) {
      return this.getNext(Direction.up).flatMap(p => p.getNext(Direction.left))
    } else if(d == Direction.up_right) {
      return this.getNext(Direction.up).flatMap(p => p.getNext(Direction.right))
    } else if(d == Direction.down_left) {
      return this.getNext(Direction.down).flatMap(p => p.getNext(Direction.left))
    } else if(d == Direction.down_right) {
      return this.getNext(Direction.down).flatMap(p => p.getNext(Direction.right))
    }
  }

  getLogValue(): string {
    return this.getHorizontal().getValue() + this.getVertical().getValue()
  }

  static all(): Array<Pos> {
    let result = []
    Vertical.all().forEach(v => Horizontal.all().forEach(h => result.push(new Pos(h, v))))
    return result
  }
}

enum Direction {
  left = 1, right, up, down,
  up_right, up_left, down_right, down_left,
}