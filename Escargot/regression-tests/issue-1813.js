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

// Samsung/escargot#1813
(function () {
    const log = [];
    const arrayLike = {
        length: 2,
        get 0() { log.push("get 0"); return Promise.resolve(3); },
        get 1() { log.push("get 1"); return 4; }
    };
    let result;
    Array.fromAsync(arrayLike, (value, index) => {
        log.push("map " + index);
        return value * 2;
    }).then(values => { result = values; });
    log.push("returned");
    assert(log.join(",") === "get 0,returned");
    assert(drainJobQueue());
    assert(log.join(",") === "get 0,returned,map 0,get 1,map 1");
    assert(result.join(",") === "6,8");

    const error = {};
    let caught;
    Array.fromAsync({ length: 1, get 0() { throw error; } })
        .catch(reason => { caught = reason; });
    assert(drainJobQueue());
    assert(caught === error);
})();
