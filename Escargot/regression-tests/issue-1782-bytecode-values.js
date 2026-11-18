/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

function equal(actual, expected, label) {
    if (actual !== expected)
        throw new Error(label + ": expected " + expected + ", got " + actual);
}

function testMember() {
    let object = { x: 1 }, original = object;
    object[(object = { z: 1 }, "w")] = 5;
    equal(JSON.stringify(original), '{"x":1,"w":5}', "computed base");
    equal(JSON.stringify(object), '{"z":1}', "reassigned base");

    let key = "before";
    let target = {};
    target[key] = (key = "after", 7);
    equal(target.before, 7, "computed key");
    equal(target.after, undefined, "changed key");

    let a = { n: 1 }, old = a;
    a[(a = { n: 9 }, "n")] += 2;
    equal(old.n, 3, "compound assignment base");
    equal(a.n, 9, "compound assignment new base");

    let p = { n: 2 }, previous = p;
    p[(p = { n: 8 }, "n")]++;
    equal(previous.n, 3, "update base");
    equal(p.n, 8, "update new base");

    let d = {}, first = d;
    [d[(d = {}, "v")]] = [4];
    equal(first.v, 4, "destructuring base");
    equal(d.v, undefined, "destructuring new base");
}

function testArray() {
    let x = 5;
    let arr = [x, x = 3];
    equal(arr.join(), "5,3", "declaration");

    x = 5;
    x = [x, x = 3][0];
    equal(x, 5, "assignment");

    x = 5;
    arr = [x, x += 2, x = 1];
    equal(arr.join(), "5,7,1", "multiple writes");

    x = 5;
    arr = [x += 2, x = 1];
    equal(arr.join(), "7,1", "compound result");

    x = 5;
    arr = [x, x++];
    equal(arr.join(), "5,5", "postfix update");

    x = 5;
    arr = [x, , x = 3];
    equal(arr.join(), "5,,3", "array hole");
    equal(1 in arr, false, "hole preserved");

    x = 5;
    arr = [x, ...(x = 3, [9]), x];
    equal(arr.join(), "5,9,3", "spread");

    x = 5;
    arr = [x, 1, 2, 3, 4, 5, 6, 7, 8, 9, x = 3];
    equal(arr[0], 5, "batch boundary first");
    equal(arr[10], 3, "batch boundary last");
}

function* yieldArray() {
    let x = 5;
    return [x, yield (x = 3)];
}

let generator = yieldArray();
equal(generator.next().value, 3, "yield value");
equal(generator.next(7).value.join(), "5,7", "yield side effect");

testMember();
testArray();
print("PASS");
