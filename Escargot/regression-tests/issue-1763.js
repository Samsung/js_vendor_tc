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

// An optional chain that ends in a call in return position must evaluate to
// undefined when it short-circuits. With TCO the call was emitted as a tail
// call and the short-circuit jump ran past it without returning.

function callOptional(f) { return f?.(1); }
assert(callOptional(null) === undefined);
assert(callOptional(undefined) === undefined);
assert(callOptional(function (x) { return x + 1; }) === 2);

function callOptionalStrict(f) { "use strict"; return f?.(1); }
assert(callOptionalStrict(null) === undefined);
assert(callOptionalStrict(function (x) { return x + 1; }) === 2);

function callWithoutArguments(f) { return f?.(); }
assert(callWithoutArguments(null) === undefined);

function callMethodOfOptional(o) { return o?.m(1); }
assert(callMethodOfOptional(null) === undefined);
assert(callMethodOfOptional({ m: function (x) { return x + 2; } }) === 3);

function callOptionalMethod(o) { "use strict"; return o?.m?.(1); }
assert(callOptionalMethod(null) === undefined);
assert(callOptionalMethod({}) === undefined);
assert(callOptionalMethod({ m: function (x) { return x + 3; } }) === 4);

var arrow = (f) => f?.(1);
assert(arrow(null) === undefined);

var afterReturn = false;
function returnsBeforeNextStatement(f) {
    return f?.(1);
    afterReturn = true;
}
assert(returnsBeforeNextStatement(null) === undefined);
assert(afterReturn === false);

function returnsInIf(f) {
    if (!f)
        return f?.(1);
    return "after if";
}
assert(returnsInIf(null) === undefined);
assert(returnsInIf(undefined) === undefined);

function returnsInLoop(f) {
    "use strict";
    for (var i = 0; i < 3; i++) {
        if (i === 1)
            return f?.(i);
    }
    return "after loop";
}
assert(returnsInLoop(null) === undefined);
assert(returnsInLoop(function (x) { return x + 1; }) === 2);

function inConditional(c, f) { return c ? f?.(1) : 0; }
assert(inConditional(true, null) === undefined);

function inCatch(f) { try { throw 0; } catch (e) { return f?.(1); } }
assert(inCatch(null) === undefined);

function inFinally(f) { try { } finally { return f?.(1); } }
assert(inFinally(null) === undefined);
