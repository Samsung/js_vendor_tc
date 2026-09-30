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

// Rejected awaits must not write their rejection reason to the assignment target.
const results = {};

async function throws() {
    throw "rejected";
}

async function run() {
    let value = "initial";
    try {
        value = await Promise.reject("rejected");
    } catch (error) {
        results.directError = error;
    }
    results.direct = value;

    value = "initial";
    try {
        value = (await Promise.reject("rejected"));
    } catch (error) {
        results.parenthesizedError = error;
    }
    results.parenthesized = value;

    value = "initial";
    try {
        value = true ? await Promise.reject("rejected") : "other";
    } catch (error) {
        results.conditionalError = error;
    }
    results.conditional = value;

    value = "initial";
    try {
        value = await throws();
    } catch (error) {
        results.functionError = error;
    }
    results.functionCall = value;

    value = "initial";
    value = await Promise.resolve("resolved");
    results.fulfilled = value;
}

run();
assert(drainJobQueue());
assert(results.directError === "rejected" && results.direct === "initial");
assert(results.parenthesizedError === "rejected" && results.parenthesized === "initial");
assert(results.conditionalError === "rejected" && results.conditional === "initial");
assert(results.functionError === "rejected" && results.functionCall === "initial");
assert(results.fulfilled === "resolved");

function* generator() {
    let value = "initial";
    try {
        value = yield "paused";
    } catch (error) {
        assert(error === "rejected");
    }
    return value;
}

const iterator = generator();
assert(iterator.next().value === "paused");
assert(iterator.throw("rejected").value === "initial");
