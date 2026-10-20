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

// https://github.com/Samsung/escargot/issues/1732
// Deferred indexed reads must use the original, GC-rooted argument vector.
var completed1732 = 0;
var failures1732 = [];
async function noParameters1732() {
    await 0;
    assert(arguments.length === 8);
    assert(typeof arguments[2] === "number" && arguments[2] === 3);
    await 0;
    gc();
    assert(arguments[7].marker === 42);
    ++completed1732;
}
async function mapped1732(first) {
    first = 11;
    await 0;
    assert(arguments[0] === 11 && arguments[2] === 3);
    arguments[0] = 12;
    await 0;
    assert(first === 12);
    ++completed1732;
}
async function strict1732(first) {
    "use strict";
    first = 11;
    await 0;
    assert(arguments[0] === 1 && arguments[2] === 3);
    ++completed1732;
}
async function nested1732() {
    try { await 0; } finally {
        await 0;
        assert(arguments.length === 3 && arguments[2] === 3);
    }
    ++completed1732;
}
async function* generator1732() {
    await 0;
    yield arguments[2];
    await 0;
    assert(arguments.length === 3 && arguments[2] === 3);
    ++completed1732;
}
noParameters1732(1, 2, 3, 4, 5, 6, 7, { marker: 42 }).catch(e => failures1732.push(e));
mapped1732(1, 2, 3).catch(e => failures1732.push(e));
strict1732(1, 2, 3).catch(e => failures1732.push(e));
nested1732(1, 2, 3).catch(e => failures1732.push(e));
var iterator1732 = generator1732(1, 2, 3);
iterator1732.next().then(function (result) {
    assert(result.value === 3 && !result.done);
    return iterator1732.next();
}).then(function (result) { assert(result.done); }).catch(e => failures1732.push(e));
assert(drainJobQueue());
assert(failures1732.length === 0);
assert(completed1732 === 5);
