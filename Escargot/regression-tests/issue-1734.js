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

// https://github.com/Samsung/escargot/issues/1734
// A stack overflow while resolving a dequeued request must not reject it again.
(function () {
    function F() {
        try { new F(); } catch (error) {}
        async function* g() {}
        g().next();
    }
    new F();
    new F();
})();

// Queued requests must retain their own results across yields and completion.
var completed1734 = false;
var failures1734 = [];
async function* queued1734() {
    yield 1;
    yield 2;
    return 3;
}
var iterator1734 = queued1734();
Promise.all([
    iterator1734.next(), iterator1734.next(), iterator1734.next(),
    iterator1734.next(), iterator1734.throw(42).catch(e => e)
]).then(function (results) {
    assert(results[0].value === 1 && !results[0].done);
    assert(results[1].value === 2 && !results[1].done);
    assert(results[2].value === 3 && results[2].done);
    assert(results[3].value === undefined && results[3].done);
    assert(results[4] === 42);
    completed1734 = true;
}).catch(e => failures1734.push(e));
assert(drainJobQueue());
assert(failures1734.length === 0);
assert(completed1734);
