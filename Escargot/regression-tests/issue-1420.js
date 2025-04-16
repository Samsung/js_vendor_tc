
class d {
  static #f = d.dcp();
  static dcp() {
      return 1;
  }

  static ff() {
      return d.#f;
  }
}


class d2 {
  static #f = d2.#dcp();
  static #dcp() {
      return 1;
  }
  static ff() {
      return d2.#f;
  }
}


assert(1 == d.ff())
assert(1 == d2.ff())
