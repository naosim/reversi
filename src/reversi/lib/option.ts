interface Option<T> {
  get(): T
  getOrElse(t:T)
  getOrElseThrow(f: ()=>any)
  isDefined():boolean
  isEmpty():boolean
  map<R>(f: (T)=>R): Option<R>
  forEach(f: (T)=>void)
  flatMap<R>(f: (T)=>Option<R>): Option<R>
  filter<T>(f: (T)=> boolean): Option<T>
}

class OptionFactory {
  static some<T>(t:T): Option<T> {
    if(Some.isNull(t)) throw 'argument is null or undefined'
    return new Some<T>(t)
  }
  static empty<T>(): Option<T> { return new None<T>() }
  static of<T>(t:T): Option<T> { return Some.isNull(t) ? new None<T>() : new Some<T>(t) }
}

class None<T> implements Option<T> {
  get(): T { throw 'none' }
  getOrElse(t:T) { return t }
  getOrElseThrow(f: ()=>any) { throw f() }
  isDefined():boolean { return false }
  isEmpty():boolean { return true }
  map<R>(f: (T)=>R): Option<R> { return new None<R>() as Option<R> }
  forEach(f: (T)=>void) {}
  flatMap<R>(f: (T)=>Option<R>): Option<R> { return new None<R>() as Option<R> }
  filter<T>(f: (T)=> boolean): Option<T> { return new None<T>() as Option<T> }
}

class Some<T> implements Option<T> {
  private value: T
  constructor(value: T) {
    this.value = value;
  }
  get(): T { return this.value }
  getOrElse(t:T) { return this.value }
  getOrElseThrow(f: ()=>any) { return this.value }
  isDefined():boolean { return true }
  isEmpty():boolean { return false }
  map<R>(f: (T)=>R): Option<R> {
    let v: R = f(this.value)
    if(Some.isNull(v)) {
      return new None<R>() as Option<R>
    }
    return new Some(v) as Option<R>
  }
  forEach(f: (T)=>void) { f(this.value) }

  flatMap<R>(f: (T)=>Option<R>): Option<R> {
    let v = f(this.value)
    if(Some.isNull(v)) {
      return new None<R>() as Option<R>
    }
    return v
  }

  filter<T>(f: (T)=> boolean): Option<T> {
    if(f(this.value)) {
      let v: any = new Some(this.value)
      return v as Option<T>;
    } else {
      return new None<T>() as Option<T>;
    }
  }
  static isNull(v) { return v == null || v == undefined }
}

