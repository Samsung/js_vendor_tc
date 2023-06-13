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
function test(x_array)
{
    let j = 0;
    x_array[++j]++;
    return j;
}

function test2(x_array)
{
    let j = 0;
    x_array[j++]++;
    return j;
}


function test3(x_array)
{
    let j = 1;
    x_array[--j]--;
    return j;
}

function test4(x_array)
{
    let j = 0;
    x_array[j--]--;
    return j;
}

var arr = [1,2,3]
assert(test(arr)==1) // 1 
assert(arr+""=="1,3,3") // 1,3,3

assert(test2(arr)==1) // 1 
assert(arr+""=="2,3,3") // 2,3,3

assert(test3(arr)==0) // 0
assert(arr+""=="1,3,3") // 1,3,3

assert(test4(arr)==-1) // -1 
assert(arr+""=="0,3,3") // 0,3,3

