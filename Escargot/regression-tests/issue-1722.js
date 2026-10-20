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

// https://github.com/Samsung/escargot/issues/1722
// try with block parameters: catch arm results land at the wrong stack slots
if (typeof WebAssembly !== "undefined") {
    new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 12, 2, 96, 1, 127, 2, 123, 127, 96, 1, 127, 1, 127, 3, 2, 1, 1, 10, 33, 1, 31, 0, 32, 0, 6, 0, 26, 0, 25, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 11, 15, 11]));
    var f = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 10, 2, 96, 1, 126, 2, 127, 127, 96, 0, 0, 3, 2, 1, 0, 13, 3, 1, 0, 1, 7, 5, 1, 1, 102, 0, 0, 10, 17, 1, 15, 0, 32, 0, 6, 0, 26, 8, 0, 25, 65, 7, 65, 9, 11, 11]))).exports.f;
    for (var i = 0; i < 20; ++i) assert(JSON.stringify(f(0n)) === "[7,9]");
}
