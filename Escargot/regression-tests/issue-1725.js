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

// https://github.com/Samsung/escargot/issues/1725
// br out of a block or try_table after its parameter was dropped gives wrong results and a VM-stack overrun
if (typeof WebAssembly !== "undefined") {
    new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 11, 2, 96, 0, 0, 96, 1, 127, 3, 127, 127, 127, 3, 2, 1, 0, 10, 21, 1, 19, 0, 65, 0, 2, 1, 26, 65, 0, 65, 0, 65, 0, 12, 0, 11, 26, 26, 26, 11]));
    var f = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 14, 2, 96, 0, 3, 127, 127, 127, 96, 1, 127, 3, 127, 127, 127, 3, 2, 1, 0, 7, 5, 1, 1, 102, 0, 0, 10, 19, 1, 17, 0, 65, 228, 0, 2, 1, 26, 65, 1, 65, 2, 65, 3, 12, 0, 11, 11]))).exports.f;
    for (var i = 0; i < 20; ++i) assert(JSON.stringify(f()) === "[1,2,3]");
}
