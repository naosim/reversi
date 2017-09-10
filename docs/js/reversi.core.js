var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ValueObject = /** @class */ (function () {
    function ValueObject(value) {
        this.value = value;
    }
    ValueObject.prototype.getValue = function () {
        return this.value;
    };
    return ValueObject;
}());
var StringVO = /** @class */ (function (_super) {
    __extends(StringVO, _super);
    function StringVO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StringVO;
}(ValueObject));
var Side;
(function (Side) {
    Side[Side["dark"] = 0] = "dark";
    Side[Side["light"] = 1] = "light";
})(Side || (Side = {}));
/// <reference path="../volib.ts"/>
/// <reference path="side.ts"/>
var Disk = /** @class */ (function (_super) {
    __extends(Disk, _super);
    function Disk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Disk;
}(ValueObject));
/// <reference path="disk.ts"/>
var Board = /** @class */ (function () {
    function Board(square) {
        this.square = square;
    }
    Board.prototype.getSquareMap = function () {
        var _this = this;
        // copy object
        return Object.keys(this.square).reduce(function (memo, k) {
            memo[k] = _this.square[k];
            return memo;
        }, []);
    };
    Board.prototype.posToHash = function (pos) {
        return "Pos(Horizontal(" + pos.getHorizontal().getValue() + "), Vertical(" + pos.getVertical().getValue() + "))";
    };
    Board.prototype.place = function (pos, disk) {
        if (this.look(pos).isDefined()) {
            throw "disk already exists";
        }
        var newSquare = this.getSquareMap(); // copy
        var key = this.posToHash(pos);
        newSquare[key] = disk;
        return new Board(newSquare);
    };
    Board.prototype.replace = function (pos, disk) {
        if (this.look(pos).isEmpty()) {
            throw "disk not exists";
        }
        var newSquare = this.getSquareMap(); // copy
        var key = this.posToHash(pos);
        newSquare[key] = disk;
        return new Board(newSquare);
    };
    Board.prototype.look = function (pos) {
        return OptionFactory.of(this.square[this.posToHash(pos)]);
    };
    return Board;
}());
var OptionFactory = /** @class */ (function () {
    function OptionFactory() {
    }
    OptionFactory.some = function (t) {
        if (t == null || t == undefined)
            throw 'argument is null or undefined';
        return new Some(t);
    };
    OptionFactory.empty = function () { return new None(); };
    OptionFactory.of = function (t) { return t == null || t == undefined ? new None() : new Some(t); };
    return OptionFactory;
}());
var None = /** @class */ (function () {
    function None() {
    }
    None.prototype.get = function () { throw 'none'; };
    None.prototype.getOrElse = function (t) { return t; };
    None.prototype.getOrElseThrow = function (f) { throw f(); };
    None.prototype.isDefined = function () { return false; };
    None.prototype.isEmpty = function () { return true; };
    None.prototype.map = function (f) { return new None(); };
    None.prototype.flatMap = function (f) { return new None(); };
    None.prototype.filter = function (f) { return new None(); };
    return None;
}());
var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
    }
    Some.prototype.get = function () { return this.value; };
    Some.prototype.getOrElse = function (t) { return this.value; };
    Some.prototype.getOrElseThrow = function (f) { return this.value; };
    Some.prototype.isDefined = function () { return true; };
    Some.prototype.isEmpty = function () { return false; };
    Some.prototype.map = function (f) {
        var v = f(this.value);
        if (v == null || v == undefined) {
            return new None();
        }
        return new Some(v);
    };
    Some.prototype.flatMap = function (f) {
        var v = f(this.value);
        if (v == null || v == undefined) {
            return new None();
        }
        return v;
    };
    Some.prototype.filter = function (f) {
        if (f(this.value)) {
            var v = new Some(this.value);
            return v;
        }
        else {
            return new None();
        }
    };
    return Some;
}());
/// <reference path="../volib.ts"/>
/// <reference path="../lib/option.ts"/>
var _AxisChar = /** @class */ (function () {
    function _AxisChar(values) {
        this.values = values;
    }
    _AxisChar.prototype.getNext = function (current) {
        var i = this.values.indexOf(current) + 1;
        if (this.values.length >= i) {
            return OptionFactory.empty();
        }
        return OptionFactory.some(this.values[i]);
    };
    _AxisChar.prototype.getPrev = function (current) {
        var i = this.values.indexOf(current) - 1;
        if (i < 0) {
            return OptionFactory.empty();
        }
        return OptionFactory.some(this.values[i]);
    };
    return _AxisChar;
}());
var Horizontal = /** @class */ (function (_super) {
    __extends(Horizontal, _super);
    function Horizontal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Horizontal.prototype.getNext = function () {
        return Horizontal.axisChar.getNext(this.getValue()).map(function (v) { return new Horizontal(v); });
    };
    Horizontal.prototype.getPrev = function () {
        return Horizontal.axisChar.getPrev(this.getValue()).map(function (v) { return new Horizontal(v); });
    };
    Horizontal.axisChar = new _AxisChar('abcdefgh');
    return Horizontal;
}(StringVO));
var Vertical = /** @class */ (function (_super) {
    __extends(Vertical, _super);
    function Vertical() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vertical.prototype.getNext = function () {
        return Vertical.axisChar.getNext(this.getValue()).map(function (v) { return new Vertical(v); });
    };
    Vertical.prototype.getPrev = function () {
        return Vertical.axisChar.getPrev(this.getValue()).map(function (v) { return new Vertical(v); });
    };
    Vertical.axisChar = new _AxisChar('12345678');
    return Vertical;
}(StringVO));
var Pos = /** @class */ (function () {
    function Pos(horizontal, vertical) {
        this.horizontal = horizontal;
        this.vertical = vertical;
    }
    Pos.prototype.getHorizontal = function () {
        return this.horizontal;
    };
    Pos.prototype.getVertical = function () {
        return this.vertical;
    };
    Pos.prototype.getNext = function (d) {
        var _this = this;
        if (d == Direction.up) {
            return this.vertical.getPrev().map(function (v) { return new Pos(_this.horizontal, v); });
        }
        else if (d == Direction.down) {
            return this.vertical.getNext().map(function (v) { return new Pos(_this.horizontal, v); });
        }
        else if (d == Direction.left) {
            return this.horizontal.getPrev().map(function (v) { return new Pos(v, _this.vertical); });
        }
        else if (d == Direction.right) {
            return this.horizontal.getNext().map(function (v) { return new Pos(v, _this.vertical); });
        }
        else if (d == Direction.up_left) {
        }
    };
    return Pos;
}());
var Direction;
(function (Direction) {
    Direction[Direction["right"] = 0] = "right";
    Direction[Direction["left"] = 1] = "left";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
    Direction[Direction["up_right"] = 4] = "up_right";
    Direction[Direction["up_left"] = 5] = "up_left";
    Direction[Direction["down_right"] = 6] = "down_right";
    Direction[Direction["down_left"] = 7] = "down_left";
})(Direction || (Direction = {}));
/// <reference path="board.ts"/>
/// <reference path="pos.ts"/>
var p1 = new Pos(new Horizontal("d"), new Vertical("4"));
var p2 = new Pos(new Horizontal("a"), new Vertical("2"));
var board = new Board([])
    .place(new Pos(new Horizontal("d"), new Vertical("4")), new Disk(Side.dark))
    .place(new Pos(new Horizontal("e"), new Vertical("4")), new Disk(Side.light))
    .place(new Pos(new Horizontal("d"), new Vertical("5")), new Disk(Side.light))
    .place(new Pos(new Horizontal("e"), new Vertical("5")), new Disk(Side.dark));
