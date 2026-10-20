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

// https://github.com/Samsung/escargot/issues/1718
// WebAssembly.validate aborts on i64.add128 and i64.sub128
if (typeof WebAssembly !== "undefined") {
    var cases = [new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 16, 1, 14, 0, 66, 0, 66, 0, 66, 0, 66, 0, 252, 19, 26, 26, 11])];
    var sub = cases[0].slice(); sub[32] = 0x14; cases.push(sub);
    cases.forEach(function (bytes) {
        var valid = WebAssembly.validate(bytes);
        assert(typeof valid === "boolean");
        if (valid) assert(new WebAssembly.Module(bytes) instanceof WebAssembly.Module);
        else assertThrows(() => new WebAssembly.Module(bytes), WebAssembly.CompileError);
    });
}
