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

// Samsung/escargot#1773: parameter and body var bindings.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    function f(a = () => b, b = 2) { var b = 3; return [a(), b]; }
    same(f().join(), '2,3');
    function g(a = () => b, b = 2) { var b; b++; return [a(), b]; }
    same(g().join(), '2,3');
    function h(a = () => b, b = 2) { function b() {} return [a(), typeof b]; }
    same(h().join(), '2,function');
    same(((a = () => b, b = 2) => { var b = 3; return [a(), b]; })().join(), '2,3');
    function repeated(a = () => b, b = 2) { var b; var b = 3; return [a(), b]; }
    same(repeated().join(), '2,3');
    function captured(a = () => b, b = 2) { var b = 3; return [a, () => b]; }
    same(captured().map(f => f()).join(), '2,3');
    function dynamic(a = () => b, b = 2) { var b = 3; return [a(), eval('b')]; }
    same(dynamic().join(), '2,3');
    function dynamicVar(a = () => b, b = 2) { eval('var b = 3'); return [a(), b]; }
    same(dynamicVar().join(), '2,3');
    function dynamicRedeclaration(a = () => b, b = 2) { var b = 3; eval('var b = 4'); return [a(), b]; }
    same(dynamicRedeclaration().join(), '2,4');
    function* generator(a = () => b, b = 2) { var b = 3; yield [a(), b]; }
    same(generator().next().value.join(), '2,3');
    same(({ method(a = () => b, b = 2) { var b = 3; return [a(), b]; } }).method().join(), '2,3');
    class C { method(a = () => b, b = 2) { var b = 3; return [a(), b]; } }
    same(new C().method().join(), '2,3');
    function nested(a = () => b, b = 2) { { var b = 3; } return [a(), b]; }
    same(nested().join(), '2,3');
    function argumentsParam(a = () => arguments, arguments = 2) { var arguments = 3; return [a(), arguments]; }
    same(argumentsParam().join(), '2,3');
    function plain(a) { var a = 3; return [a, arguments[0]]; }
    same(plain(2).join(), '3,3');
})();
