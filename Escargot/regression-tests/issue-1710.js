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

// https://github.com/Samsung/escargot/issues/1710
// ToWalrusValue crashes on externref/funcref call arguments and new WebAssembly.Global({value:"externref"})
if (typeof WebAssembly !== "undefined") {
    var module = new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 1, 111, 0, 3, 2, 1, 0, 7, 5, 1, 1, 102, 0, 0, 10, 4, 1, 2, 0, 11]));
    var f = new WebAssembly.Instance(module).exports.f;
    [null, undefined, 0, 1, true, "extern", {}, function () {}].forEach(value => f(value));
    var object = { marker: 42 };
    var global = new WebAssembly.Global({ value: "externref", mutable: true }, object);
    gc();
    assert(global.value === object);
    global.value = "updated";
    assert(global.value === "updated");
    assert(new WebAssembly.Global({ value: "externref" }).value === undefined);
    assert(new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 111, 3, 2, 1, 0, 7, 5, 1, 1, 102, 0, 0, 10, 6, 1, 4, 0, 208, 111, 11]))).exports.f() === null);
    var funcrefBytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 1, 111, 0, 3, 2, 1, 0, 7, 5, 1, 1, 102, 0, 0, 10, 4, 1, 2, 0, 11]);
    funcrefBytes[13] = 0x70;
    new WebAssembly.Instance(new WebAssembly.Module(funcrefBytes)).exports.f(null);
}
