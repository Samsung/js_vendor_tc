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

// Samsung/escargot#1811
(function () {
    const log = [];
    function target(a, b) { return this.value + a + b; }
    const proto = {};
    const proxy = new Proxy(target, {
        getPrototypeOf() { log.push("prototype"); return proto; },
        getOwnPropertyDescriptor(t, key) {
            log.push("own " + key);
            return Reflect.getOwnPropertyDescriptor(t, key);
        },
        get(t, key, receiver) {
            log.push("get " + key);
            return Reflect.get(t, key, receiver);
        }
    });
    const bound = Function.prototype.bind.call(proxy, { value: 2 }, 3);
    assert(log.join(",") === "prototype,own length,get length,get name");
    assert(Object.getPrototypeOf(bound) === proto);
    assert(bound.length === 1 && bound.name === "bound target" && bound(4) === 9);

    const throwing = new Proxy(target, {
        getPrototypeOf() { throw new RangeError(); },
        getOwnPropertyDescriptor() { assertNotReached(); }
    });
    assertThrows(() => Function.prototype.bind.call(throwing), RangeError);
})();
