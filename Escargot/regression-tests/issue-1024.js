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

function abc() {
  let obj = {};

  for (let n = 0; n < 1; n += 1) {
    if (n === 0)  {
        continue;
    }
    () => asdf(n);
  }
  () => obj.asdf();
}

abc();


function abc2() {
  let obj = {};

  for (let n = 0; n < 1; n += 1) {
    if (n === 0)  {
        print(n)
        break;
    }
    () => asdf(n);
  }
  () => obj.asdf();
}

abc2();
