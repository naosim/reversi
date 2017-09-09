/// <reference path="../volib.ts"/>

class Horizontal extends StringVO {}
class Vertical extends StringVO {}
class Pos {
  private horizontal:Horizontal;
  private vertical: Vertical;
  constructor(horizontal: Horizontal, vertical: Vertical) {
    this.horizontal = horizontal;
    this.vertical = vertical;
  }

  getHorizontal(): Horizontal {
    return this.horizontal
  }

  getVertical(): Vertical {
    return this.vertical
  }
}