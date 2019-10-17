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

function test0() {
      (function ($ = function () { }) { });
}
test0();

function test1() {
    return (function ($ = function () { return 1; }) { return $(); })();
}
assert(test1() == 1);

function test2() {
    return (function ($ = () => 2) { return $(); })();
}
assert(test2() == 2);

var test3 = function () {
    return (function ($ = function ($$ = () => 3) { return $$(); }) { return $(); })();
}
assert(test3() == 3);

var test4 = function () {
    return (function ($ = ($$ = function() { return 4; }) => { return $$(); }) { return $(); })();
}
assert(test4() == 4);

var test5 = () => {
    return (function ($ = ($$ = function() { return 5; }) => { return $$(); }) { return $(); })();
}
assert(test5() == 5);
