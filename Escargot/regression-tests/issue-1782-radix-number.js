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
function check(condition, message) { if (!condition) throw new Error(message); }
function testLiteralAndString(prefix, digits) {
    var value = prefix + digits;
    var expected = Number(BigInt(value));
    check(Object.is(Number(value), expected), "string " + value);
    check(Object.is(Number(" \u00a0" + value + "\n"), expected), "trimmed " + value);
    check(Object.is(Function("return " + value)(), expected), "literal " + value);
    check(Object.is(Function("return -" + value)(), -expected), "negative literal " + value);
}

check(0o7100000000000000000000 === 65716525762590280000, "large octal literal");
check(Number("0o2000000000000000000000") === 18446744073709552000, "2^64 octal string");
check(Number("0b" + "1".repeat(70)) === 1.1805916207174113e21, "70-bit binary string");
for (var bits of [1, 52, 53, 54, 63, 64, 65, 70, 1023, 1024, 1025, 1200]) {
    for (var tail of ["0", "1", "01", "11"]) {
        var digits = "1" + "0".repeat(bits) + tail;
        testLiteralAndString("0b", digits);
    }
}
for (var count of [1, 17, 18, 20, 21, 22, 23, 30, 340, 342, 343, 400]) {
    for (var tail of ["0", "1", "3", "7"]) {
        testLiteralAndString("0o", "7" + "0".repeat(count) + tail);
    }
}
var overflowBoundary = 1n << 1024n;
var halfway = 1n << 970n;
for (var delta of [1n << 971n, halfway + 1n, halfway, halfway - 1n]) {
    var boundary = overflowBoundary - delta;
    testLiteralAndString("0b", boundary.toString(2));
    testLiteralAndString("0o", boundary.toString(8));
}
var seed = 123456789;
for (var n = 0; n < 64; n++) {
    var digits = "1";
    for (var i = 0; i < 65 + n * 3; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        digits += (seed >>> 31).toString();
    }
    testLiteralAndString("0b", digits);
}
check(Function("return 07100000000000000000000")() === Number(BigInt("0o7100000000000000000000")), "legacy octal literal");
check(0b1_0000000000000000_0000000000000000_0000000000000000_0000000000000000 === 18446744073709552000, "binary separators");
check(0o2_00000000000_0000000000 === 18446744073709552000, "octal separators");
check(0b1111111111111111111111111111111111111111111111111111111111111111111111n === (1n << 70n) - 1n, "binary BigInt");
check(0o2000000000000000000000n === 1n << 64n, "octal BigInt");
check(Number.isNaN(Number("0b10x")), "invalid binary digit");
check(Number.isNaN(Number("0o78")), "invalid octal digit");
check(Number.isNaN(Number("-0b10")), "signed binary string");
check(Number.isNaN(Number("0o1_2")), "separator in numeric string");
for (var radix of [2, 4, 8, 16, 32]) {
    var digits = "1" + "0".repeat(80) + "1";
    var exact = BigInt(radix) ** 81n + 1n;
    check(parseInt(digits, radix) === Number(exact), "parseInt power-of-two radix " + radix);
    check(parseInt("-" + digits + "!", radix) === -Number(exact), "signed parseInt radix " + radix);
}
check(parseInt("0x" + "f".repeat(40)) === Number(BigInt("0x" + "f".repeat(40))), "large parseInt hex prefix");
check(parseInt("v".repeat(30), 32) === Number(32n ** 30n - 1n), "large parseInt base 32");
print("PASS");
