// Regression test for two related fixes to Escargot's fast-mode ArrayObject
// invariant ("fast mode => no object in this array's prototype chain can
// answer an array index outside its ObjectStructure"):
//
// 1) "Detect exotic indexed properties when an object becomes a prototype"
//    The raise condition used to be `hasIndexPropertyName() || isProxyObject()`,
//    which missed exotic objects that answer indices from their own storage
//    (String/TypedArray/arguments objects). Putting one in a prototype chain
//    left arrays below it in fast mode, so an in-bounds hole read `undefined`
//    instead of walking the chain.
//
// 2) "Narrow bad-time indexed-property flag from global to per-chain"
//    Dirtiness is now tracked per object instead of one VM-wide sticky bit,
//    so only arrays whose own prototype chain actually contains the dirty
//    object lose fast mode. This test checks that the narrowing did not
//    reintroduce the bugs fixed in (1), and that the fast built-in paths
//    (concat/slice/shift/unshift/iteration) that now trust isFastModeArray()
//    alone still see through to a dirty chain correctly.

// --- (1) exotic objects as prototype: hole must read through, not "undefined" ---

(function () {
    var a = [1, , 3]; // hole at index 1
    Object.setPrototypeOf(a, new String("xyz"));
    assert(a[1] === "y");
})();

(function () {
    var a = [1, , 3];
    Object.setPrototypeOf(a, new Uint8Array([7, 8, 9]));
    assert(a[1] === 8);
})();

(function () {
    var a = [1, , 3];
    (function () {
        Object.setPrototypeOf(a, arguments);
    })(10, 11, 12);
    assert(a[1] === 11);
})();

// a non-writable index on the prototype must not be shadowed by a plain store
(function () {
    var proto = new String("xyz");
    var a = [];
    Object.setPrototypeOf(a, proto);
    a[0] = 5;
    assert(a[0] === "x");
})();

// --- (2) chain-scoped: a fast-mode array reparented onto a dirty chain must
//         drop fast mode itself, so generic [[Get]] handles the hole ---

// each case below keeps Array.prototype reachable one link further up the
// chain (a -> dirtyProto -> Array.prototype) so a.concat/slice/shift are
// still the built-ins -- only the fast-path hole-handling is under test.

(function () {
    var a = [1, , 3];
    var dirtyProto = new Uint8Array([0, 99, 0]);
    Object.setPrototypeOf(dirtyProto, Array.prototype);
    Object.setPrototypeOf(a, dirtyProto);
    var b = a.concat([4, 5]);
    // fast-path array copy must not have treated the hole as undefined
    assert(b[1] === 99);
    assert(b[3] === 4);
    assert(b[4] === 5);
})();

(function () {
    var a = [1, , 3, , 5];
    var dirtyProto = new String("abcde");
    Object.setPrototypeOf(dirtyProto, Array.prototype);
    Object.setPrototypeOf(a, dirtyProto);
    var s = a.slice(1, 4);
    assert(s[0] === "b"); // hole at original index 1
    assert(s[1] === 3);
    assert(s[2] === "d"); // hole at original index 3
})();

(function () {
    var a = [, 2, 3];
    var dirtyProto = new Uint8Array([42, 0, 0]);
    Object.setPrototypeOf(dirtyProto, Array.prototype);
    Object.setPrototypeOf(a, dirtyProto);
    var first = a.shift();
    assert(first === 42);
})();

(function () {
    var a = [, , 3];
    var dirtyProto = new Uint8Array([0, 7, 0]);
    Object.setPrototypeOf(dirtyProto, Array.prototype);
    Object.setPrototypeOf(a, dirtyProto);
    var arr2 = [];
    for (var v of a) {
        arr2.push(v);
    }
    assert(arr2[1] === 7);
})();

// --- (2) chain-scoped: an unrelated array with a clean chain must be
//         unaffected by some other object becoming dirty elsewhere ---

(function () {
    var clean = [1, , 3];
    // dirty an unrelated object's chain
    var other = [4, , 6];
    Object.setPrototypeOf(other, new Uint8Array([0, 55, 0]));
    assert(other[1] === 55);
    // `clean` never touched this prototype, so its own hole must still read undefined
    assert(clean[1] === undefined);
})();

// --- (1)+(2) combined: an object already used as a prototype gains an
//     indexed property later (Object.defineProperty), and a brand-new array
//     created with it as prototype afterward must be born non-fast-mode ---

(function () {
    var proto = {};
    var placeholder = [];
    Object.setPrototypeOf(placeholder, proto); // proto is now "ever a prototype"

    Object.defineProperty(proto, "0", { value: "late", enumerable: true, configurable: true });

    var a = [];
    Object.setPrototypeOf(a, proto);
    a.length = 1; // create a hole at index 0
    assert(a[0] === "late");
})();

// --- EnumerateObject::checkIfModified guard for a key already consumed by
//     destructuring (left as an internal "empty" marker): must not crash and
//     must produce a correct rest object on a fast-mode array. ---

(function () {
    var arr = [1, 2, 3];
    var a, rest;
    ({ 0: a, ...rest } = arr);
    assert(a === 1);
    assert(rest[1] === 2);
    assert(rest[2] === 3);
    assert(!("0" in rest));
})();

print("All tests passed!");
