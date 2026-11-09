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

// Samsung/escargot#1771: large Date time components.

(function () {
    function same(actual, expected, detail) {
        if (!Object.is(actual, expected)) {
            throw new Error((detail ? detail + ': ' : '') + 'expected ' + String(expected) + ', got ' + String(actual));
        }
    }

    // Normalize large local time components through a day carry. The
    // reference keeps every time component below 2^31 in every timezone.
    function normalizedLocal(year, month, day, hour, minute, second, ms) {
        var time = Math.trunc(hour) * 3600000 + Math.trunc(minute) * 60000
            + Math.trunc(second) * 1000 + Math.trunc(ms);
        var days = Math.trunc(time / 86400000);
        return +new Date(year, month, day + days, 0, 0, 0, time - days * 86400000);
    }
    var epoch = new Date(0);
    function expectedLocal(hour, minute, second, ms) {
        return normalizedLocal(epoch.getFullYear(), epoch.getMonth(), epoch.getDate(), hour, minute, second, ms);
    }

    same(Date.UTC(1970, 0, 1, 0, 2147483648), 128849018880000);
    same(new Date(0).setMinutes(2147483648), expectedLocal(epoch.getHours(), 2147483648, epoch.getSeconds(), epoch.getMilliseconds()));
    same(new Date(0).setMinutes(2147483647), expectedLocal(epoch.getHours(), 2147483647, epoch.getSeconds(), epoch.getMilliseconds()));
    same(new Date(0).setHours(2147483648), expectedLocal(2147483648, epoch.getMinutes(), epoch.getSeconds(), epoch.getMilliseconds()));
    same(new Date(0).setUTCMinutes(4e9), 240000000000000);
    same(new Date(0).setSeconds(2147483648), expectedLocal(epoch.getHours(), epoch.getMinutes(), 2147483648, epoch.getMilliseconds()));
    same(+new Date(1970, 0, 1, 0, -2147483648), normalizedLocal(1970, 0, 1, 0, -2147483648, 0, 0));
    same(new Date(0).setUTCHours(-2147483648), -7730941132800000);
    same(Date.UTC(1970, 0, 1, 0, 2147483648.9), 128849018880000);
    same(Date.UTC(1970, 0, 1, Infinity), NaN);
    same(Date.UTC(1970, 0, 1, 1e100), NaN);
    same(Date.UTC(1970, 0, 1, 2400000000), 8640000000000000);
    same(Date.UTC(1970, 0, 1, 2400000001), NaN);
    same(Date.UTC(1970, 0, 1, 1e12, -6e13), 0);
    same(Date.UTC(1970, 0, 1, 1e20, -6e21), 0);
    same(Date.UTC(1970, 0, 1, 0, 0, 1e20, -1e23), 0);
    same(Date.UTC(1970, 0, 1, -2147483648.9), -7730941132800000);
    same(new Date(0).setUTCHours(2147483648, -128849018880), 0);
    same(new Date(0).setUTCMilliseconds(9e18), NaN);
    same(+new Date(1970, 0, 1, 0, 0, 0, 9223372036854774000), NaN);
    same(+new Date(1970, 0, 1, 0, 0, 0, -9223372036854774000), NaN);
    var conversions = [];
    same(Date.UTC(1970, 0, 1, { valueOf() { conversions.push('h'); return 2147483648; } },
        { valueOf() { conversions.push('m'); return 0; } }), 7730941132800000);
    same(conversions.join(), 'h,m');
})();
