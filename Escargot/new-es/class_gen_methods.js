/* Copyright 2022-present Samsung Electronics Co., Ltd. and other contributors
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

var m1 = class { *m(x = 42) {} }.prototype.m;
assert(m1.length == 0);
var desc1 = Object.getOwnPropertyDescriptor(m1, "length");
assert(desc1.enumerable == false);
assert(desc1.writable == false);
assert(desc1.configurable == true);

var m2 = class { *m(x = 42, y) {} }.prototype.m;
assert(m2.length == 0);
var desc2 = Object.getOwnPropertyDescriptor(m2, "length");
assert(desc2.enumerable == false);
assert(desc2.writable == false);
assert(desc2.configurable == true);

var m3 = class { *m(x, y = 42) {} }.prototype.m;
assert(m3.length == 1);
var desc3 = Object.getOwnPropertyDescriptor(m3, "length");
assert(desc3.enumerable == false);
assert(desc3.writable == false);
assert(desc3.configurable == true);

var m4 = class { *m(x, y = 42, z) {} }.prototype.m;
assert(m4.length == 1);
var desc4 = Object.getOwnPropertyDescriptor(m4, "length");
assert(desc4.enumerable == false);
assert(desc4.writable == false);
assert(desc4.configurable == true);
