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

// https://github.com/Samsung/escargot/issues/1726
// Install a plain-object inline cache before passing a TypedArray.
for (var i = 0; i < 12; ++i) (i < 4 ? {} : new Int8Array).length;
function length1726(object) { return object.length; }
for (var i = 0; i < 8; ++i) length1726({});
var typed1726 = new Int8Array(1);
Object.defineProperty(typed1726, "length", { value: 7 });
for (var i = 0; i < 12; ++i) assert(length1726(typed1726) === 7);
assert(length1726(new Uint8Array(3)) === 3);
