class ValueObject<T> {
  private value: T;
  constructor(value: T) {
    this.value = value;
  }
  public getValue(): T {
    return this.value;
  }
}
class StringVO extends ValueObject<string> {}