/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// A simple assignment statement to a local variable compiles its right-hand
// side straight into the variable's register. When the right-hand side stores
// a partial result there and then throws, the variable must still hold its
// previous value: PutValue runs only after the right-hand side completes
// (ECMA-262 13.15.2). Optional chains, `||`, `&&`, `??`, literals and class
// expressions all write their destination before they finish.

var sentinel = {};
function throws() { throw sentinel; }
function id(x) { return x; }

// optional chains
function optionalCall() { let r = 7; try { r = id?.(throws()); } catch (e) { assert(e === sentinel); } return r; }
assert(optionalCall() === 7);
function throwingCallee() { let r = 7; try { r = throws()?.(); } catch (e) { assert(e === sentinel); } return r; }
assert(throwingCallee() === 7);
function optionalMember() { let r = 7, o = { x: null }; try { r = o?.x.y; } catch (e) { assert(e instanceof TypeError); } return r; }
assert(optionalMember() === 7);
function optionalComputed() { let r = 7, o = {}; try { r = o?.[throws()]; } catch (e) { assert(e === sentinel); } return r; }
assert(optionalComputed() === 7);
function optionalDelete() { "use strict"; let r = 7; try { r = delete Object.freeze({ x: 1 })?.x; } catch (e) { assert(e instanceof TypeError); } return r; }
assert(optionalDelete() === 7);

// logical operators
function nullish() { let r = 7, a = null; try { r = a ?? throws(); } catch (e) { assert(e === sentinel); } return r; }
assert(nullish() === 7);
function logicalOr() { let r = 7, a = 0; try { r = a || throws(); } catch (e) { assert(e === sentinel); } return r; }
assert(logicalOr() === 7);
function logicalAnd() { let r = 7, a = 1; try { r = a && throws(); } catch (e) { assert(e === sentinel); } return r; }
assert(logicalAnd() === 7);
function strictLogicalOr() { "use strict"; var r = 7, a = 0; try { r = a || throws(); } catch (e) { assert(e === sentinel); } return r; }
assert(strictLogicalOr() === 7);

// expressions that hand their destination to a child
function conditional() { let r = 7, a = 0; try { r = a === 0 ? a || throws() : 1; } catch (e) { assert(e === sentinel); } return r; }
assert(conditional() === 7);
function sequence() { let r = 7, a = null; try { r = (0, a ?? throws()); } catch (e) { assert(e === sentinel); } return r; }
assert(sequence() === 7);
function nestedAssignment() {
    let r = 7, s = 8, a = 0;
    try { r = s = a || throws(); } catch (e) { assert(e === sentinel); }
    return r === 7 && s === 8;
}
assert(nestedAssignment());

function logicalAssignment() {
    let r = 7, s = 0, a = null;
    try { r = (s ||= a ?? throws()); } catch (e) { assert(e === sentinel); }
    return r === 7 && s === 0;
}
assert(logicalAssignment());

// literals and classes
function arrayLiteral() { let r = 7; try { r = [1, throws()]; } catch (e) { assert(e === sentinel); } return r; }
assert(arrayLiteral() === 7);
function objectLiteral() { let r = 7; try { r = { a: 1, b: throws() }; } catch (e) { assert(e === sentinel); } return r; }
assert(objectLiteral() === 7);
function classComputedKey() { let r = 7; try { r = class { [throws()]() {} }; } catch (e) { assert(e === sentinel); } return r; }
assert(classComputedKey() === 7);
function classStaticField() { let r = 7; try { r = class { static f = throws(); }; } catch (e) { assert(e === sentinel); } return r; }
assert(classStaticField() === 7);

function longTemplate() {
    let r = 7, a = "x";
    try { r = `${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${throws()}`; } catch (e) { assert(e === sentinel); }
    return r;
}
assert(longTemplate() === 7);

// a captured variable and a global one take other paths; keep them covered
function captured() {
    let r = 7, a = 0;
    var read = function () { return r; };
    try { r = a || throws(); } catch (e) { assert(e === sentinel); }
    return read();
}
assert(captured() === 7);
let globalTarget = 7;
try { globalTarget = null ?? throws(); } catch (e) { assert(e === sentinel); }
assert(globalTarget === 7);

// the value of the assignment expression itself is still unaffected
function assignmentValue() {
    let r = 7, t = 8, a = 0;
    try { t = (r = a || throws()); } catch (e) { assert(e === sentinel); }
    return r === 7 && t === 8;
}
assert(assignmentValue());

// completed evaluations still store their result
function completes() {
    let r = 7, a = 0, o = { m: function () { return 3; } };
    r = a || 1; assert(r === 1);
    r = a ?? 2; assert(r === 0);
    r = id?.(2); assert(r === 2);
    r = o?.m(); assert(r === 3);
    r = null?.x; assert(r === undefined);
    r = delete o?.m; assert(r === true && !("m" in o));
    r = a === 0 ? a || 4 : 5; assert(r === 4);
    r = [1, 2]; assert(r.length === 2);
    r = `${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}${a}`; assert(r === "0".repeat(40));
    r = (a ||= 9); assert(r === 9 && a === 9);
    return true;
}
assert(completes());
