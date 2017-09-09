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
        if (this.look(pos)) {
            throw "disk already exists";
        }
        var newSquare = this.getSquareMap(); // copy
        var key = this.posToHash(pos);
        newSquare[key] = disk;
        return new Board(newSquare);
    };
    Board.prototype.replace = function (pos, disk) {
        if (!this.look(pos)) {
            throw "disk not exists";
        }
        var newSquare = this.getSquareMap(); // copy
        var key = this.posToHash(pos);
        newSquare[key] = disk;
        return new Board(newSquare);
    };
    Board.prototype.look = function (pos) {
        return this.square[this.posToHash(pos)];
    };
    return Board;
}());
/// <reference path="../volib.ts"/>
var Horizontal = /** @class */ (function (_super) {
    __extends(Horizontal, _super);
    function Horizontal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Horizontal;
}(StringVO));
var Vertical = /** @class */ (function (_super) {
    __extends(Vertical, _super);
    function Vertical() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return Pos;
}());
/// <reference path="board.ts"/>
/// <reference path="pos.ts"/>
var p1 = new Pos(new Horizontal("d"), new Vertical("4"));
var p2 = new Pos(new Horizontal("a"), new Vertical("2"));
var board = new Board([])
    .place(new Pos(new Horizontal("d"), new Vertical("4")), new Disk(Side.dark))
    .place(new Pos(new Horizontal("e"), new Vertical("4")), new Disk(Side.light))
    .place(new Pos(new Horizontal("d"), new Vertical("5")), new Disk(Side.light))
    .place(new Pos(new Horizontal("e"), new Vertical("5")), new Disk(Side.dark));
