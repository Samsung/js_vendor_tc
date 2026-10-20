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

// https://github.com/Samsung/escargot/issues/1719
// new WebAssembly.Module crashes in generateMoveValuesCodeRegardToDrop on br_if to a loop with a v128 parameter
if (typeof WebAssembly !== "undefined") {
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 10, 2, 96, 2, 123, 127, 0, 96, 1, 123, 0, 3, 2, 1, 0, 10, 19, 1, 17, 0, 32, 0, 3, 1, 26, 65, 1, 32, 0, 32, 1, 13, 0, 0, 11, 11]);
    assert(WebAssembly.validate(bytes));
    assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
}
