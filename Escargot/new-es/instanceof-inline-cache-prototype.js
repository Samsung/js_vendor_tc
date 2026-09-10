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

// Keep all operations at one bytecode site. Ordinary functions share their
// initial structure even though each function has its own lazy prototype slot.
function instanceOfAtOneSite(value, constructor) {
    return value instanceof constructor;
}

function A() {}
function B() {}

var oldA = new A();

// Warm the site until the instanceof inline cache is installed.
assert(instanceOfAtOneSite(oldA, A));
assert(instanceOfAtOneSite(oldA, A));
assert(instanceOfAtOneSite(oldA, A));

// B has the same structure as A, but its lazy prototype slot has not been
// materialized. A structure-cache hit must still initialize B's own slot.
assert(!instanceOfAtOneSite({}, B));
var b = new B();
assert(instanceOfAtOneSite(b, B));
assert(!instanceOfAtOneSite(oldA, B));

// Assignment uses the native prototype setter and does not need to change the
// function structure. The cache must read the current slot value on every hit.
var replacement = {};
A.prototype = replacement;
assert(!instanceOfAtOneSite(oldA, A));

var newA = new A();
assert(instanceOfAtOneSite(newA, A));
assert(!instanceOfAtOneSite(newA, B));

// A non-object prototype is observed through the same slot and must preserve
// OrdinaryHasInstance's TypeError behavior.
A.prototype = 1;
assertThrows(function() {
    instanceOfAtOneSite({}, A);
}, TypeError);

// Primitive left-hand sides return false before consulting the lazy prototype.
function C() {}
assert(!instanceOfAtOneSite(1, C));
assert(!instanceOfAtOneSite(null, C));

var c = new C();
