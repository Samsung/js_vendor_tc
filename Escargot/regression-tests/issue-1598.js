/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
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

// POC TC for Issue #1598
// RegExp Compile-Cache Key Omits Flags Affecting Compilation
// Bug: Cache key only considered MultiLine and IgnoreCase flags,
//      ignoring DotAll, Unicode, UnicodeSets, Sticky, HasIndices, Global

// Test 1: DotAll flag cache collision
const source = ".";
// 1. Compile WITHOUT dotAll ('s'). Populates the cache.
const reLegacy = new RegExp(source, "g");
const match1 = reLegacy.exec("\n");

// 2. Compile WITH dotAll ('s').
// BUG: Escargot sees "." and "g" in the cache key and returns reLegacy's pattern.
const reDotAll = new RegExp(source, "gs");
const match2 = reDotAll.exec("\n");

assert(match1 === null);
assert(match2 !== null);
assert(match2[0] === "\n");

// Test 2: Unicode flag cache collision
// Test with Unicode property escapes
const reUnicode = new RegExp("\\p{L}", "u");
const reNoUnicode = new RegExp("\\p{L}", "");

const testChar = "あ"; // Japanese character
const match3 = reUnicode.exec(testChar);
const match4 = reNoUnicode.exec(testChar);

assert(match3 !== null);
assert(match3[0] === "あ");

// Test 3: Original issue test case
for (let v0 = 0; v0 < 5; v0++) {
    /[\p{Script_Extensions=Mongolian}&&\p{Number}]/dig[Symbol.replace]();
}
