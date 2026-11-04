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

// Completing the RHS includes its PutValue or destructuring steps. A failed
// inner store must not commit the enclosing assignment (ECMA-262 13.15.2).
(function () {
    const sentinel = {};
    // Expression, initial target, stored value, and expression result.
    const cases = [
        ["TARGET = 2", 4, 2, 2],
        ["TARGET += 2", 4, 6, 6],
        ["TARGET -= 2", 4, 2, 2],
        ["TARGET *= 2", 4, 8, 8],
        ["TARGET /= 2", 4, 2, 2],
        ["TARGET %= 2", 4, 0, 0],
        ["TARGET **= 2", 4, 16, 16],
        ["TARGET <<= 2", 4, 16, 16],
        ["TARGET >>= 2", 4, 1, 1],
        ["TARGET >>>= 2", 4, 1, 1],
        ["TARGET &= 2", 4, 0, 0],
        ["TARGET ^= 2", 4, 6, 6],
        ["TARGET |= 2", 4, 6, 6],
        ["TARGET ||= 2", 0, 2, 2],
        ["TARGET &&= 2", 4, 2, 2],
        ["TARGET ??= 2", null, 2, 2],
        ["++TARGET", 4, 5, 5],
        ["TARGET++", 4, 5, 4],
        ["--TARGET", 4, 3, 3],
        ["TARGET--", 4, 3, 4]
    ];

    function equal(actual, expected, label) {
        if (actual !== expected) {
            throw new Error(label + ": expected " + expected + ", got " + actual);
        }
    }

    // Generate each form without direct eval or a closure over r, so r can
    // use stack storage and the assignment optimization remains exercised.
    function evaluator(expression, strict) {
        return new Function("o", (strict ? '"use strict";' : "") +
            "let r = 7, caught;" +
            "try { r = (" + expression + "); } catch (e) { caught = e; }" +
            "return [r, caught];");
    }

    for (const [form, initial, stored, value] of cases) {
        const expression = form.replace("TARGET", "o.x");
        const run = evaluator(expression, false);
        const strictRun = evaluator(expression, true);

        for (const evaluate of [run, strictRun]) {
            let gets = 0, sets = 0, received;
            const accessor = {
                get x() { gets++; return initial; },
                set x(v) { sets++; received = v; throw sentinel; }
            };
            const result = evaluate(accessor);
            equal(result[1], sentinel, form + " setter exception");
            equal(result[0], 7, form + " outer target");
            equal(gets, form === "TARGET = 2" ? 0 : 1, form + " gets");
            equal(sets, 1, form + " sets");
            equal(received, stored, form + " setter value");
        }

        let sets = 0;
        const proxy = new Proxy({ x: initial }, {
            set(target, key, v) {
                sets++;
                equal(key, "x", form + " proxy key");
                equal(v, stored, form + " proxy value");
                throw sentinel;
            }
        });
        let result = run(proxy);
        equal(result[1], sentinel, form + " proxy exception");
        equal(result[0], 7, form + " proxy outer target");
        equal(sets, 1, form + " proxy sets");
        equal(proxy.x, initial, form + " proxy target");

        const frozen = Object.freeze({ x: initial });
        result = strictRun(frozen);
        assert(result[1] instanceof TypeError);
        equal(result[0], 7, form + " readonly outer target");
        equal(frozen.x, initial, form + " readonly property");

        // A non-strict failed store completes normally and returns its value.
        result = run(frozen);
        equal(result[1], undefined, form + " non-strict exception");
        equal(result[0], value, form + " non-strict result");
        equal(frozen.x, initial, form + " non-strict property");

        const constant = new Function("initial",
            "let r = 7, caught; const c = initial;" +
            "try { r = (" + form.replace("TARGET", "c") +
            "); } catch (e) { caught = e; } return [r, caught, c];");
        result = constant(initial);
        assert(result[1] instanceof TypeError);
        equal(result[0], 7, form + " const outer target");
        equal(result[2], initial, form + " const value");

        const object = { x: initial };
        result = run(object);
        equal(result[1], undefined, form + " successful exception");
        equal(result[0], value, form + " successful result");
        equal(object.x, stored, form + " successful property");

        const local = new Function("initial", "let r = 7, v = initial;" +
            "r = (" + form.replace("TARGET", "v") + "); return [r, v];");
        result = local(initial);
        equal(result[0], value, form + " local result");
        equal(result[1], stored, form + " local target");
    }

    // Wrappers must retain the inner store's exception behavior.
    const throwing = { set x(v) { throw sentinel; } };
    for (const expression of [
        "true ? (o.x = 2) : 0",
        "false ? 0 : (o.x = 2)",
        "(0, o.x = 2)"
    ]) {
        const result = evaluator(expression, false)(throwing);
        equal(result[1], sentinel, expression);
        equal(result[0], 7, expression);
    }

    function uninitialized() {
        let r = 7, caught;
        try { r = (t = 2); let t; } catch (e) { caught = e; }
        assert(caught instanceof ReferenceError);
        return r;
    }
    assert(uninitialized() === 7);

    // Earlier destructuring stores are retained when a later getter throws.
    function destructuringObject(source) {
        let r = 7, first = 1, second = 2, caught;
        try { r = ({ first, second } = source); } catch (e) { caught = e; }
        assert(caught === sentinel);
        assert(first === 42 && second === 2);
        return r;
    }
    assert(destructuringObject({
        first: 42,
        get second() { throw sentinel; }
    }) === 7);

    // IteratorClose runs after the element has been stored, but the enclosing
    // assignment must still wait for it to complete.
    let closes = 0;
    const iterable = {
        [Symbol.iterator]() {
            return {
                next() { return { value: 42, done: false }; },
                return() { closes++; throw sentinel; }
            };
        }
    };
    function destructuringArray(source) {
        let r = 7, first = 1, caught;
        try { r = ([first] = source); } catch (e) { caught = e; }
        assert(caught === sentinel);
        assert(first === 42);
        return r;
    }
    assert(destructuringArray(iterable) === 7);
    assert(closes === 1);

    // Preserve explicit RHS side effects on the outer target, too.
    function sideEffect(o) {
        let r = 7, caught;
        try { r = (o.x = (r = 23)); } catch (e) { caught = e; }
        assert(caught === sentinel);
        return r;
    }
    assert(sideEffect(throwing) === 23);

    class PrivateStore {
        #x;
        check(o) {
            let r = 7, caught;
            try { r = (o.#x = 2); } catch (e) { caught = e; }
            assert(caught instanceof TypeError);
            return r;
        }
    }
    assert(new PrivateStore().check({}) === 7);
})();
