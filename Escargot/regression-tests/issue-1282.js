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

function assertSyntaxError(code) {
    try {
        eval(code);
    } catch (e) {
        if (!(e instanceof SyntaxError)) {
            throw new Error("Expected exception has failed");
        }
        return;
    }
    throw new Error("Did not throw exception");
}

function assertTypeError(code) {
    try {
        eval(code);
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw new Error("Expected exception has failed");
        }
        return;
    }
    throw new Error("Did not throw exception");
}

v1 = 0;
v2 = 1;
v3 = 0n;

// member expression
assert(Number.isNaN(- 1 . v1));
assert(Number.isNaN(+ 1 . v1));
assert(Number.isNaN(- 2n . v1));
assert(Number.isNaN(+ 2n . v1));
assert((1 . v1) == undefined);
assert((2n . v1) == undefined);
assert(Number.isNaN(- v2 . v1));
assert(Number.isNaN(+ v2 . v1));

assertSyntaxError("- 1. v1;");
assertSyntaxError("+ 1. v1;");
assert(Number.isNaN(- 2n. v1));
assert(Number.isNaN(+ 2n. v1));
assertSyntaxError("1. v1");
assert((2n. v1) == undefined);
assert(Number.isNaN(- v2. v1));
assert(Number.isNaN(+ v2. v1));

// exponentiation expression
assertSyntaxError("- 1 ** v1;");
assertSyntaxError("+ 1 ** v1;");
assertSyntaxError("- 2n ** v3;");
assertSyntaxError("+ 2n ** v3;");
assert((1 ** v1) == 1);
assert((2n ** v3) == 1n);
assertSyntaxError("- v2 ** v1;");
assertSyntaxError("+ v2 ** v1;");

assert(((- 1) ** v1) == 1);
assert(((+ 1) ** v1) == 1);
assert(((- 2n) ** v3) == 1n);
assertTypeError("((+ 2n) ** v3);");
assert(((1) ** v1) == 1);
assert(((2n) ** v3) == 1n);
assert(((- v2) ** v1) == 1);
assert(((+ v2) ** v1) == 1);
