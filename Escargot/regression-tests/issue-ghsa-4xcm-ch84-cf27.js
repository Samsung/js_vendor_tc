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

// GHSA-4xcm-ch84-cf27: variable counts must not wrap around their 16-bit
// storage and slip past the variable limit check.

(function () {
    function names(prefix, n) {
        var a = [];
        for (var i = 0; i < n; i++)
            a.push(prefix + i);
        return a.join(",");
    }

    function expectLimit(src) {
        try {
            (0, eval)(src);
        } catch (e) {
            if (e instanceof SyntaxError)
                return;
            throw e;
        }
        throw new Error("expected SyntaxError: " + src.slice(0, 40));
    }

    // 65534 vars + the two reserved slots wrap a 16-bit count to 0
    [65534, 65535, 131070].forEach(function (n) {
        expectLimit("(function(){ var " + names("v", n) + "; return v0; })()");
    });
    [65534, 65535].forEach(function (n) {
        expectLimit("(function(" + names("p", n) + "){ return p0; })()");
    });
    expectLimit("(function(){ { let " + names("l", 65536) + "; return l0; } })()");
    expectLimit("(function(){ var " + names("v", 65536) + "; return function(){ eval(''); return v0; }; })()()");

    var v = (0, eval)("(function(){ var " + names("v", 16381) + "; v0 = 1; return v0; })()");
    if (v !== 1)
        throw new Error("a scope just below the limit must still work");
})();
