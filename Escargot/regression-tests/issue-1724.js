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

// https://github.com/Samsung/escargot/issues/1724
// The limit varies by OS. Bound the workload, accept successful allocations,
// and require resource exhaustion to surface as RangeError instead of abort().
if (typeof WebAssembly !== "undefined") {
    var keep1724 = [];
    try {
        for (var i = 0; i < 40000; ++i) {
            keep1724.push(new WebAssembly.Memory({ initial: 1 }));
        }
    } catch (error) {
        assert(error instanceof RangeError);
    }
    assert(keep1724.length > 0);
    assert(keep1724[0].buffer.byteLength === 65536);
}
