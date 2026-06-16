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

// Issue #1577 Crash #3: spreading an iterator whose prototype was replaced by a
// Proxy, with a non-boolean `done`, used to abort with
// Assertion `spreadArray->isFastModeArray()' failed.
const v7 = {
    [Symbol.iterator]() {
        let c = 0;
        const v6 = {
            next() {
                if (c < 100) { c++; return { value: 1, done: false }; }
                return { done: 10 };
            }
        };
        Object.setPrototypeOf(v6, new Proxy(Object.getPrototypeOf(v6), {
            get(t, k, r) { return Reflect.get(t, k, r); }
        }));
        return v6;
    }
};
function f9() {}
f9(...v7); // must not crash

print("issue-1577-3 passed");
