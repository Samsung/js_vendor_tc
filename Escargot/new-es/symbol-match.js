/* Copyright 2019-present Samsung Electronics Co., Ltd. and other contributors
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

 var string1 = "foobar";
 var regex1 = /foo/;
 var regex2 = /bar/;
 var regex3 = /[a-z]/g;
 var regex4 = /[A_Z]/g;

 //General RegExp
 var result = string1.match(regex1);
 assert(result == "foo");
 result = string1.match(regex2);
 assert(result == "bar");
 result = string1.match(regex3)
 assert(result == "f,o,o,b,a,r")
 result = string1.match(regex4)
 assert(result == null)

 try {
   result = string1.startsWith(regex1);
 }
 catch (error) {
   assert(error == "TypeError: can't use RegExp with startsWith");
 }

 try {
   result = string1.endsWith(regex2);
 }
 catch (error) {
   assert(error == "TypeError: can't use RegExp with endsWith");
 }

 //With Symbol.match
 var string2 = "/foo/bar/"
 regex1[Symbol.match] = false;
 regex2[Symbol.match] = false;
 result = string2.startsWith(regex1);
 assert(result);
 result = string2.endsWith(regex2);
 assert(result);


var search = new String("to");
search[Symbol.match] = true;
var str = "tool";

try {
    str.startsWith(search);
}
    catch (error) {
    assert(error == "TypeError: can't use RegExp with startsWith");
}

