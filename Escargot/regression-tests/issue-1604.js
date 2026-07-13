// Issue #1604: Register Aliasing in InitializeDisposable -> Type Confusion
//
// The bytecode compiler could assign the SAME register to both fields of a
// single InitializeDisposable instruction (the per-scope disposal-record
// accumulator and the value being registered for disposal) whenever a
// `using`/`await using` declaration lived inside a for-of/for-in/for-await-of
// per-iteration lexical block. This let the interpreter overwrite the
// disposed value with a raw DisposableResourceRecord*, later misread as a
// Value/Object* by Object::getMethod (type confusion / arbitrary call
// primitive under ASAN).
//
// All cases below must NOT crash (segfault/ASAN abort) after the fix.
// A `using`/`await using` binding whose iterated/bound value is not an
// Object (and not null/undefined) correctly throws a catchable TypeError,
// so we just assert we get *some* well-formed completion, not a crash.

function assertNoCrash(fn) {
    try {
        fn();
    } catch (e) {
        // any regular JS exception is fine -- we only care about not crashing
    }
}

// PoC 1: using in a for-of loop body followed by a sibling using declaration
// in the same (rest-parameter-bearing) function.
assertNoCrash(function () {
    function F0(a2, ...a3) {
        for (using v8 of a3) {
        }
        using v10 = 1;
    }
    new F0(F0, F0);
});

// PoC 2: for-await-of with using, inside an async function.
assertNoCrash(function () {
    let v0 = 11;
    async function f3(a4, a5, a6) {
        v0--;
        for await (using v8 of "NFKD") {
        }
    }
    f3();
});

// PoC 3: for-await-of with using, followed by a sibling await-using.
assertNoCrash(function () {
    async function f1(a2, a3, a4) {
        for await (using v5 of "NFKD") {
        }
        await using v8 = {};
    }
    f1();
});

// PoC 4: nested await-using + for-await-of over an async generator that
// yields the outer disposable, inside a classic for-loop.
assertNoCrash(function () {
    function f0() {
    }
    async function f1(a2 = f0, a3, a4, a5) {
        const v7 = Symbol.asyncDispose;
        const v11 = {
            [v7](a9, ...a10) {
            },
        };
        await using v12 = v11;
        for (let i = 0; i < 5; i++) {
            async function* f14() {
                yield v12;
            }
            for await (await using v17 of f14()) {
            }
        }
    }
    f1();
});

// PoC 5: using in a for-of loop nested inside an arrow function used as a
// classic for-loop's test expression.
assertNoCrash(function () {
    const v2 = new BigInt64Array(1873);
    for (let i5 = 0, i6 = 10; i6; i6--) {
    }
    let v13 = 0;
    for (let i15 = 10, i16 = 10;
        (() => {
            Date.getTime;
            v13--;
            for (using v20 of v2) {
            }
            return i16;
        })();
        ) {
    }
});

// Regression check: using disposal must still run in the correct order and
// per-iteration `let` closures must still capture distinct values.
(function () {
    let log = [];
    function makeDisposable(name) {
        return {
            [Symbol.dispose]() {
                log.push('dispose:' + name);
            }
        };
    }
    function F() {
        for (using v of [makeDisposable('a'), makeDisposable('b')]) {
            log.push('iter');
        }
        using last = makeDisposable('last');
    }
    F();

    let expected = ['iter', 'dispose:a', 'iter', 'dispose:b', 'dispose:last'];
    if (log.length !== expected.length) {
        throw new Error('using disposal order regressed: ' + JSON.stringify(log));
    }
    for (let i = 0; i < expected.length; i++) {
        if (log[i] !== expected[i]) {
            throw new Error('using disposal order regressed: ' + JSON.stringify(log));
        }
    }

    let fns = [];
    for (let x of [1, 2, 3]) {
        fns.push(() => x);
    }
    let captured = fns.map(function (f) { return f(); }).join(',');
    if (captured !== '1,2,3') {
        throw new Error('for-of let per-iteration capture regressed: ' + captured);
    }
})();

print('issue_1604 PoC: no crash, no regression');
