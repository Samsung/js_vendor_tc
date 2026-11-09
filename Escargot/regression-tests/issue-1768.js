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

// Samsung/escargot#1768: exponentiation.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    same(1 ** NaN, NaN);
    var x = 1; x **= NaN; same(x, NaN);
    same((-1) ** NaN, NaN);
    same(0 ** NaN, NaN);
    same(NaN ** 0, 1);
    same(1 ** Infinity, NaN);
    same((-1) ** -Infinity, NaN);
    same(2 ** 3, 8);
    same(2n ** 3n, 8n);
    var calls = [];
    same(({ valueOf() { calls.push('base'); return 1; } }) **
         ({ valueOf() { calls.push('exponent'); return NaN; } }), NaN);
    same(calls.join(), 'base,exponent');
})();
