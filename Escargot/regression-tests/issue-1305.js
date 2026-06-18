// A CoverInitializedName (e.g. `{ a = 0 }`) used as a real value (the object of a
// member access / call / computed access / tagged template) must raise an early
// SyntaxError, not crash with RELEASE_ASSERT_NOT_REACHED during bytecode generation.
assertThrows("( {... { a = 0 }. b = 1 } ) ;", SyntaxError);
assertThrows("( {... { a = 0, b : a }. b = 1 } ) ;", SyntaxError);
assertThrows("( { a = 0 }. b = 1 )", SyntaxError);
assertThrows("({ a = 0 }.b);", SyntaxError);
assertThrows("({ a = 0 }.b += 1);", SyntaxError);
assertThrows("[{ a = 0 }.b] = [];", SyntaxError);
assertThrows("({ a = 0 });", SyntaxError);

// Valid destructuring uses of CoverInitializedName must still work.
var a, b;
({ a = 0 } = {});
assert(a === 0);
({ a = 5 } = { a: 7 });
assert(a === 7);
[{ a = 1 }] = [{}];
assert(a === 1);
({ a = 9, b = 10 } = {});
assert(a === 9 && b === 10);
