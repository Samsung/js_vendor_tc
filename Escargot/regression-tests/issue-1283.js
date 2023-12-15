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

assertSyntaxError("! this && ++ this;");
assertSyntaxError("! this && ++ this;");
assertSyntaxError("this && ++ ! this;");

assertSyntaxError("+ this && -- delete this;");
assertSyntaxError("- this && { } --;");
assertSyntaxError("delete this || -- typeof this;");
assertSyntaxError("this || ! ++ ~ this;");
assertSyntaxError("void this && -- void this;");
assertSyntaxError("~ this || { } ++;");
