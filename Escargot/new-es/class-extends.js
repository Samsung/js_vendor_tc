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

function test() {
    var a = 1, b = 2;

    class T extends class {
        constructor() {
            this.state = a+b;
            assert(a == 1);
            assert(b == 2);
        }   
    }   
    {   
        constructor() {
            super();
        }   

        func() {
            return T.a;
        }   
    }   

    T.a = 1;
    return T;
}

var cons = test();
new cons();

function anonymous () {
    function func() {
        return 0;
    }

    function Infinity() {
        return -1;
    }

    class Foo {
        constructor(name) {
            this.name = name;
        }

        func() {
            return 1;
        }

        Infinity() {
            return -2;
        }
    }

    class FooBar extends Foo {
        constructor(name, index) {
            super(name);
            this.index = index;
        }

        func() {
            return super.func();
        }

        Infinity() {
            return super.Infinity();
        }
    }

    const tt = new FooBar('t', 1);
    // same function name in the upper scope
    tt.func();
    tt.Infinity();
}

anonymous();
