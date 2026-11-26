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

// Samsung/escargot#1810
(function () {
    "use strict";
    const symbol = Symbol("locked");
    for (const name of ["1", symbol]) {
        const array = [];
        Object.defineProperty(array, name, { get() { return 1; } });
        for (const object of [Object.freeze({ [name]: 1 }), array]) {
            let calls = 0;
            const key = {
                [Symbol.toPrimitive](hint) {
                    assert(hint === "string");
                    ++calls;
                    return name;
                }
            };
            assertThrows(() => { object[key] = 4; }, TypeError);
            assert(calls === 1 && object[name] === 1);
        }
    }
})();
