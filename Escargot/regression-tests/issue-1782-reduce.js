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
"use strict";
function check(condition, message) { if (!condition) throw new Error(message); }
function throwsTypeError(fn) {
    try { fn(); } catch (e) { check(e instanceof TypeError, "wrong error"); return; }
    throw new Error("expected TypeError");
}
var called = false;
function callback(a, b) { called = true; return [a, b]; }
check([].reduce(callback, undefined) === undefined, "empty array initial undefined");
check(!called, "callback on empty array");
check(Array.prototype.reduce.call({length: 0}, callback, undefined) === undefined, "empty array-like");
check([, ,].reduce(callback, undefined) === undefined, "sparse array initial undefined");
check(!called, "callback on holes");
throwsTypeError(function () { [].reduce(callback); });
throwsTypeError(function () { [, ,].reduce(callback); });
throwsTypeError(function () { [].reduce(null, undefined); });
var result = [7].reduce(callback, undefined);
check(called && result[0] === undefined && result[1] === 7, "explicit undefined accumulator");
check([].reduceRight(callback, undefined) === undefined, "reduceRight consistency");
print("PASS");
