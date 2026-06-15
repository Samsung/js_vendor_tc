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

// Issue #1571 Crash #8: For loop with class declaration and labeled continue
L1: for (let i = 0; i < 2; i++) {
    class Inner {
        constructor() {
            this.i = i;
        }
    }
    continue L1;
}
print("issue-1571-8 passed");
