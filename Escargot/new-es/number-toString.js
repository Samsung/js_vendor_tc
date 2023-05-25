/* Copyright 2023-present Samsung Electronics Co., Ltd. and other contributors
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

function hex() {
  assert(Math.abs(233).toString(16) === 'e9');
  assert(Math.abs('11').toString(16) === 'b');

  const h = "CAFEBABE";
  assert(parseInt(h, 16).toString(2) === "11001010111111101011101010111110");
}

const a = 10;
assert(a.toString() === '10');

assert((17).toString() === '17');
assert(Number(17).toString() === '17');
assert((17.23).toString() === '17.23');

const b = 6;
assert(b.toString(2) === "110");
assert((254).toString(16) === "fe");
assert((-10).toString(2) === "-1010");
assert((-0xff).toString(2) === "-11111111");
