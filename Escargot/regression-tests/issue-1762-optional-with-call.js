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

(function () {
    let effects = 0;
    function argument() { ++effects; return [1, 2]; }
    function absent(obj) {
        with (obj) {
            assert(fn?.(argument()) === undefined);
            assert(fn?.(...argument()) === undefined);
            assert(fn?.(0, ...argument()) === undefined);
            assert(fn?.().property === undefined);
            return fn?.(argument());
        }
    }
    assert(absent({ fn: null }) === undefined);
    assert(absent({ fn: undefined }) === undefined);
    assert(effects === 0);

    const events = [];
    const scope = {
        get fn() {
            events.push("get");
            return function (value) {
                "use strict";
                assert(this === scope);
                events.push("call");
                return value;
            };
        }
    };
    function changeBinding() {
        events.push("argument");
        Object.defineProperty(scope, "fn", { value: null, configurable: true });
        return 42;
    }
    with (scope) { assert(fn?.(changeBinding()) === 42); }
    assert(events.join(",") === "get,argument,call");

    let unscopablesReads = 0;
    const receiver = {
        get [Symbol.unscopables]() { ++unscopablesReads; return {}; },
        fn: function () { "use strict"; return this; }
    };
    function receiverOf(obj) { with (obj) { return fn?.(); } }
    assert(receiverOf(receiver) === receiver);
    assert(unscopablesReads === 1);

    function lexicalReceiver() {
        let fn = function () { "use strict"; return this; };
        with ({ fn: null, [Symbol.unscopables]: { fn: true } }) {
            return fn?.();
        }
    }
    assert(lexicalReceiver() === undefined);

    const outer = { fn: function () { "use strict"; return this; } };
    function nestedReceiver() {
        with (outer) {
            with ({ fn: null, [Symbol.unscopables]: { fn: true } }) {
                return fn?.();
            }
        }
    }
    assert(nestedReceiver() === outer);

    const spreadScope = {
        fn: function (a, b) { "use strict"; assert(this === spreadScope); return a + b; }
    };
    with (spreadScope) {
        assert(fn?.(...[2, 3]) === 5);
        assert(fn?.(2, ...[3]) === 5);
    }

    let evalReads = 0;
    const evalScope = {
        get eval() {
            ++evalReads;
            return function (value) { "use strict"; assert(this === evalScope); return value; };
        }
    };
    with (evalScope) { assert(eval?.(42) === 42); }
    assert(evalReads === 1);
    with ({ eval: null }) { assert(eval?.(argument()) === undefined); }
    assert(effects === 0);
    assertThrows(function () {
        with ({}) { missingOptionalFunction1762?.(argument()); }
    }, ReferenceError);
    assert(effects === 0);
})();

(function () {
    let iterations = 0;
    const iterable = {
        *[Symbol.iterator]() { ++iterations; yield 1; }
    };
    function call(scope, args) { with (scope) { return fn?.(...args); } }
    assertThrows(() => call({ fn: 0 }, iterable), TypeError);
    assert(iterations === 1);
    assert(call({ fn: null }, iterable) === undefined);
    assert(iterations === 1);

    const sentinel = {};
    const throwingIterable = {
        [Symbol.iterator]() { throw sentinel; }
    };
    let caught;
    try { call({ fn: 0 }, throwingIterable); } catch (error) { caught = error; }
    assert(caught === sentinel);
})();
