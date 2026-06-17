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

// Issue #484: A class definition is always strict mode code, including its
// heritage expression and computed property names, even when it appears inside
// non-strict (sloppy) code. Previously these parts were evaluated with the
// surrounding sloppy strict flag, so strict-only errors were not raised.

// In strict mode, assigning to an undeclared name throws ReferenceError.
// A computed property name is evaluated as strict mode code.
assertThrows(function () {
    class C {
        [issue484UndeclaredA = 1]() {}
    }
}, ReferenceError);

// The heritage (extends) expression is also evaluated as strict mode code.
assertThrows(function () {
    class C extends (issue484UndeclaredB = function () {}) {}
}, ReferenceError);

// Nested classes must restore the strict flag of the enclosing class, so the
// outer computed name is still evaluated in strict mode after the inner class.
assertThrows(function () {
    class Outer {
        [(class Inner {}, issue484UndeclaredC = 1)]() {}
    }
}, ReferenceError);

// Control: the very same statement in plain sloppy code does NOT throw, which
// is exactly why the class parts must be switched into strict mode explicitly.
(function () {
    issue484SloppyOk = 1;
    assert(issue484SloppyOk === 1);
})();

// After a class definition finishes, the surrounding sloppy code must behave as
// sloppy again (the saved strict flag is restored).
(function () {
    class C extends Object {
        ["m"]() {}
    }
    issue484Restored = 42;
    assert(issue484Restored === 42);
})();

// The strict switch must not leak into functions that merely run during the
// class evaluation: a sloppy function called from a computed name stays sloppy.
function issue484MakeKey() {
    issue484CalleeSloppy = 7;
    return "k";
}
(function () {
    class C {
        [issue484MakeKey()]() {}
    }
    assert(issue484CalleeSloppy === 7);
})();

// A class inside already-strict code keeps working (no double switch / no crash).
(function () {
    "use strict";
    var probe = "p";
    class C extends Object {
        [probe]() { return 1; }
    }
    assert(new C().p() === 1);
})();

print("issue-484 passed");
