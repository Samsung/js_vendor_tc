/* Copyright 2024-present Samsung Electronics Co., Ltd. and other contributors
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

function test1(obj) {
    obj.prop1 = undefined;
}

function test2(obj) {
    obj.prop2 = new Object();
}

var x = {}; 
var y = { p: 0 };
var z = { p: 0,
    set prop1(name) {
        throw new Error();
    }   
};

test1(x);
test1(x);
test1(x);
test1(x); // create a cache data for `prop1` property set
test1(y); // create another cache data

try { test1(z); } catch(e) { /* do nothing */ } // fail to create another cache data
try { test1(z); } catch(e) { /* do nothing */ } // fail to create another cache data

assert(y.p == 0); // 0
assert(z.p == 0); // 0

test2(x);
test2(x);
test2(x);
test2(x); // create a cache data for `prop2` property set
test2(y); // create another cache data

Object.defineProperty(Array.__proto__, "prop2", {
  set: function (x) {
    throw new Error();
  },  
});

try { test2(Array); } catch(e) { /* do nothing */ } // create another cache data

test2(y);
assert(y.p == 0); // 0
assert(z.p == 0); // 0
