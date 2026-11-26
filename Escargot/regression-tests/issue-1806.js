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

// Samsung/escargot#1806
(function () {
    const result = Proxy.revocable({}, {});
    assert(Object.keys(result).join(",") === "proxy,revoke");

    const spread = { ...result };
    const assigned = Object.assign({}, result);
    for (const key of ["proxy", "revoke"]) {
        const descriptor = Object.getOwnPropertyDescriptor(result, key);
        assert(descriptor.writable && descriptor.enumerable && descriptor.configurable);
        assert(spread[key] === result[key]);
        assert(assigned[key] === result[key]);
    }
})();
