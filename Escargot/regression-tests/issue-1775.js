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

// Samsung/escargot#1775: sticky RegExp split.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    same(JSON.stringify('a,b'.split(/,/y)), '["a","b"]');
    same(JSON.stringify('xay'.split(/a/y)), '["x","y"]');
    var readonly = /,/y;
    Object.defineProperty(readonly, 'lastIndex', { value: 2, writable: false });
    same(JSON.stringify('a,b'.split(readonly)), '["a","b"]');
    same(readonly.lastIndex, 2);
    ['y', 'gy', 'uy', 'vy', '', 'u'].forEach(function (flags) {
        [',', '(,)', '(?:)', 'z', 'a*'].forEach(function (pattern) {
            ['a,b,c', '\ud83d\ude00,a', '', ',,'].forEach(function (s) {
                var re = new RegExp(pattern, flags);
                re.lastIndex = 2;
                same(JSON.stringify(s.split(re)), JSON.stringify(re[Symbol.split](s)), '/' + pattern + '/' + flags + ' input=' + s);
                same(re.lastIndex, 2);
                same(JSON.stringify(s.split(re, 2)), JSON.stringify(re[Symbol.split](s, 2)));
            });
        });
    });
})();
