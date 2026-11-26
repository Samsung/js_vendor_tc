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

// Samsung/escargot#1805
(function () {
    const events = [];
    const method = {
        valueOf() { return "prototype"; },
        toString() { events.push("method"); return "create"; }
    };
    let n = 0;
    const field = {
        toString() { events.push("field"); return "field" + n; }
    };
    const symbol = Symbol("accessor");
    const accessor = {
        [Symbol.toPrimitive](hint) { events.push(hint); return symbol; }
    };

    class Example {
        static [method]() { return 42; }
        static [field] = ++n;
        static get [accessor]() { return n; }
    }

    assert(events.join(",") === "method,field,string");
    assert(Example.create() === 42);
    assert(Example.field0 === 1);
    assert(Example[symbol] === 1);

    let initialized = false;
    const forbidden = { toString() { return "prototype"; } };
    assertThrows(() => {
        class Invalid {
            static first = (initialized = true);
            static [forbidden]() {}
        }
    }, TypeError);
    assert(!initialized);
})();
