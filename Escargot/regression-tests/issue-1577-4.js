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

// Issue #1577 Crash #4: String.prototype.lastIndexOf used to read out of bounds
// (Assertion `idx < length' failed) when the search string is shorter than the
// receiver and the search starts at the end of the string.
assert(("se\tBigUint64").lastIndexOf(4096) === -1);
assert("xxx".lastIndexOf(4096) === -1);
assert("abc".lastIndexOf("c") === 2);
assert("abcabc".lastIndexOf("bc") === 4);

print("issue-1577-4 passed");
