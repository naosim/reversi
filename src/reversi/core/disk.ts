/// <reference path="../volib.ts"/>
/// <reference path="side.ts"/>
class Disk extends ValueObject<Side> {
  isDark() { return this.getValue().isDark() }
  isLight() { return this.getValue().isLight() }
  reverse(): Disk { return new Disk(this.getValue().reverse()) }
  sideIs(s: Side): boolean { return this.getValue().eq(s) }
}