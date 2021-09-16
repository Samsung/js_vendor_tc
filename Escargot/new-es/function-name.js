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

function f1() {
    return function name() {
        const c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }();
}
var r1 = f1();

function f2() {
    let r = function name() {
        var c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }();
    return r;
}
var r2 = f2();

function f3() {
    function name() {
        const c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }
    return name();
}
var r3 = f3();

function f4() {
    function name() {
        var c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }
    return name();
}
var r4 = f4();

let r5 = (function f5() {
    return function name() {
        const c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }();
})();

const r6 = (function f6() {
    function name() {
        const c = 1;
        return (function() {
            name.r = c;
            return name;
        });
    }
    return name();
})();

{
    var r7 = (function f7() {
        return function name() {
            const c = 1;
            return (function() {
                name.r = c;
                return name;
            });
        }();
    })();
}

{
    var r8 = (function f8() {
        function name() {
            const c = 1;
            return (function() {
                name.r = c;
                return name;
            });
        }
        return name();
    })();
}

assert(r1().r == 1);
assert(r2().r == 1);
assert(r3().r == 1);
assert(r4().r == 1);
assert(r5().r == 1);
assert(r6().r == 1);
assert(r7().r == 1);
assert(r8().r == 1);
