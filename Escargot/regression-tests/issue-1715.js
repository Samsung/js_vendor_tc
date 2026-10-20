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

// https://github.com/Samsung/escargot/issues/1715
// new WebAssembly.Module crashes in keepBlockResultsIfNeeds on a try_table in unreachable code
if (typeof WebAssembly !== "undefined") {
    assert(WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 127, 3, 2, 1, 0, 10, 20, 1, 18, 0, 2, 127, 65, 1, 4, 64, 5, 0, 31, 64, 0, 11, 11, 65, 1, 11, 11])));
    new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 127, 3, 2, 1, 0, 10, 20, 1, 18, 0, 2, 127, 65, 1, 4, 64, 5, 0, 31, 64, 0, 11, 11, 65, 1, 11, 11]));
    assert(new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 127, 3, 2, 1, 0, 7, 5, 1, 1, 102, 0, 0, 10, 16, 1, 14, 0, 2, 127, 65, 5, 12, 0, 31, 64, 0, 11, 0, 11, 11]))).exports.f() === 5);
}
