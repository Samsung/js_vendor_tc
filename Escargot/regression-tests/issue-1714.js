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

// https://github.com/Samsung/escargot/issues/1714
// WebAssembly.validate aborts on custom sections named linking or dylink.0
if (typeof WebAssembly !== "undefined") {
    [new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 0, 9, 7, 108, 105, 110, 107, 105, 110, 103, 2]), new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 0, 9, 8, 100, 121, 108, 105, 110, 107, 46, 48]), new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 0, 5, 3, 102, 111, 111, 2])].forEach(function (bytes) {
        assert(WebAssembly.validate(bytes));
        assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
    });
}
