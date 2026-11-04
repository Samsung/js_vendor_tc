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

// An abrupt optional delete must not commit a surrounding assignment.
(function () {
    function named(obj) {
        "use strict";
        let result = 7;
        try { result = delete obj?.x; } catch (error) {
            assert(error instanceof TypeError);
        }
        return result;
    }
    assert(named(Object.freeze({ x: 1 })) === 7);
    assert(named(new Proxy({}, {
        deleteProperty() { throw new TypeError("delete trap"); }
    })) === 7);
    assert(named(null) === true);
    assert(named(undefined) === true);
    const obj = { x: 1 };
    assert(named(obj) === true);
    assert(!("x" in obj));

    const sentinel = {};
    let keys = 0;
    function key() { ++keys; throw sentinel; }
    function computed(obj) {
        let result = 7;
        try { result = delete obj?.[key()]; } catch (error) {
            assert(error === sentinel);
        }
        return result;
    }
    assert(computed(null) === true);
    assert(keys === 0);
    assert(computed({}) === 7);
    assert(keys === 1);

    function base() { throw sentinel; }
    function throwingBase() {
        let result = 7;
        try { result = delete base()?.x; } catch (error) {
            assert(error === sentinel);
        }
        return result;
    }
    assert(throwingBase() === 7);

    function chained(obj) {
        let result = 7;
        try { result = delete obj?.x.y; } catch (error) {
            assert(error instanceof TypeError);
        }
        return result;
    }
    assert(chained(null) === true);
    assert(chained({ x: null }) === 7);
    const child = { y: 1 };
    assert(chained({ x: child }) === true);
    assert(!("y" in child));
    assert(delete Object.freeze({ x: 1 })?.x === false);
    assertThrows(() => delete (null?.x).y, TypeError);
})();
