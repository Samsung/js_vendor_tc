/* Copyright 2024-present Samsung Electronics Co., Ltd. and other contributors
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

// Issue #1577 Crash #1: labeled continue targeting a for-of loop
// Used to abort with Assertion `!v.isEmpty()' failed.
L2: for (const v1 of [-Infinity, 6.503875535024832e+305, -Infinity]) {
    continue L2;
}

// labeled continue runs every iteration, just like an unlabeled continue
var n = 0;
L: for (const v of [1, 2, 3]) { n++; continue L; }
assert(n === 3);

// multiple labels on the same for-of: continue to either label is valid
var outer = 0;
L1: L3: for (const v of [1, 2, 3]) { outer++; continue L1; }
assert(outer === 3);

var inner = 0;
M1: M3: for (const v of [1, 2, 3]) { inner++; continue M3; }
assert(inner === 3);

// `continue OUTER` from a nested loop must close the inner iterator and
// resume the outer loop (previously this silently terminated the script).
var log = [];
OUTER: for (const a of ["a", "b"]) {
    for (const b of ["x", "y", "z"]) {
        log.push(a + b);
        continue OUTER;
    }
}
assert(log.join(",") === "ax,bx");

// labeled and unlabeled continue must dispose the iterator identically
function countClose(useLabel) {
    var closed = 0;
    var it = {
        [Symbol.iterator]() {
            var i = 0;
            return {
                next() { return { value: i, done: i++ >= 3 }; },
                return() { closed++; return {}; }
            };
        }
    };
    if (useLabel) {
        K: for (const v of it) { continue K; }
    } else {
        for (const v of it) { continue; }
    }
    return closed;
}
assert(countClose(true) === countClose(false));

print("issue-1577-1 passed");
