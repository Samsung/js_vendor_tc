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

var cannotshownonothermodules = "@@";
let lettest2 = "letTEst!!!"
var cannot2 = 1
export var vartest="vt";
export let lettest="lettest1";
export function test() {} 
export default class foo { consturctor () {} }
let module1let = "module1let"
export {module1let}
export * from './module2.mjs';
export {module2let} from './module2.mjs';
