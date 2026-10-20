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

// https://github.com/Samsung/escargot/issues/1735
// All recursive Proxy target operations must check the native stack limit.
(function () {
    var target = { x: 1 };
    var shallow = new Proxy(target, {});
    assert(Object.getOwnPropertyDescriptor(shallow, "x").value === 1);
    assert(Reflect.defineProperty(shallow, "y", { value: 2, configurable: true }));
    assert(Reflect.deleteProperty(shallow, "y"));
    assert(Reflect.preventExtensions(shallow));
    assert(!Object.isExtensible(target));
    var revoked = Proxy.revocable({}, {});
    revoked.revoke();

    var proxy = {};
    for (var i = 0; i < 100000; ++i) proxy = new Proxy(proxy, {});
    var operations = [
        p => Object.getOwnPropertyDescriptor(p, "x"),
        p => Reflect.defineProperty(p, "x", { value: 1 }),
        p => Reflect.deleteProperty(p, "x"),
        p => Reflect.preventExtensions(p)
    ];
    for (var operation of operations) {
        assertThrows(() => operation(revoked.proxy), TypeError);
        assertThrows(() => operation(proxy), RangeError);
    }
    // A get trap also queries the target descriptor to validate its result.
    assertThrows(() => new Proxy(proxy, { get() { return 1; } }).x, RangeError);
})();
