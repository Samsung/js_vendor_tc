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
for (var s of ["infinity", "-infinity", "+infinity", "INFINITY", "inf", ".", "+", "-", "", " ", "NaN", "\u0661"]) {
    check(Number.isNaN(parseFloat(s)), "expected NaN: " + s);
}
for (var s of ["Infinity", "+Infinity", "Infinity trailing", "1e400x", "1" + "0".repeat(400)]) {
    check(parseFloat(s) === Infinity, "expected positive infinity: " + s);
}
for (var s of ["-Infinity", "-Infinity!", "-1e400x", "-" + "1" + "0".repeat(400)]) {
    check(parseFloat(s) === -Infinity, "expected negative infinity: " + s);
}
check(parseFloat("  \u00a0-12.5e+2junk") === -1250, "whitespace and exponent");
check(parseFloat("1e+") === 1, "incomplete exponent");
check(parseFloat(".5suffix") === 0.5, "leading decimal point");
check(parseFloat("0x12") === 0, "hex prefix");
check(Object.is(parseFloat("-0x12"), -0), "signed hex prefix");
check(Object.is(parseFloat("-0.000e999"), -0), "negative zero");
check(Object.is(parseFloat("-1e-999"), -0), "negative underflow");
check(parseFloat("2.2250738585072014e-308x") === 2.2250738585072014e-308, "minimum normal");
check(parseFloat("4.9406564584124654e-324x") === 5e-324, "minimum subnormal");
check(parseFloat("12\u000034") === 12, "embedded NUL");
check(parseFloat("1\u00e9") === 1, "non-ASCII trailing character");
check(Number.parseFloat === parseFloat, "Number.parseFloat identity");
print("PASS");
