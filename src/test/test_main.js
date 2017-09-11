var createPos = (str) => new Pos(new Horizontal(str[0]), new Vertical(str[1]))
let lightDisk = new Disk(Side.light)
let darkDisk = new Disk(Side.dark)

// var assert = require('assert');
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

describe('Pos', function() {
  let pos = createPos('d4');
  describe('#getNext()', function() {
    it('left', function() {
      assert(pos.getNext(Direction.left).map(v => v.getLogValue()).get(), "c4");
    });
    it('right', function() {
      assert(pos.getNext(Direction.right).map(v => v.getLogValue()).get(), "e4");
    });
    it('up', function() {
      assert(pos.getNext(Direction.up).map(v => v.getLogValue()).get(), "d3");
    });
    it('down', function() {
      assert(pos.getNext(Direction.down).map(v => v.getLogValue()).get(), "d5");
    });

    it('up_left', function() {
      assert(pos.getNext(Direction.up_left).map(v => v.getLogValue()).get(), "c3");
    });
    it('up_right', function() {
      assert(pos.getNext(Direction.up_right).map(v => v.getLogValue()).get(), "e3");
    });
    it('down_left', function() {
      assert(pos.getNext(Direction.down_left).map(v => v.getLogValue()).get(), "c5");
    });
    it('down_right', function() {
      assert(pos.getNext(Direction.down_right).map(v => v.getLogValue()).get(), "e5");
    });
  });
});





var toStr = (board) => {
  var str = ''
  var h = 'abcdefgh'
  var v = '12345678'
  for(var y = 0; y < v.length; y++) {
    for(var x = 0; x < h.length; x++) {
      var _h = h[x]
      var _v = v[y]
      var s = board.look(new Pos(new Horizontal(h[x]), new Vertical(v[y])))
      var selector = `button[h="${_h}"][v="${_v}"]`
      var b = document.querySelector(selector)
      if(s.isDefined()) {
        str += s.get().getValue() == Side.dark ? '*' : 'o'
      } else {
        str += '_'
      }
    }
    str += '\n'
  }
  console.log(str)
}

describe('PlaceLogic', function() {
  describe('#getFlipablePositionsIfPlace()', function() {
    let board = new Board()
      // up
      .place(createPos('d2'), lightDisk)
      .place(createPos('d3'), lightDisk)
      // down
      .place(createPos('d5'), lightDisk)
      .place(createPos('d6'), lightDisk)
      // left
      .place(createPos('b4'), lightDisk)
      .place(createPos('c4'), lightDisk)
      // right
      .place(createPos('e4'), lightDisk)
      .place(createPos('f4'), lightDisk)

      .place(createPos('b2'), lightDisk)
      .place(createPos('c3'), lightDisk)

      .place(createPos('f2'), lightDisk)
      .place(createPos('e3'), lightDisk)

      .place(createPos('c5'), lightDisk)
      .place(createPos('b6'), lightDisk)

      .place(createPos('e5'), lightDisk)
      .place(createPos('f6'), lightDisk);

      
    // it('none reverse', function() {
    //   let sut = new PlaceLogic(board)
    //   var act = sut.getFlipablePositionsIfPlace(createPos('d4'), darkDisk)
    //   assert(act.length, 0);
    // });

    it('reverse up, donw, right, left', function() {
      let b2 = board
        .place(createPos('d1'), darkDisk)
        .place(createPos('d7'), darkDisk)
        .place(createPos('a4'), darkDisk)
        .place(createPos('g4'), darkDisk);
      toStr(b2)
      let sut = new PlaceLogic(b2)
      var act = sut.getFlipablePositionsIfPlace(createPos('d4'), Side.dark)
      assert(act.length, 8);
    });

    it('reverse up_right, up_left, donw_right, down_left', function() {
      let b2 = board
        .place(createPos('a1'), darkDisk)
        .place(createPos('a7'), darkDisk)
        .place(createPos('g1'), darkDisk)
        .place(createPos('g7'), darkDisk);
      toStr(b2)
      let sut = new PlaceLogic(b2)
      var act = sut.getFlipablePositionsIfPlace(createPos('d4'), Side.dark)
      assert(act.length, 8);
    });
  });
});