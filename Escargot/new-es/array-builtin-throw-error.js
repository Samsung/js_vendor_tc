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

value = '123';
try {
  actual = Array.prototype.reverse.call(value) + '';
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);

value = 'cba';
try {
  actual = Array.prototype.sort.call(value) + '';
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);

value = 'abc';
try {
  actual = Array.prototype.pop.call(value);
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);

value = 'def';
try {
  actual = Array.prototype.unshift.call(value, 'a', 'b', 'c');
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);

value = 'abc';
try {
  actual = Array.prototype.shift.call(value);
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);

value = 'abc';
try {
  actual = Array.prototype.splice.call(value, 1, 1) + '';
  throw "dummy error"
} catch (e) {
  actual = e;
}
assert(true === actual instanceof TypeError);


