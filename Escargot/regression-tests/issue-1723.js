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
// Ordinary prototype traversal must complete without consuming native frames.
var root173 = { inherited173: 17 };
var deep173 = root173;
for (var i = 0; i < 100000; ++i) deep173 = Object.create(deep173);
deep173.x = 1;
assert(deep173.x === 1);
assert(!("missing173" in deep173));
assert("inherited173" in deep173);
assert(Reflect.set(deep173, "y", 2));
assert(deep173.y === 2);
deep173[5] = 3;
assert(deep173[5] === 3);
assert(Reflect.set(deep173, "inherited173", 42));
assert(root173.inherited173 === 17 && deep173.inherited173 === 42);
