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

if (typeof assert == "undefined")
  assert = print

var counter = 0;

function fetchItems() {
  return new Promise(function(resolve, reject) {
    var items = [1,2,3];
    assert(1 == counter++)
    resolve(items)
  });
}

function fetchItems2() {
  return new Promise(function(resolve, reject) {
    var items = [1,2,3];
    throw "error";
    assert(false)
  }).catch(function() {
    assert(4 == counter++)
  });
}

function fetchItems3() {
  return new Promise(function(resolve, reject) {
    var items = [1,2,3];
    reject(items)
  }).then(function() {
     assert(false)
  }, function() {
     assert(5 == counter++)
  });
}



async function logItems() {
  var resultItems = await fetchItems();
  assert(3 == counter++)
  assert(resultItems + "" == "1,2,3");

  var promiseResult = await fetchItems2();
  assert(typeof promiseResult == "undefined")

  promiseResult = await fetchItems3();
  assert(typeof promiseResult == "undefined")

  assert(6 == counter++)
}

assert(0 == counter++)
logItems();
assert(2 == counter++)


var compileTest = async test => {
    print("if there is no compile error, it's ok");
}

compileTest();
