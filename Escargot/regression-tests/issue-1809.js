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

// Samsung/escargot#1809
(function () {
    function args(x) { return arguments; }
    const a = args(5);
    const symbol = Symbol();
    for (const name of ["missing", "0", symbol]) {
        let calls = 0;
        const key = {
            [Symbol.toPrimitive](hint) {
                assert(hint === "string");
                ++calls;
                return name;
            }
        };
        assert(a[key] === (name === "0" ? 5 : undefined));
        assert(calls === 1);
        calls = 0;
        a[key] = 9;
        assert(calls === 1 && a[name] === 9);
    }
})();
