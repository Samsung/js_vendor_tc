/* Copyright 2019-present Samsung Electronics Co., Ltd. and other contributors
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

function ff() {
    var a = (k) => { return () => { return arguments[0] + 1;}};
    return a(1)();
}
assert(ff(1) == 2)

// arguments object with typeof operation
var args1 = () => { return typeof arguments; };
assert(args1() == "undefined"); // undefined

function args2() {
    var a = () => { return typeof arguments; };
    return a();
}
assert(args2() == "object"); // object

function args3() {
    var a = () => { return () => { return typeof arguments; }; };
    return a()();
}
assert(args3() == "object"); // object

function args4() {
    var a = () => { eval(""); return typeof arguments; };
    return a();
}
assert(args4() == "object"); // object

function args5() {
    var a = () => { eval(""); return () => { return typeof arguments; }; };
    return a()();
}
assert(args5() == "object"); // object
