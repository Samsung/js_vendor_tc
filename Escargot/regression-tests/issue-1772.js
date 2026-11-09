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

// Samsung/escargot#1772: labelled for-of continue.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    var closed = [];
    function iter(name) {
        let i = 0;
        return {
            [Symbol.iterator]() { return this; },
            next() { return i < 2 ? { value: i++, done: false } : { done: true }; },
            return() { closed.push(name); return {}; }
        };
    }
    outer: for (const x of iter('outer')) {
        for (const y of iter('inner')) { continue outer; }
    }
    same(closed.join(), 'inner,inner');
    closed = [];
    outer2: for (const x of iter('outer')) {
        for (const y of iter('inner')) { break outer2; }
    }
    same(closed.join(), 'inner,outer');
    closed = [];
    outer3: for (const x of iter('outer')) {
        try { for (const y of iter('inner')) { continue outer3; } } finally {}
    }
    same(closed.join(), 'inner,inner');
    closed = [];
    var it = iter('throwing');
    it.next = function () { throw 42; };
    try { for (const x of it) {} } catch (e) { same(e, 42); }
    same(closed.join(), '');
})();
