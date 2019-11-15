function test(ctor, { mapVal = undefined,
    nextVal = undefined,
    nextThrowVal = undefined,
    modifier = undefined,
    exceptionVal = undefined,
    closed = true }) {
    let iterable = {
        closed: false,
        [Symbol.iterator]() {
            let iterator = {
                first: true,
                next() {
                    if (this.first) {
                        this.first = false;
                        if (nextThrowVal)
                            throw nextThrowVal;
                        return nextVal;
                    }
                    return { value: undefined, done: true };
                },
                return() {
                    iterable.closed = true;
                    return {};
                }
            };
            if (modifier)
                modifier(iterator, iterable);

            return iterator;
        }
    };
    if (exceptionVal) {
        let caught = false;
        try {
            ctor.from(iterable, mapVal);
        } catch (e) {
            assert(e === exceptionVal);
            caught = true;
        }
        assert(caught === true);
    }
    assert(iterable.closed === closed);
}
class MyArray extends Array {
    constructor() {
        return new Proxy({}, {
            defineProperty() {
                throw "defineProperty throws";
            }
        });
    }
}

test(MyArray, {
    nextVal: { value: 1, done: false },
    exceptionVal: "defineProperty throws",
    closed: true,
});

test(MyArray, {
    nextVal: { value: 1, done: false },
    modifier: (iterator, iterable) => {
        Object.defineProperty(iterator, "return", {
            get: function() {
                iterable.closed = true;
                throw "return getter throws";
            }
        });
    },
    exceptionVal: "return getter throws",
    closed: true,
});

test(MyArray, {
    nextVal: { value: 1, done: false },
    modifier: (iterator, iterable) => {
        iterator.return = function() {
            iterable.closed = true;
            throw "return throws";
        };
    },
    exceptionVal: "defineProperty throws",
    closed: true,
});

test(MyArray, {
    nextVal: { value: 1, done: false },
    modifier: (iterator, iterable) => {
        iterator.return = function() {
            iterable.closed = true;
            return "non object";
        };
    },
    exceptionVal: "defineProperty throws",
    closed: true,
});

test(Array, {
    nextThrowVal: "next throws",
    exceptionVal: "next throws",
    closed: false,
});

test(Array, {
    nextVal: { value: {}, get done() { throw "done getter throws"; } },
    exceptionVal: "done getter throws",
    closed: false,
});

test(Array, {
    nextVal: { get value() { throw "value getter throws"; }, done: false },
    exceptionVal: "value getter throws",
    closed: false,
});

test(Array, {
    nextVal: { value: 1, done: false },
    closed: false,
});
