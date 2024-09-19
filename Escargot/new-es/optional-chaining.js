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

var a = {
  b() { return this._b; },
  _b: { c: { d: 1} }
};

assert(a?.b?.().c?.d === 1);
assert(a?.b?.().c.d === 1);
assert(a?.b().c.d === 1);
assert(a.b().c.d === 1);

assert(a?.b?.().c?.e?.() === undefined);
assertThrows("a?.b?.().c?.e()", TypeError);
assertThrows("a?.b?.().c.e()", TypeError);
assertThrows("a?.b().c.e()", TypeError);
assertThrows("a.b().c.e()", TypeError);

function func() {
  let obj = {
    a: {
      b() { return this._b; },
     _b: { c: { d: function() { return 1; }} }
    }
  };
  return obj;
}

assert(func().a?.b?.().c?.d?.() === 1);
assert(func().a?.b?.().c?.d() === 1);
assert(func().a?.b?.().c.d() === 1);
assert(func().a?.b().c.d() === 1);
assert(func().a.b().c.d() === 1);

assert(func().a?.b?.().c?.d?.().e === undefined);
assertThrows("func().a?.b?.().c?.d?.().e()", TypeError);
assertThrows("func().a?.b?.().c?.d().e()", TypeError);
assertThrows("func().a?.b?.().c.d().e()", TypeError);
assertThrows("func().a?.b().c.d().e()", TypeError);
assertThrows("func().a.b().c.d().e()", TypeError);

function func2() {
  let obj = {
    delete: {
      new() { return this._b; },
     _b: { c: { return: function() { return 1; }} }
    }
  };
  return obj;
}

assert(func2().delete?.new?.().c?.return?.() === 1);
assert(func2().delete?.new?.().c?.return() === 1);
assert(func2().delete?.new?.().c.return() === 1);
assert(func2().delete?.new().c.return() === 1);
assert(func2().delete.new().c.return() === 1);

assert(func2().delete?.new?.().c?.return?.().e === undefined);
assertThrows("func2().delete?.new?.().c?.return?.().e()", TypeError);
assertThrows("func2().delete?.new?.().c?.return().e()", TypeError);
assertThrows("func2().delete?.new?.().c.return().e()", TypeError);
assertThrows("func2().delete?.new().c.return().e()", TypeError);
assertThrows("func2().delete.new().c.return().e()", TypeError);
