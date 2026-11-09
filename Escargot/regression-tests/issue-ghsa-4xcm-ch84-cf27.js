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
// The names are spread over nested blocks: the lexical depth adds up across
// nesting, while each block keeps a small name list, so even debug builds
// parse the source cheaply.

(function () {
    function nested(total) {
        var src = "", close = "", n = 0;
        while (n < total) {
            var k = Math.min(100, total - n), names = [];
            for (var i = 0; i < k; i++)
                names.push("l" + (n + i));
            src += "{ let " + names.join(",") + "; ";
            close += "}";
            n += k;
        }
        return "(function(){ " + src + "l0 = 7; return l0; " + close + " })()";
    }

    function expectLimit(total) {
        try {
            (0, eval)(nested(total));
        } catch (e) {
            if (e instanceof SyntaxError)
                return;
            throw e;
        }
        throw new Error("expected SyntaxError for " + total + " names");
    }

    // the depth wraps to 0 at 65536
    expectLimit(65536);
    // just above the limit
    expectLimit(16382);
    // just below the limit still works
    var v = (0, eval)(nested(16381));
    if (v !== 7)
        throw new Error("a scope just below the limit must still work");
})();
