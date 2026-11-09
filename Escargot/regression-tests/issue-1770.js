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

// Samsung/escargot#1770: function own key order.

(function () {
    'use strict';

    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    [function f(a) {}, function* g(a) {}, async function* ag(a) {}, class C { constructor(a) {} }].forEach(function (f) {
        same(Reflect.ownKeys(f).join(), 'length,name,prototype');
        same(Object.getOwnPropertyNames(f).join(), 'length,name,prototype');
        same(f.length, 1);
        same(typeof f.prototype, 'object');
    });
    function F(a, b) { this.x = a + b; }
    same(F.name, 'F'); same(F.length, 2);
    same(new F(2, 3).x, 5);
    same(new F() instanceof F, true);
    var old = F.prototype; F.prototype = {}; same(F.prototype === old, false);
    var inferred = function () {}; same(inferred.name, 'inferred');
    same((function* () { yield 42; })().next().value, 42);
    same(Array.name, 'Array'); same(Array.length, 1);
    same(Array.prototype.constructor, Array);
    same((() => {}).name, '');
})();
