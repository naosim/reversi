/// <reference path="../core/player.ts"/>
/// <reference path="../core/board.ts"/>
/// <reference path="../core/side.ts"/>

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