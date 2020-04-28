/* Copyright 2020-present Samsung Electronics Co., Ltd. and other contributors
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

try {
    globaltest.a = 1;
} catch(e) {
    print(e.stack)
    assert(e.stack.includes("globaltest."))
}

function test0() {
    try {
        test0try.fail = 1;
    } catch(e) {
        print(e.stack)
        assert(e.stack.includes("test0try."))
    }
}

test0();

function test1() {
  try {
      test1finally.abc = 1;
  } finally {
      
  }

}

try {
    try {
        test1()
    } catch(e) {
        print(e.stack)
        assert(e.stack.includes("test1finally."))
        test2catch.asdf;
    }
} catch (e) {
    print(e.stack)
    assert(e.stack.includes("test2catch."))
}

print("PASS")
