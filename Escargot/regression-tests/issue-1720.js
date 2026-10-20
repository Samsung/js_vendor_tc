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

// https://github.com/Samsung/escargot/issues/1720
// new WebAssembly.Module segfaults in InstanceConstData with a branch-hinted br_if out of a try_table
if (typeof WebAssembly !== "undefined") {
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 68, 13, 96, 6, 125, 124, 126, 127, 124, 126, 1, 127, 96, 0, 1, 105, 96, 0, 1, 105, 96, 0, 0, 96, 0, 2, 123, 126, 96, 4, 124, 125, 123, 125, 4, 126, 125, 124, 126, 96, 0, 0, 96, 0, 0, 96, 1, 124, 4, 124, 126, 123, 125, 96, 0, 0, 96, 1, 127, 1, 127, 96, 0, 1, 127, 96, 0, 1, 127, 3, 3, 2, 0, 10, 5, 3, 1, 0, 1, 0, 32, 25, 109, 101, 116, 97, 100, 97, 116, 97, 46, 99, 111, 100, 101, 46, 98, 114, 97, 110, 99, 104, 95, 104, 105, 110, 116, 1, 0, 1, 104, 1, 0, 10, 213, 1, 2, 189, 1, 36, 2, 123, 2, 127, 1, 125, 1, 123, 1, 125, 1, 124, 2, 105, 1, 126, 1, 124, 1, 125, 2, 126, 1, 123, 1, 125, 1, 123, 1, 127, 1, 123, 2, 105, 2, 127, 1, 124, 1, 125, 1, 126, 1, 105, 1, 124, 1, 126, 1, 123, 3, 127, 1, 124, 1, 125, 1, 127, 1, 125, 1, 123, 1, 126, 1, 124, 1, 126, 1, 124, 1, 127, 2, 1, 2, 2, 2, 3, 31, 4, 3, 3, 1, 3, 2, 2, 0, 32, 1, 32, 0, 32, 7, 33, 11, 33, 12, 33, 13, 32, 14, 32, 9, 13, 3, 33, 15, 32, 5, 32, 0, 32, 4, 32, 5, 33, 16, 33, 17, 33, 18, 33, 19, 32, 7, 32, 19, 11, 33, 20, 33, 21, 11, 32, 6, 253, 31, 2, 33, 22, 32, 7, 33, 25, 208, 105, 11, 33, 27, 32, 6, 253, 22, 7, 33, 29, 32, 0, 187, 33, 30, 67, 0, 156, 54, 70, 174, 33, 32, 32, 27, 11, 32, 38, 32, 5, 66, 226, 157, 20, 254, 2, 3, 148, 78, 12, 0, 11, 20, 0, 65, 65, 4, 12, 65, 175, 214, 211, 190, 2, 5, 65, 177, 207, 217, 178, 1, 11, 11]);
    assert(WebAssembly.validate(bytes));
    assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
}
