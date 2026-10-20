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

// https://github.com/Samsung/escargot/issues/1721
// JIT does not trap on an unaligned atomic access that the interpreter traps on
if (typeof WebAssembly !== "undefined") {
    if (typeof SharedArrayBuffer !== "undefined") {
        var f = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 5, 1, 1, 102, 0, 0, 10, 13, 1, 11, 0, 65, 1, 32, 0, 69, 254, 0, 2, 0, 11]))).exports.f;
        for (var i = 0; i < 20; ++i) {
            assertThrows(() => f(0), WebAssembly.RuntimeError);
            assertThrows(() => f(1), WebAssembly.RuntimeError);
        }
    }
}
