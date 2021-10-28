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

var func;

func = new Function('a = 1', 'b = 2', 'c = 3', 'return a+b+c;');
assert(func() == 6);
assert(func(0) == 5);
assert(func(0, 0) == 3);
assert(func(0, 0, 0) == 0);
assert(func(0, 0, 0, 0) == 0);

var local = 0;
func = new Function('a = (5, local = 6)',
                    'b = ((5 + function(a = 6) { return a; }() * 3))',
                    'c = true ? 1 : 2',
                    'return a+b+c;');
assert(func() == 30);
assert(local == 6);

func = new Function('a = [10,,20]',
                    'b',
                    'c = Math.cos(0)',
                    'd',
                    'return "" + a + ", " + b + ", " + c + ", " + d;');
assert(func() == "10,,20, undefined, 1, undefined");

func = new Function('a', 'b = (local = 7)', '');
local = 0;
func();
assert(local == 7);
local = 0;
func(0, undefined);
assert(local == 7);
local = 0;
func(0, null);
assert(local == 0);
local = 0;
func(0, false);
assert(local == 0);

func = new Function("var a = '}'; return 1;");
assert(func() == 1);

func = new Function('{a = 2}', 'return a;');
assert(func(new Object()) == 2);
assert(func({a : 0}) == 0);

assertThrows("Function('a += 5', '')", SyntaxError);
assertThrows("Function('a =', 'b', '')", SyntaxError);
assertThrows("Function('a = (b', '')", SyntaxError);
assertThrows("Function('a', 'a = 5', '')", SyntaxError);
assertThrows("Function('a = 5', 'a', '')", SyntaxError);
