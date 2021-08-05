/* Copyright 2021-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function t0(x, y = 1) {}
function t1(x = 1, y = 0) {}
function t2(x, {a:a}) {}
function t3(x, {a:a} = {}) {}
function t4(x, [a]) {}
function t5(x, [a] = [1]) {}
function t6([a],...x) {}

assert(t0.length == 1)
assert(t1.length == 0)
assert(t2.length == 2)
assert(t3.length == 1)
assert(t4.length == 2)
assert(t5.length == 1)
assert(t6.length == 1)
