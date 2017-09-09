/// <reference path="board.ts"/>
/// <reference path="pos.ts"/>
var p1 = new Pos(new Horizontal("d"), new Vertical("4"));
var p2 = new Pos(new Horizontal("a"), new Vertical("2"));

var board = new Board([])
  .place(new Pos(new Horizontal("d"), new Vertical("4")), new Disk(Side.dark))
  .place(new Pos(new Horizontal("e"), new Vertical("4")), new Disk(Side.light))
  .place(new Pos(new Horizontal("d"), new Vertical("5")), new Disk(Side.light))
  .place(new Pos(new Horizontal("e"), new Vertical("5")), new Disk(Side.dark));

