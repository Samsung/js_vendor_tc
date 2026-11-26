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

// Samsung/escargot#1814
(function () {
    assert(Number(Object(5n)) === 5);
    let calls = 0;
    const object = {
        [Symbol.toPrimitive](hint) {
            assert(hint === "number");
            ++calls;
            return -10n;
        }
    };
    assert(Number(object) === -10 && calls === 1);
    assert(new Number(object).valueOf() === -10 && calls === 2);
    assertThrows(() => +object, TypeError);
})();
