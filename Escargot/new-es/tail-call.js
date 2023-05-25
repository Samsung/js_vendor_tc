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

function tailCall(n) {
  if (n == 0) {
    return 0;
  }
  return tailCall(n - 1);
}

function nestedTailCall(n) {
  if (n < 10) {
    return tailCall(n - 1);
  }
  return nestedTailCall(n - 2);
}

function func1(arg) {
  tailCall(arg);
  return arg;
}

function func2() {
  var local = 100;
  tailCall(local);
  return local;
}

function func3() {
  let local = 100;
  {
    const local = 1;
  }
  tailCall(local);
  return local;
}

function func4() {
  let local = 1;
  {
    const local = 100;
    tailCall(local);
    return local;
  }
}

function func5(arg) {
  nestedTailCall(arg);
  return arg;
}

function func6() {
  var local = 100;
  nestedTailCall(local);
  return local;
}

function func7() {
  let local = 100;
  {
    const local = 1;
  }
  nestedTailCall(local);
  return local;
}

function func8() {
  let local = 1;
  {
    const local = 100;
    nestedTailCall(local);
    return local;
  }
}

assert(func1(100) === 100);
assert(func2() === 100);
assert(func3() === 100);
assert(func4() === 100);

assert(func5(100) === 100);
assert(func6() === 100);
assert(func7() === 100);
assert(func8() === 100);

assert(isFunctionAllocatedOnStack(func1));
assert(isFunctionAllocatedOnStack(func2));
assert(isFunctionAllocatedOnStack(func3));
assert(isFunctionAllocatedOnStack(func4));

assert(isFunctionAllocatedOnStack(func5));
assert(isFunctionAllocatedOnStack(func6));
assert(isFunctionAllocatedOnStack(func7));
assert(isFunctionAllocatedOnStack(func8));
