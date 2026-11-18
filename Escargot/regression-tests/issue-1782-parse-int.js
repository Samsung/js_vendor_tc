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
var inputs = [
    "123456789012345680000", "9007199254740991", "9007199254740992",
    "9007199254740993", "9007199254740995", "18446744073709551615",
    "100000000000000000001", "999999999999999999999999999999999999999999",
    "1" + "0".repeat(308), "1" + "0".repeat(400)
];
for (var s of inputs) {
    var expected = Number(BigInt(s));
    check(Object.is(parseInt(s), expected), "decimal: " + s);
    check(Object.is(parseInt("-" + s + "junk", 10), -expected), "signed prefix: " + s);
    check(Object.is(parseInt("0".repeat(32) + s, 10), expected), "leading zeroes: " + s);
}
check(Object.is(parseInt("-0000000", 10), -0), "negative zero");
check(parseInt("123.9", 10) === 123, "fraction stops integer prefix");
check(parseInt("12e4", 10) === 12, "exponent stops integer prefix");
check(parseInt("0x10") === 16, "hex prefix");
check(parseInt("111", 2) === 7, "binary radix");
check(Number.isNaN(parseInt("xyz", 10)), "no digits");
check(Number.parseInt === parseInt, "Number.parseInt identity");
print("PASS");
