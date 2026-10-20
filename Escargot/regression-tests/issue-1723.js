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

// https://github.com/Samsung/escargot/issues/1723
// Prototype traversal must complete or throw a JS RangeError, never overflow C++.
var deep173 = {};
for (var i = 0; i < 100000; ++i) deep173 = Object.create(deep173);
function checked173(operation) {
    try { operation(); } catch (error) { assert(error instanceof RangeError); }
}
checked173(function () { deep173.x = 1; assert(deep173.x === 1); });
checked173(function () { assert(!("missing173" in deep173)); });
checked173(function () { assert(Reflect.set(deep173, "y", 2)); assert(deep173.y === 2); });
checked173(function () { deep173[5] = 3; assert(deep173[5] === 3); });
