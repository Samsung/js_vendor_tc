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

// Samsung/escargot#1776: template code point escapes.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    same(`A\u{1F600}B`, 'A\ud83d\ude00B');
    same(`\u{10000}\u{41}`, '\ud800\udc00A');
    same(`\u{10FFFF}`, '\udbff\udfff');
    same(`\u{FFFF}\u{D800}\u{0}`, '\uffff\ud800\0');
    same(`x${1}\u{1F600}`, 'x1\ud83d\ude00');
    function tag(strings) { return [strings[0], strings.raw[0]]; }
    var tagged = tag`\u{1F600}`;
    same(tagged[0], '\ud83d\ude00');
    same(tagged[1], '\\u{1F600}');
    same(tag`\u{110000}`[0], undefined);
})();
