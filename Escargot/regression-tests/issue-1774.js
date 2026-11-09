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

// Samsung/escargot#1774: decrement coercion.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    var n = 0, v = { valueOf() { n++; return n === 1 ? 4 : 100; } };
    var w = v; same(--w, 3); same(n, 1);
    n = 0; var o = { p: v }; same(--o.p, 3); same(n, 1);
    n = 0; w = v; same(++w, 5); same(n, 1);
    n = 0; w = v; same(w--, 4); same(w, 3); same(n, 1);
    n = 0; w = { [Symbol.toPrimitive]() { n++; return 4n; } };
    same(--w, 3n); same(n, 1);
    n = 0; w = { valueOf() { n++; throw 42; } };
    try { --w; throw new Error('missing throw'); } catch (e) { same(e, 42); }
    same(n, 1);
})();
