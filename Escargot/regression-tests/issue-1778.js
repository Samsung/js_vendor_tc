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

// Samsung/escargot#1778: object rest and spread follow CopyDataProperties,
// including proxy traps.

(function () {
    var J = JSON.stringify;
    function same(name, actual, expected) {
        if (actual !== expected)
            throw new Error(name + ": got " + actual + ", expected " + expected);
    }

    function logged(target, hiddenKey) {
        var log = [];
        var proxy = new Proxy(target, {
            ownKeys(t) { log.push("ownKeys"); return Reflect.ownKeys(t); },
            getOwnPropertyDescriptor(t, k) {
                log.push("gopd:" + String(k));
                var d = Reflect.getOwnPropertyDescriptor(t, k);
                if (k === hiddenKey)
                    d.enumerable = false;
                return d;
            },
            get(t, k) { log.push("get:" + String(k)); return Reflect.get(t, k); }
        });
        return { proxy: proxy, log: log };
    }

    // rest on a proxy: ownKeys after the other properties, excluded keys are not queried
    (function () {
        var p = logged({ a: 1, c: 2, d: 3 }, "d");
        var { a, ...r } = p.proxy;
        same("rest-proxy", J([a, r, p.log]), J([1, { c: 2 }, ["get:a", "ownKeys", "gopd:c", "get:c", "gopd:d"]]));
    })();

    // spread on a proxy
    (function () {
        var p = logged({ a: 1, c: 2 }, "c");
        var s = { ...p.proxy };
        same("spread-proxy", J([s, p.log]), J([{ a: 1 }, ["ownKeys", "gopd:a", "get:a", "gopd:c"]]));
    })();

    // keys reported only by the ownKeys trap
    (function () {
        var p = new Proxy({}, {
            ownKeys() { return ["x"]; },
            getOwnPropertyDescriptor() { return { value: 7, enumerable: true, configurable: true }; },
            get() { return 7; }
        });
        var { ...r } = p;
        same("rest-proxy-virtual", J(r), J({ x: 7 }));
        same("spread-proxy-virtual", J({ ...p }), J({ x: 7 }));
    })();

    // own keys are read after the other properties are bound
    (function () {
        var o = { get a() { o.z = 1; return 1; }, b: 2 };
        var { a, ...r } = o;
        same("late-add", J(r), J({ b: 2, z: 1 }));
    })();

    // CreateDataProperty: an own __proto__ key is copied and no setter is reached
    (function () {
        var { ...r } = JSON.parse('{"__proto__": 5, "k": 1}');
        same("own-proto", Object.getOwnPropertyNames(r).join() + " " + (Object.getPrototypeOf(r) === Object.prototype), "__proto__,k true");

        var hit = false;
        Object.defineProperty(Object.prototype, "zz", { set: function () { hit = true; }, configurable: true });
        var { ...r2 } = { zz: 1 };
        delete Object.prototype.zz;
        same("proto-setter", hit + " " + Object.getOwnPropertyNames(r2).join(), "false zz");
    })();

    // getters mutating the source while it is copied
    (function () {
        var o = { a: 1, get b() { o.c = 3; delete o.d; return 2; }, d: 4 };
        var { a, ...r } = o;
        same("mutate", J(r), J({ b: 2 }));

        var o2 = { a: 1, get b() { delete o2.a; o2.a = 9; return 2; } };
        var { a: a2, b, ...r2 } = o2;
        same("readd-excluded", J(r2), J({}));
    })();

    // arrays, strings and symbols
    (function () {
        var sym = Symbol("s");
        var { 1: one, ...ra } = ["x", "y", "z"];
        var { 0: c, ...rs } = "abc";
        var { b: _, ...ro } = { b: 1, 2: 2, a: 3, 1: 4, [sym]: 5 };
        same("misc", J([ra, rs, Object.keys(ro), ro[sym]]), J([{ 0: "x", 2: "z" }, { 1: "b", 2: "c" }, ["1", "2", "a"], 5]));
    })();
})();
