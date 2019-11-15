Object.prototype.x = 0;

// basic test
(function() {
    var obj1 = { foo: 'bar', x: 42 };
    var obj2 = { foo: 'baz', y: 13 };

    var merge = {...obj1, ...obj2 };

    assert(merge.foo === 'baz');
    assert(merge.x === 42);
    assert(merge.y === 13);
})();

(function() {
    const obj = { a: 1, b: 2, c: 3 };
    const spread = { a: 3, d: 4, ...obj };
    const { a, d, ...rest } = obj;

    assert(spread.a === 1);
    assert(spread.b === 2);
    assert(spread.c === 3);
    assert(spread.d === 4);

    assert(a === 1);
    assert(d === undefined);
    assert(rest.b === 2);
    assert(rest.c === 3);
})();

// advanced test
(function () {
    var obj = {
        a : 1,
        get b() {
            delete this.c;
            this.d = 4;
            return 2;
        },
        c : 3
    }
    Object.defineProperty(obj, 'e', {
        value : 5,
    });
    Object.defineProperty(obj, 'f', {
        value : 6,
        enumerable : true
    });

    var symbol = Symbol('s');
    obj[symbol] = 7;

    var rest = { ...obj};

    assert(rest.a === 1);
    assert(rest.b === 2);
    assert(!rest.hasOwnProperty('c'));
    assert(!rest.hasOwnProperty('d'));
    assert(!rest.hasOwnProperty('e'));
    assert(rest.f === 6);
    assert(rest[symbol] === 7);
    assert(!rest.hasOwnProperty('x'));
})();

(function () {
    var obj = {
        a : 1,
        get b() {
            delete this.c;
            this.d = 4;
            return 2;
        },
        c : 3
    }
    Object.defineProperty(obj, 'e', {
        value : 5,
    });
    Object.defineProperty(obj, 'f', {
        value : 6,
        enumerable : true
    });

    var symbol = Symbol('s');
    obj[symbol] = 7;

    var { ...rest1} = obj;
    var {a, f, ...rest2} = obj;

    assert(rest1.a === 1);
    assert(rest1.b === 2);
    assert(!rest1.hasOwnProperty('c'));
    assert(!rest1.hasOwnProperty('d'));
    assert(!rest1.hasOwnProperty('e'));
    assert(rest1.f === 6);
    assert(rest1[symbol] === 7);
    assert(!rest1.hasOwnProperty('x'));

    assert(!rest2.hasOwnProperty('a'));
    assert(rest2.b === 2);
    assert(!rest2.hasOwnProperty('c'));
    assert(rest2.hasOwnProperty('d'));
    assert(!rest2.hasOwnProperty('e'));
    assert(!rest2.hasOwnProperty('f'));
    assert(rest2[symbol] === 7);
    assert(!rest2.hasOwnProperty('x'));
})();
