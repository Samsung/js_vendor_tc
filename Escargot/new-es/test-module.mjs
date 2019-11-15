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

import { test } from "./module.mjs"
import { lettest } from "./module.mjs"
import { vartest } from "./module.mjs"
import * as ns from "./module.mjs"
import * as ns2 from "./module.mjs"
import {lettest as astest} from "./module.mjs"
import v from "./module.mjs"

assert(v=="class foo { consturctor () {} }")
assert(astest=="lettest1")
assert(typeof ns=="object")
assert(ns.lettest=="lettest1")
assert(ns.__proto__==undefined)
assert(Object.prototype.hasOwnProperty.apply(ns, [Symbol.toStringTag]))
assert(ns[Symbol.toStringTag]=="Module")
assert(ns.default=="class foo { consturctor () {} }")
assert(typeof cannotshownonothermodules=="undefined")
assert(typeof cannot2=="undefined")
assert(typeof test=="function")
assert(lettest=="lettest1")
assert(vartest=="vt")
assert(test()==undefined)


import {module2let} from "./module.mjs"
assert(module2let=="module2letvalue")

import {module1let} from "./module.mjs"
assert(module1let=="module1let")
