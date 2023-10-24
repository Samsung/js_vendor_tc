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

var tctc21 = 0;
var tctc22 = 0;
var tctc23 = 0;
var tctc24 = 0;
var tctc25 = 0;
var tctc26 = 0;
var tctc27 = 0;
var tctc28 = 0;
var tctc29 = 0;

function _fno(a) {
    let number = true;
    let string = true;
    for (let i = 0; i < a.length; i++) {
        if (number && typeof a[i] != "number") {
            number = false
        }
        if (string && typeof a[i] != "string") {
            string = false
        }
        if (tctc26 <= 1e3 && typeof a != "undefined") {
            __fn("", a)
        }
    }
    if (number) return "number";
    else if (string) return "string";
    else return "any"
}

function _ttt(t1, t2) {
    return JSON.stringify(t1) === JSON.stringify(t2)
}

function _tttdd(a, step) {
    var t;
    var type = Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
    if (type == "array") {
        t = {
            type: type,
            asdf: {
                asdf: _fno(a)
            }
        }
    } else if (type == "object") {
        let shape = [];
        if (step === undefined || step > 0) {
            let keys = Object.keys(a);
            let length = Math.min(100, keys.length);
        }
        t = {
            type: type,
            asdf: {
                asdf: shape
            }
        }
    } else {
        t = {
            type: type
        }
    }
    return t
}

function __fn(loc, a) {
    var t = _tttdd(a);
    ":" + JSON.stringify(t)
}
let arr = [1.1, 2.2, 3.3, 4.4, 5.5];
try {
    if (tctc25 <= 1e3 && typeof Array.isArray != "undefined") {
        __fn("", Array.isArray);
        tctc25++
    }
} catch (e) {}
try {
    if (tctc26 <= 1e3 && typeof Array != "undefined") {
        __fn("", Array);
        tctc26++
    }
} catch ({
    e = eval("dd")
}) {}
try {
    if (tctc27 <= 1e3 && typeof arr != "undefined") {
        __fn("", arr);
        tctc27++
    }
} catch (e) {}
try {
    if (tctc28 <= 1e3 && typeof arr.length != "undefined") {
        class b {
            [await 1]() {}
        }
        tctc28++
    }
} catch (e) {}


// PASS if there is no crash
