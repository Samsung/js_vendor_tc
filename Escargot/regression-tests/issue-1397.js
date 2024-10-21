console = { log: print }
function Test(a) {
  console.log("a:", a, typeof a);
  var b;
  a = b = { lastRenderedState: a };
  console.log("a:", a, ", typeof a:", typeof a);
  console.log("b:", b, ", typeof b:", typeof b);
  console.log("b.lastRenderedState:", b.lastRenderedState, ", typeof b.lastRenderedState:",typeof b.lastRenderedState );
  console.log("a.lastRenderedState:", a.lastRenderedState, ", typeof a.lastRenderedState:",typeof a.lastRenderedState );
  return a === a.lastRenderedState;
}

function Test2(param) {
  console.log("Test");
  console.log("param:", param, typeof param);
  var b;
  a = b = { lastRenderedState: param };
  console.log("a:", a, ", typeof a:", typeof a);
  console.log("b:", b, ", typeof b:", typeof b);
  console.log("b.lastRenderedState:", b.lastRenderedState, ", typeof b.lastRenderedState:",typeof b.lastRenderedState );
  console.log("a.lastRenderedState:", a.lastRenderedState, ", typeof a.lastRenderedState:",typeof a.lastRenderedState );
  return a === a.lastRenderedState;
}

console.log(Test("10011"));
console.log(Test2("10011"));

assert(Test("10011")==false)
assert(Test2("10011")==false)
