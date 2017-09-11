class PlaceLogic {
  private board: Board
  constructor(board: Board) {
    this.board = board;
  }

  getPlacablePositions(side: Side): Array<Pos> {
    return Pos.all()
      .filter(p => this.board.look(p).isEmpty())
      .filter(p => this.getFlipablePositionsIfPlace(p, side).length > 0)
  }

  getFlipablePositionsIfPlace(pos:Pos, side: Side): Array<Pos> {
    if(this.board.look(pos).isDefined()) {
      throw "disk already exists"
    }
    return [].concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.left))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.right))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.up))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.down))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.up_left))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.up_right))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.down_left))
      .concat(this.getFlipablePositionsIfPlaceWithDirection(pos, side, Direction.down_right))
  }

  private getFlipablePositionsIfPlaceWithDirection(pos:Pos, side: Side, d: Direction): Array<Pos> {
    var posOption = pos.getNext(d)
    var diskOption = posOption.flatMap(p => this.board.look(p))
    var result: Array<Pos> = []
    while(posOption.isDefined() && diskOption.isDefined() && diskOption.get().sideIs(side.reverse())) {
      result.push(posOption.get())
      posOption = posOption.get().getNext(d)
      diskOption = posOption.flatMap(p => this.board.look(p))
    }
    if(diskOption.isDefined() && diskOption.get().sideIs(side)) {
      return result;
    }
    return [];
  }
}