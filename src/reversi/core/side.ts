class Side extends StringVO {
  static dark = new Side('dark');
  static light = new Side('light');

  isDark() { return this.getValue() == 'dark' }
  isLight() { return this.getValue() == 'light' }
  reverse() { return this.isDark() ? Side.light : Side.dark }
  eq(other: Side) { return this.getValue() == other.getValue() }
}