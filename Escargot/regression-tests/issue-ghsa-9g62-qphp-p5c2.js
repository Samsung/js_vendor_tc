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

// GHSA-9g62-qphp-p5c2: nested patterns inside an object pattern with a rest
// element must not use the enclosing pattern's enumeration register.

var failures = 0;
function check(name, actual, expected) {
    if (actual !== expected) {
        failures++;
        print("FAIL " + name + ": got " + actual + ", expected " + expected);
    }
}
var J = JSON.stringify;
// nested pattern without rest inside pattern with rest
(function () { var { q: { s }, ...rest } = { q: {}, t: 1 }; check("nested-plain", s + J(rest), "undefined" + J({ t: 1 })); })();
// nested pattern with rest inside pattern with rest: outer keys after the nested one must stay excluded
(function () { var { a: { b, ...c }, d, ...e } = { a: { b: 1, x: 2 }, d: 3, f: 4 };
    check("nested-rest", J([b, c, d, e]), J([1, { x: 2 }, 3, { f: 4 }])); })();
// nested default
(function () { var { q: { s } = { s: 5 }, ...rest } = { t: 2 }; check("nested-default", s + J(rest), "5" + J({ t: 2 })); })();
// parameter
check("param", (function ({ q: { s } = {}, ...rest }) { return J([s, rest]); })({ q: { s: 1 }, z: 0 }), J([1, { z: 0 }]));
// computed keys, including ones inside nested patterns
(function () { var k = "k", n = "n";
    var { [k]: { [n]: v, ...inner }, ...outer } = { k: { n: 1, m: 2 }, other: 3 };
    check("computed", J([v, inner, outer]), J([1, { m: 2 }, { other: 3 }])); })();
// numeric / symbol keys
(function () { var sym = Symbol("s");
    var { 0: { a }, [sym]: y, ...r } = { 0: { a: 1 }, 1: 2, [sym]: 3 };
    check("numeric-symbol", J([a, y, r, Object.getOwnPropertySymbols(r).length]), J([1, 3, { 1: 2 }, 0])); })();
// array pattern inside
(function () { var { a: [{ b }, ...tail], ...r } = { a: [{ b: 1 }, 2, 3], c: 4 };
    check("array-inside", J([b, tail, r]), J([1, [2, 3], { c: 4 }])); })();
// assignment pattern in default value expression
(function () { var x; var { a = ({ x } = { x: 9 }), ...r } = { c: 2 };
    check("assign-in-default", J([x, a, r]), J([9, { x: 9 }, { c: 2 }])); })();
// assignment (non-declaration) destructuring
(function () { var s, rest; ({ q: { s }, ...rest } = { q: { s: 8 }, w: 1 });
    check("assignment-expr", J([s, rest]), J([8, { w: 1 }])); })();
// let / const / for-of / catch
(function () { let { q: { s }, ...rest } = { q: { s: 1 }, w: 1 }; const { q: { s: s2 }, ...rest2 } = { q: { s: 2 } };
    var out = []; for (const { a: { b }, ...r } of [{ a: { b: 1 }, c: 2 }]) out.push(b, r);
    try { throw { a: { b: 7 }, d: 8 }; } catch ({ a: { b: cb }, ...cr }) { out.push(cb, cr); }
    check("let-const-forof-catch", J([s, rest, s2, rest2, out]), J([1, { w: 1 }, 2, {}, [1, { c: 2 }, 7, { d: 8 }]])); })();
// deeper nesting, two levels of rest
(function () { var { a: { b: { c, ...d }, ...e }, ...f } = { a: { b: { c: 1, x: 1 }, y: 2 }, z: 3 };
    check("deep", J([c, d, e, f]), J([1, { x: 1 }, { y: 2 }, { z: 3 }])); })();
// getter evaluation order and count
(function () { var log = [];
    var src = { get a() { log.push("a"); return { get b() { log.push("b"); return 1; } }; }, get c() { log.push("c"); return 2; }, get d() { log.push("d"); return 3; } };
    var { a: { b }, c, ...r } = src;
    check("getter-order", J([log, b, c, r]), J([["a", "b", "c", "d"], 1, 2, { d: 3 }])); })();
// exception in nested getter propagates, rest not created
(function () { var reached = false, r;
    try { var { a: { b }, ...r } = { a: { get b() { throw new Error("boom"); } }, c: 1 }; reached = true; } catch (e) { check("nested-throw", e.message + reached + (r === undefined), "boomfalsetrue"); } })();
// nested pattern on undefined throws TypeError
(function () { try { var { a: { b }, ...r } = {}; check("nested-undefined", "no throw", "TypeError"); } catch (e) { check("nested-undefined", e.name, "TypeError"); } })();
// computed key evaluation order relative to nested binding
(function () { var log = [];
    var { [(log.push("k1"), "a")]: { [(log.push("k2"), "b")]: v }, [(log.push("k3"), "c")]: w, ...r } = { a: { b: 1 }, c: 2, d: 3 };
    check("computed-order", J([log, v, w, r]), J([["k1", "k2", "k3"], 1, 2, { d: 3 }])); })();
if (failures)
    throw new Error(failures + " failures");
