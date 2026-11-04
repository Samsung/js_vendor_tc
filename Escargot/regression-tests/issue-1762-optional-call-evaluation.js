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

var optionalEvalScope = "global";
(function () {
    let optionalEvalScope = "local";
    assert(eval("optionalEvalScope") === "local");
    assert(eval?.("optionalEvalScope") === "global");
    function indirectTail() {
        "use strict";
        return eval?.("optionalEvalScope");
    }
    assert(indirectTail() === "global");
})();

(function () {
    let effects = 0;
    function argument() { ++effects; throw new Error("argument evaluated"); }
    function optionalEval(eval) {
        assert(eval?.(argument()) === undefined);
        assert(eval?.(...argument()) === undefined);
        assert(eval?.(0, ...argument(), argument()) === undefined);
        assert(eval?.().property === undefined);
        return eval?.(argument());
    }
    assert(optionalEval(null) === undefined);
    assert(optionalEval(undefined) === undefined);
    assert(effects === 0);

    function sloppyTail(fn) { return fn?.(++effects); }
    function strictTail(fn) { "use strict"; return fn?.(++effects); }
    assert(sloppyTail(null) === undefined);
    assert(strictTail(undefined) === undefined);
    assert(effects === 0);
    assert(strictTail(x => x + 1) === 2);
    assert(effects === 1);

    const sentinel = {};
    function throws() { throw sentinel; }
    function assignment(fn) {
        let result = 7;
        try { result = fn?.(throws()); } catch (error) {
            assert(error === sentinel);
        }
        return result;
    }
    assert(assignment(null) === undefined);
    assert(assignment(x => x) === 7);
    function throwingCallee() {
        let result = 7;
        try { result = throws()?.(); } catch (error) {
            assert(error === sentinel);
        }
        return result;
    }
    assert(throwingCallee() === 7);

    let nonCallable = 0;
    assertThrows(() => nonCallable?.(++effects), TypeError);
    assert(effects === 2);

    // The apply/arguments fast path must also honor the enclosing chain.
    let target = null;
    function optionalApply() { return target?.apply(null, arguments); }
    assert(optionalApply(1, 2) === undefined);
    target = function (a, b) { return a + b; };
    assert(optionalApply(1, 2) === 3);
})();

// A non-nullish callee still evaluates its spread before a callable check.
(function () {
    let iterations = 0;
    const iterable = {
        *[Symbol.iterator]() { ++iterations; yield 1; }
    };
    function optionalEval(eval) { return eval?.(...iterable); }
    function optionalCall(fn) { return fn?.(...iterable); }
    function ordinaryCall(fn) { return fn(...iterable); }
    for (const invoke of [optionalEval, optionalCall, ordinaryCall]) {
        assertThrows(() => invoke(0), TypeError);
    }
    assert(iterations === 3);
    assert(optionalEval(null) === undefined);
    assert(optionalCall(undefined) === undefined);
    assert(iterations === 3);

    const sentinel = {};
    const throwingIterable = {
        [Symbol.iterator]() { throw sentinel; }
    };
    function throwingSpread(eval) {
        let caught;
        try { eval?.(...throwingIterable); } catch (error) { caught = error; }
        assert(caught === sentinel);
    }
    throwingSpread(0);
})();
