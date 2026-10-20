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

// https://github.com/Samsung/escargot/issues/1716
// new WebAssembly.Module crashes in VariableList::getMergeHead on nested multi-value loops with v128
if (typeof WebAssembly !== "undefined") {
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 38, 3, 96, 6, 127, 127, 127, 127, 127, 127, 5, 127, 127, 123, 123, 127, 96, 5, 127, 127, 127, 127, 127, 5, 127, 123, 127, 123, 127, 96, 4, 127, 127, 127, 127, 3, 127, 127, 127, 3, 2, 1, 2, 10, 124, 1, 122, 8, 10, 127, 1, 123, 1, 127, 1, 123, 1, 127, 1, 123, 10, 127, 2, 123, 65, 0, 32, 2, 32, 0, 32, 0, 32, 1, 32, 2, 3, 0, 33, 4, 33, 5, 33, 6, 33, 7, 33, 8, 32, 6, 32, 2, 32, 5, 32, 1, 3, 1, 33, 9, 33, 10, 33, 11, 33, 12, 33, 13, 32, 12, 32, 14, 32, 10, 32, 14, 32, 0, 11, 33, 15, 33, 16, 33, 17, 33, 18, 32, 4, 32, 7, 32, 19, 32, 5, 32, 20, 32, 21, 13, 0, 33, 22, 33, 23, 33, 24, 33, 25, 33, 26, 32, 23, 32, 16, 32, 18, 32, 27, 11, 33, 28, 33, 29, 33, 30, 32, 28, 11]);
    assert(WebAssembly.validate(bytes));
    assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
}
