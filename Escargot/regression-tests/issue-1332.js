// issue #1332: dynamic-stack-buffer-overflow in PointerValue::getTypeTag
// A destructuring parameter whose computed key references its own binding
// ( { [e.b] : e = {} } ) must NOT crash. Per spec `e` is in TDZ while the
// computed property name [e.b] is evaluated, so a ReferenceError is expected.

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

// original report: argument provided -> "value provided" branch destructures it
expectReferenceError(function () {
    (({ [e.b]: e = {} } = {}) => a)({ b: 32 });
}, "computed key references own binding, arg provided");

// argument omitted -> whole-pattern default {} branch destructures the default
expectReferenceError(function () {
    (({ [e.b]: e = {} } = {}) => a)();
}, "computed key references own binding, arg omitted (default branch)");

// pattern default that itself references a bound name (TDZ in default expression)
expectReferenceError(function () {
    (({ a } = a) => a)();
}, "pattern default references its own bound name");

// classic self-referencing default parameter must still throw
expectReferenceError(function () {
    ((x = x) => x)();
}, "self-referencing default parameter");

// --- regressions: valid patterns/defaults must still work ---
var key = "z";
(function () {
    // computed key references an OUTER (non-parameter) name -> no TDZ
    var out = (({ [key]: v = 7 } = {}) => v)({});
    if (out !== 7) throw new Error("FAIL: computed-key default value, got " + out);
    print("PASS: valid computed key referencing outer name with default value");
})();

(function () {
    var got = ((a, b = a + 1) => b)(10);
    if (got !== 11) throw new Error("FAIL: default referencing earlier param, got " + got);
    print("PASS: default param referencing earlier initialized param");
})();

(function () {
    var got = (({ x, y = x + 1 } = { x: 5 }) => [x, y])();
    if (got[0] !== 5 || got[1] !== 6) throw new Error("FAIL: destructuring with dependent default, got " + got);
    print("PASS: destructuring default referencing earlier bound name");
})();

print("ALL POC CHECKS PASSED");
