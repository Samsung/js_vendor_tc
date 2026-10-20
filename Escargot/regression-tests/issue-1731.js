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

// https://github.com/Samsung/escargot/issues/1731
// Re-entering a store must not resurrect an inline cache discarded by the setter.
(function () {
    var o = {};
    Object.defineProperty(o, "a", { set: x => x(x) });
    for (var i = 0; i < 30; ++i) {
        function f(a) { a[9] = 1; a.a = f; }
        f(o);
        assert(o[9] === 1);
    }

    function store(o, value) { o.a = value; }
    var count = 0;
    var receiver = {};
    Object.defineProperty(receiver, "a", {
        configurable: true,
        set: function (value) {
            ++count;
            if (value > 0) store(receiver, value - 1);
        }
    });
    for (var i = 0; i < 20; ++i) store(receiver, 4);
    assert(count === 100);
})();
