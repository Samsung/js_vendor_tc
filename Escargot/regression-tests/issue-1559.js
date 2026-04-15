class mr {
    #t = 123;
    foo() {
        let n = this;
        return {
            bar() {
                return n.#t;
            }
        }
    }
}
d = new mr()
d2 = d.foo()
assert(d2.bar() == 123);
