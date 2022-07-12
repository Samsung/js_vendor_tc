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

var res;

function test1() {
  var test1 = 1;
  throw new Error("error1");
}

function test2() {
  var test2 = 2;
  (function() {
    throw new Error("error2");
  })();
}

function test3() {
  (function () {
    var test3 = 3;
    throw new Error("error3");
  })();
}

function test4() {
  (function tt() {
    var tt = 4;
    throw new Error("error4");
  })();
}

function test5() {
  (function tt() {
    try {
      var tt = 5;
      throw new Error("error5");
    } catch (e) {
      throw e;
    }
  })();
}

(function() {
  try {
    test1();
  } catch (e) {
    res = e.stack;
  }
})();

(function() {
  try {
    test2();
  } catch (e) {
    res = e.stack;
  }
})();

(function() {
  try {
    test3();
  } catch (e) {
    res = e.stack;
  }
})();

(function() {
  try {
    test4();
  } catch (e) {
    res = e.stack;
  }
})();

(function() {
  try {
    test5();
  } catch (e) {
    res = e.stack;
  }
})();
