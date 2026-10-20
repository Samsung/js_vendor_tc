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

// https://github.com/Samsung/escargot/issues/1727
// WebAssembly.Module.imports and new WebAssembly.Instance abort on a module that imports a tag
if (typeof WebAssembly !== "undefined") {
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 2, 8, 1, 1, 109, 1, 116, 4, 0, 0]);
    assert(WebAssembly.validate(bytes));
    var module = new WebAssembly.Module(bytes);
    var imports = WebAssembly.Module.imports(module);
    assert(imports.length === 1);
    assert(imports[0].module === "m" && imports[0].name === "t" && imports[0].kind === "tag");
    assertThrows(() => new WebAssembly.Instance(module, { m: { t: {} } }), WebAssembly.LinkError);
    assertThrows(() => new WebAssembly.Instance(module), TypeError);
    var tag = new WebAssembly.Tag({ parameters: [] });
    assert(new WebAssembly.Instance(module, { m: { t: tag } }) instanceof WebAssembly.Instance);
}
