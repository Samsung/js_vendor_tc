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

// https://github.com/Samsung/escargot/issues/1713
// WebAssembly.validate aborts on legacy exception-handling opcodes delegate and rethrow
if (typeof WebAssembly !== "undefined") {
    var cases = [new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 6, 64, 24, 0, 11]), new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 10, 1, 8, 0, 6, 64, 25, 9, 0, 11, 11])];

    cases.forEach(function (bytes) {
        var valid = WebAssembly.validate(bytes);
        assert(typeof valid === "boolean");
        if (valid) assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
        else assertThrows(() => new WebAssembly.Module(bytes), WebAssembly.CompileError);
    });
}
