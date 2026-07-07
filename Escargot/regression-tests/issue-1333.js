// issue #1333: global-buffer-overflow in InterpreterSlowPath::unaryTypeof
// A `let` destructuring binding whose default references its own binding (via
// `typeof n`) must NOT crash. `n` is in TDZ while the default is evaluated, so
// a ReferenceError is expected (matches V8/JSC).

function expectReferenceError(fn, desc) {
    try {
        fn();
    } catch (err) {
        if (err instanceof ReferenceError) {
            print("PASS: " + desc);
            return;
        }
        throw new Error("FAIL(" + desc + "): expected ReferenceError, got " + err);
    }
    throw new Error("FAIL(" + desc + "): expected ReferenceError, but no error thrown");
}

// original report (reduced): for-of let destructuring, default `typeof n` refs n
expectReferenceError(function () {
    for (let { func0: n = f = typeof n, b: o = class o {}, ...t } of " string ")
        Object.freeze(n);
}, "for-of let: computed default `typeof n` references own binding");

// minimal for-of form
expectReferenceError(function () {
    for (let { func0: n = typeof n } of "x") ;
}, "for-of let: minimal `n = typeof n`");

// default that references the binding directly (not via typeof)
expectReferenceError(function () {
    for (let { a: n = n + 1 } of "x") ;
}, "for-of let: default `n = n + 1` references own binding");

// plain (non for-of) let destructuring must also throw (was already correct)
expectReferenceError(function () {
    let { func0: n = typeof n } = {};
}, "plain let destructuring: `n = typeof n`");

// --- regressions: valid patterns must still work (no spurious ReferenceError) ---
(function () {
    var count = 0;
    for (let { a: n = 7 } of [{}, { a: 3 }]) {
        if (n !== 7 && n !== 3) throw new Error("FAIL: default value wrong, got " + n);
        count++;
    }
    if (count !== 2) throw new Error("FAIL: iteration count " + count);
    print("PASS: for-of let default value (no self reference)");
})();

(function () {
    // later element default may reference an earlier, already-bound name
    var got;
    for (let [a, b = a + 1] of [[5]]) got = [a, b];
    if (got[0] !== 5 || got[1] !== 6) throw new Error("FAIL: dependent default, got " + got);
    print("PASS: for-of let array default references earlier bound name");
})();

print("ALL POC CHECKS PASSED");
