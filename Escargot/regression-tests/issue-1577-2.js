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

// Issue #1577 Crash #2: a `using` declaration in a switch case, preceded by
// another statement, used to abort with Assertion `isDisposableResourceRecord()'
// failed / SEGV because the case body clobbered the disposable-record register.

// minimal repro: a statement before `using` must not be clobbered
var o = {};
switch (1) {
    case 1:
        o.k = 1;
        using v = null; // null/undefined disposables are allowed and skipped
        break;
}
assert(o.k === 1);

// Symbol.dispose runs at the end of the case block
var log = [];
switch (1) {
    case 1:
        log.push("a");
        using d = { [Symbol.dispose]() { log.push("disposed"); } };
        log.push("b");
        break;
}
assert(log.join(",") === "a,b,disposed");

// multiple using declarations are disposed in reverse order
var order = [];
switch (1) {
    case 1:
        using a = { [Symbol.dispose]() { order.push("A"); } };
        using b = { [Symbol.dispose]() { order.push("B"); } };
        break;
}
assert(order.join(",") === "B,A");

// a value stored before `using` is still readable afterwards
var obj = {};
switch (2) {
    case 2:
        obj.x = 99;
        using w = null;
        assert(obj.x === 99);
        break;
}

// original reported shape: `using` a non-disposable (a class) must throw a
// TypeError rather than crash.
assertThrows(function () {
    Reflect.construct(function F4() {
        const v0 = new Array(0x4141).fill(1.1);
        const v2 = {};
        switch (-1n) {
            case -1n:
                v2[this] = v0;
                class C7 extends ArrayBuffer {}
                using v8 = C7;
                break;
        }
    }, []);
}, TypeError);

print("issue-1577-2 passed");
