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

var wr;
var token;

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

  gc();
  gc();
  gc();
  gc();
  gc();
  gc();
}

var called = false;
function test1() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
      called = true;
  });
  wr.register(target, "diediedie");
  target = null;
}

// Retire the interpreter frame that creates each target before collecting.
// Otherwise conservative stack scanning (especially under ASAN) can retain
// temporary target pointers in the still-running test script's native frame.
eval("test1();");
alloc();
gc();
gc();
gc();
gc();
assert(called);

function test2() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
      called = true;
  });
  wr.register(target, "diediedie");
  wr = null;
  target = null;
}

eval("test2();");
alloc();
gc();
gc();
gc();
gc();
print("NOCRASH");

function test3() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
      called = true;
  });
  wr.register(target, "diediedie");
  wr = null;
}

eval("test3();");
alloc();
gc();
gc();
gc();
gc();
print("NOCRASH");

var callCount = 0;
function test4() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    callCount++;
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers");
  }
  target = null;
}

eval("test4();");
alloc();
gc();
gc();
gc();
gc();
assert(callCount == 1000);
print("NOCRASH");

function test5() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    assertNotReached();
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", target);
  }
  assert(wr.unregister(target));
  target = null;
}

eval("test5();");
alloc();
gc();
gc();
gc();
gc();
print("NOCRASH");

function test6() {
  var target = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    assertNotReached();
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", target);
  }
  assert(wr.unregister(target));
  target = null;
  wr = null;
}

eval("test6();");
alloc();
gc();
gc();
gc();
gc();
print("NOCRASH");

called = false;
function test7(depth) {
  if (depth) {
    test7(depth - 1);
    return;
  }

  var target = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", target);
  }
  target = null;
}

eval("test7(10);");
alloc();
gc();
gc();
gc();
gc();
assert(called);
print("NOCRASH");

called = false;
callCount = 0;
function test8() {
  var target = {};
  token = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    callCount++;
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", token);
  }
  target = null;
}

eval("test8();");
alloc();
gc();
gc();
gc();
gc();
assert(called);
assert(callCount == 1000);
assert(!wr.unregister(token));
print("NOCRASH");

called = false;
callCount = 0;
function test9() {
  var target = {};
  token = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    callCount++;
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", token);
  }
  target = null;
  token = null;
}

eval("test9();");
alloc();
gc();
gc();
gc();
gc();
assert(called);
assert(callCount == 1000);
print("NOCRASH");

function test10() {
  var target = {};
  token = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    callCount++;
  });
  for (var i = 0; i < 1000; i++) {
    wr.register(target, "too many registers", token);
  }
  wr = null;
  target = null;
  token = null;
}

eval("test10();");
alloc();
gc();
gc();
gc();
gc();
print("NOCRASH");

called = false;
callCount = 0;
function test11() {
  var target = {};
  token = {};
  wr = new FinalizationRegistry((value)=> {
    called = true;
    callCount++;
    alloc(); // trigger GC in finalizer
  });
  for (var i = 0; i < 100; i++) {
    wr.register(target, "too many registers", token);
  }
  target = null;
}

eval("test11();");
alloc();
gc();
gc();
gc();
gc();
assert(called);
assert(callCount == 100);
assert(!wr.unregister(token));
print("NOCRASH");
