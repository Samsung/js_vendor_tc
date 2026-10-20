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

// https://github.com/Samsung/escargot/issues/1712
// new WebAssembly.Instance aborts on a module exporting an exception-handling tag
if (typeof WebAssembly !== "undefined") {
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 13, 3, 1, 0, 0, 7, 5, 1, 1, 116, 4, 0]);
    assert(WebAssembly.validate(bytes));
    var module = new WebAssembly.Module(bytes);
    var exports = WebAssembly.Module.exports(module);
    assert(exports.length === 1 && exports[0].name === "t" && exports[0].kind === "tag");
    assert(new WebAssembly.Instance(module).exports.t instanceof WebAssembly.Tag);
}
