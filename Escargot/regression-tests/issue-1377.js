// issue #1377: SEGV in Interpreter::interpret for a for-in `const` destructuring
// binding whose default references its own binding (`{ x = x }`). `x` is in the
// temporal dead zone while the default is evaluated, so a ReferenceError is
// expected (matches V8/JSC) instead of a crash.
//
// Same root cause as #1333: the AssignmentPattern's "value provided" branch
// records the bound name as lexically declared (suppressing the TDZ check for
// stack lexical bindings), and that codegen-time state used to leak into the
// mutually-exclusive "default value" branch. Fixed by snapshotting/restoring
// m_lexicallyDeclaredNames around the two branches in AssignmentPatternNode.

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

// original report (reduced): for-in const destructuring, default `x` refs own binding
expectReferenceError(function () {
    (function () {
        var v0;
        var v1 = { 'a': 5 };
        for (const { x = x } in v1)
            x();
    })();
}, "for-in const: `{ x = x }` references own binding (original report)");

// minimal for-in const form
expectReferenceError(function () {
    for (const { x = x } in { a: 1 }) ;
}, "for-in const: minimal `{ x = x }`");

// for-in let form
expectReferenceError(function () {
    for (let { x = x } in { a: 1 }) ;
}, "for-in let: minimal `{ x = x }`");

// renamed binding, default references the binding
expectReferenceError(function () {
    for (const { a: y = y } in { a: 1 }) ;
}, "for-in const: `{ a: y = y }` references own binding");

// default is an expression that reads the binding
expectReferenceError(function () {
    for (const { x = x + 1 } in { a: 1 }) ;
}, "for-in const: `{ x = x + 1 }` references own binding");

// --- regressions: valid patterns must still work (no spurious ReferenceError) ---
(function () {
    var count = 0;
    for (const { x = 7 } in { a: 1 }) {
        if (x !== 7) throw new Error("FAIL: default value wrong, got " + x);
        count++;
    }
    if (count !== 1) throw new Error("FAIL: iteration count " + count);
    print("PASS: for-in const default value (no self reference)");
})();

(function () {
    // later element default may reference an earlier, already-bound name
    for (const [a, b = a + 1] in { ab: 1 }) ;
    print("PASS: for-in const array default references earlier bound name");
})();

(function () {
    // var binding has no TDZ: `{ x = x }` must not throw
    for (var { x = x } in { a: 1 }) ;
    print("PASS: for-in var `{ x = x }` (no TDZ)");
})();

print("ALL POC CHECKS PASSED");
