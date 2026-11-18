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

function check(condition, label) {
    if (!condition) throw new Error(label);
}

function expectError(type, fn, label) {
    try {
        fn();
    } catch (e) {
        check(e instanceof type, label + ": unexpected " + e);
        return;
    }
    throw new Error(label + ": expected " + type.name);
}

function frozenArray() {
    var a = [1, 2, 3];
    Object.defineProperty(a, "length", { writable: false });
    return a;
}

function strictAssign(a, value) {
    "use strict";
    a.length = value;
}

function sloppyAssign(a, value) {
    a.length = value;
}

for (var value of [0, 1, 3, 4, -1, 1.5, Symbol()]) {
    var a = frozenArray();
    expectError(TypeError, function () { strictAssign(a, value); }, "strict assignment");
    check(a.length === 3 && a.join() === "1,2,3", "strict assignment changed array");
    sloppyAssign(a, value);
    check(a.length === 3 && a.join() === "1,2,3", "sloppy assignment changed array");
}

var calls = 0;
var input = { valueOf: function () { calls++; return 1; } };
var a = frozenArray();
expectError(TypeError, function () { strictAssign(a, input); }, "non-writable object value");
sloppyAssign(a, input);
check(calls === 0 && a.length === 3, "non-writable assignment converted value");

var key = "length";
expectError(TypeError, function () { "use strict"; a[key] = 1; }, "computed assignment");
check(Reflect.set(a, "length", 1) === false && a.length === 3, "Reflect.set");

function freezeDuringConversion(length) {
    var array = [1, 2, 3], count = 0;
    var object = { valueOf: function () {
        count++;
        Object.defineProperty(array, "length", { writable: false });
        return length;
    } };
    return { array: array, object: object, count: function () { return count; } };
}

var same = freezeDuringConversion(3);
strictAssign(same.array, same.object);
check(same.count() === 2 && same.array.length === 3, "reentrant same length");
check(!Object.getOwnPropertyDescriptor(same.array, "length").writable, "reentrant writable flag");

var shorter = freezeDuringConversion(1);
expectError(TypeError, function () { strictAssign(shorter.array, shorter.object); }, "reentrant shorter length");
check(shorter.count() === 2 && shorter.array.join() === "1,2,3", "reentrant changed array");

var normal = [1, 2, 3];
expectError(RangeError, function () { strictAssign(normal, -1); }, "invalid writable length");
check(normal.length === 3, "invalid length changed array");

var defined = [1, 2, 3];
Object.defineProperty(defined, "length", { value: 1, writable: false });
check(defined.length === 1 && defined[0] === 1, "define and freeze");
check(!Object.getOwnPropertyDescriptor(defined, "length").writable, "define and freeze flag");
Object.defineProperty(defined, "length", { value: 1 });
expectError(TypeError, function () { Object.defineProperty(defined, "length", { value: 0 }); }, "redefine frozen length");

var defineCalls = 0;
var defineValue = { valueOf: function () { defineCalls++; return 1; } };
Object.defineProperty(defined, "length", { value: defineValue });
check(defineCalls === 2, "defineProperty must convert value");

var blocked = [0, 1, 2, 3];
Object.defineProperty(blocked, "1", { configurable: false });
expectError(TypeError, function () {
    Object.defineProperty(blocked, "length", { value: 0, writable: false });
}, "non-configurable element");
check(blocked.length === 2 && blocked[1] === 1 && !(2 in blocked), "partial truncation");
check(!Object.getOwnPropertyDescriptor(blocked, "length").writable, "partial truncation writable flag");

print("PASS");
