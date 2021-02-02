/* Copyright JS Foundation and other contributors, http://js.foundation
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

var wr;

function alloc()
{
  for (var i = 0; i < 1000; i ++) {
    let target = {}
    let target2 = []
    let target3 = {}
    let target4 = []
    let target5 = {}
    let target6 = []
    let target7 = {}
    let target8 = []
  }

  gc()
  gc()
  gc()
  gc()
  gc()
  gc()
}


function test1() {
  var target = {};
  wr = new WeakRef(target);
  target = null;
}

test1();
alloc();
gc()
gc()
gc()
gc()
assert(wr.deref() === undefined)

 
function test2() {
  var target = {};
  wr = new WeakRef(target);
  wr = null;
  alloc()
  print("NOCRASH")
  target = null
  alloc()
}

test2();

function test3() {
  var target = {};
  wr = new WeakRef(target);
  wr = null;
  target = null
  alloc()
  print("NOCRASH")
}

test3();

