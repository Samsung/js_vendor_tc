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

// https://github.com/Samsung/escargot/issues/1728
// Exported function with a v128 loop segfaults when JIT-compiled
if (typeof WebAssembly !== "undefined") {
    var instance = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 27, 4, 96, 0, 0, 96, 6, 127, 123, 123, 124, 125, 124, 0, 96, 4, 124, 127, 127, 125, 1, 125, 96, 2, 125, 124, 1, 124, 3, 2, 1, 3, 5, 3, 1, 0, 1, 7, 6, 1, 2, 119, 48, 0, 0, 10, 105, 1, 103, 9, 2, 124, 2, 123, 1, 125, 1, 124, 2, 123, 1, 124, 1, 127, 1, 123, 1, 125, 32, 10, 33, 2, 32, 11, 32, 12, 32, 12, 32, 10, 32, 13, 32, 10, 3, 1, 33, 3, 26, 26, 33, 4, 33, 5, 26, 32, 3, 32, 11, 32, 11, 32, 0, 32, 11, 4, 2, 26, 26, 26, 26, 32, 13, 5, 26, 26, 26, 26, 32, 13, 11, 26, 32, 11, 32, 12, 32, 12, 32, 10, 32, 13, 32, 1, 32, 11, 13, 0, 26, 33, 6, 33, 7, 33, 8, 33, 9, 26, 11, 32, 2, 11])));
    for (var i = 0; i < 30; ++i) assert(instance.exports.w0(0, 0) === 0);
}
