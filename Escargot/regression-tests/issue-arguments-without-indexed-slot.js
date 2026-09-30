/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Eval code inside an arrow function can make the enclosing function use the
// arguments object long after the layout of that function's environment record
// was fixed, and `arguments` is then registered without an indexed storage slot
// to keep it in. Both the store and the load used to index that missing slot,
// which reads and writes the word in front of the storage array - they happened
// to cancel each other out, so this only showed up as an out-of-bounds access
// under a sanitizer build.

function readFromArrow(a, b) {
    return (() => eval("arguments"))();
}

var args = readFromArrow(1, 2);
assert(args.length === 2);
assert(args[0] === 1);
assert(args[1] === 2);
assert(String(args) === "[object Arguments]");
assert(args[Symbol.iterator] === Array.prototype.values);

// the same thing with no parameters at all
function readFromArrowNoParameter() {
    return (() => eval("arguments"))().length;
}
assert(readFromArrowNoParameter() === 0);
assert(readFromArrowNoParameter(7, 8, 9) === 3);

// the enclosing function must stay usable afterwards: the missing slot sits
// right on the record's function object
function recordStaysIntact(a) {
    var seen = (() => eval("arguments"))()[0];
    return seen + a + (() => a)();
}
assert(recordStaysIntact(3) === 9);

// a nested arrow, and an eval that only mentions `arguments` indirectly
function readFromNestedArrow(a) {
    return (() => (() => eval("arguments[0]"))())();
}
assert(readFromNestedArrow(5) === 5);

// a normal nested function gets its own arguments object instead
function nestedFunctionHasItsOwn(a) {
    function inner(b) {
        return eval("arguments").length;
    }
    return inner(1, 2, 3) + (() => eval("arguments").length)();
}
assert(nestedFunctionHasItsOwn(4) === 4);

// the strict mode variant takes the unmapped path
function readFromArrowStrict(a) {
    "use strict";
    return (() => eval("arguments"))()[0];
}
assert(readFromArrowStrict(6) === 6);
