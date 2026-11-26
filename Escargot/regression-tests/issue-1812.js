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

// Samsung/escargot#1812
(function () {
    const locales = ["en"];
    const options = {};
    for (const array of [new Uint8Array([1, 2]), new BigInt64Array([1n, 2n])]) {
        const proto = Object.getPrototypeOf(array[0]);
        const original = proto.toLocaleString;
        try {
            for (const args of [[], [locales], [locales, options, "extra"]]) {
                let calls = 0;
                proto.toLocaleString = function (l, o) {
                    assert(arguments.length === 2 && l === args[0] && o === args[1]);
                    return String(++calls);
                };
                assert(array.toLocaleString(...args) === "1,2");
            }
        } finally {
            proto.toLocaleString = original;
        }
    }
})();
