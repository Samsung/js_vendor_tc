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

"use strict";
function check(condition, label) {
    if (!condition) throw new Error(label);
}
function own(object, name) {
    return Object.prototype.hasOwnProperty.call(object, name);
}
function syntaxError(source) {
    try {
        Function(source);
    } catch (e) {
        check(e instanceof SyntaxError, "expected SyntaxError");
        return;
    }
    throw new Error("expected SyntaxError for " + source);
}

var proto = { inherited: 42 };
var __proto__ = proto;
function makeIdentifier() { return { __proto__: proto, x: 1 }; }
function makeString() { return { "__proto__": proto, x: 1 }; }
function makeEscapedString() { return { "\u005f_proto__": proto }; }
function makeEscapedIdentifier() { return { \u005f_proto__: proto }; }
function makeComputed() { return { ["__proto__"]: proto }; }
function makeShorthand() { return { __proto__ }; }
function makeMethod() { return { __proto__() { return 7; } }; }
function makeNull() { return { "__proto__": null }; }
function makePrimitive() { return { "__proto__": 5 }; }
function makeAnonymous() { return { "__proto__": function () {} }; }
function makeComputedAnonymous() { return { ["__proto__"]: function () {} }; }
function makeMixed() { return { __proto__: proto, ["__proto__"]: 7, x: 2 }; }
function makeNumberAfterString() { return { "__proto__": 1, 1: 3 }; }
function makeDynamic(value) { return { __proto__: value, a: 1, b: 2 }; }

// Repeated calls also exercise cached object structures and lazy function parsing.
for (var i = 0; i < 5; i++) {
    for (var make of [makeIdentifier, makeString, makeEscapedString, makeEscapedIdentifier]) {
        var o = make();
        check(Object.getPrototypeOf(o) === proto, "prototype setter");
        check(o.inherited === 42 && !own(o, "__proto__"), "prototype setter properties");
    }
    var computed = makeComputed();
    check(Object.getPrototypeOf(computed) === Object.prototype && own(computed, "__proto__"), "computed property");
    check(computed.__proto__ === proto, "computed property value");
    var shorthand = makeShorthand();
    check(Object.getPrototypeOf(shorthand) === Object.prototype && own(shorthand, "__proto__"), "shorthand property");
    check(shorthand.__proto__ === proto, "shorthand value");
    var method = makeMethod();
    check(Object.getPrototypeOf(method) === Object.prototype && own(method, "__proto__"), "method property");
    check(method.__proto__() === 7, "method value");
    check(method.__proto__.name === "__proto__", "method name");
    check(Object.getPrototypeOf(makeNull()) === null, "null prototype");
    var primitive = makePrimitive();
    check(Object.getPrototypeOf(primitive) === Object.prototype && !own(primitive, "__proto__"), "primitive prototype");
    check(Object.getPrototypeOf(makeAnonymous()).name === "", "prototype function name");
    check(makeComputedAnonymous().__proto__.name === "__proto__", "computed function name");
    var mixed = makeMixed();
    check(Object.getPrototypeOf(mixed) === proto && mixed.__proto__ === 7 && mixed.x === 2, "mixed properties");
    check(makeNumberAfterString()[1] === 3, "numeric key after string");
}

var otherProto = { other: 1 };
for (var value of [proto, otherProto, null, 3, proto]) {
    var dynamic = makeDynamic(value);
    check(Object.getPrototypeOf(dynamic) === (typeof value === "number" ? Object.prototype : value), "cached dynamic prototype");
    check(dynamic.a === 1 && dynamic.b === 2 && !own(dynamic, "__proto__"), "cached dynamic properties");
}

var getter = { get __proto__() { return 8; } };
check(Object.getPrototypeOf(getter) === Object.prototype && own(getter, "__proto__"), "getter property");
check(getter.__proto__ === 8, "getter value");
var setter = { set __proto__(v) { this.seen = v; } };
setter.__proto__ = 9;
check(Object.getPrototypeOf(setter) === Object.prototype && own(setter, "__proto__") && setter.seen === 9, "setter property");

var combined = { __proto__: null, __proto__ };
check(Object.getPrototypeOf(combined) === null && own(combined, "__proto__"), "setter with shorthand");
syntaxError('return { __proto__: null, "__proto__": null };');
syntaxError('function f() { return { "__proto__": null, __proto__: null }; }');
Function('function f() { return { "__proto__": null, 1: 3 }; }');
var extracted;
({ __proto__: extracted } = { ["__proto__"]: 17 });
check(extracted === 17, "destructuring property");

class C {
    static __proto__() { return 11; }
    __proto__() { return 12; }
}
check(own(C, "__proto__") && Object.getPrototypeOf(C) === Function.prototype, "static method property");
check(C.__proto__() === 11 && own(C.prototype, "__proto__") && new C().__proto__() === 12, "class method values");
var descriptor = Object.getOwnPropertyDescriptor(C, "__proto__");
check(descriptor.writable && descriptor.configurable && !descriptor.enumerable, "static method descriptor");

function makeClass() { return class { static __proto__() { return 13; } }; }
for (var i = 0; i < 5; i++) {
    var cls = makeClass();
    check(own(cls, "__proto__") && Object.getPrototypeOf(cls) === Function.prototype && cls.__proto__() === 13,
          "cached static method");
}

function* generator() { return { "__proto__": proto, x: 3 }; }
var generated = generator().next().value;
check(Object.getPrototypeOf(generated) === proto && generated.x === 3, "generator prototype");
print("PASS");
