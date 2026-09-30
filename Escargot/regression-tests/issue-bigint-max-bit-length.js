/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// A BigInt is stored as mantissa * 2^exponent, so a shift by a huge amount used
// to build an astronomically large value for free and only burn unbounded CPU
// and memory once that value had to be materialized. Every operation that can
// grow a BigInt now refuses a result wider than BigInt::maxBitLength.

// the shifts, in both directions
assertThrows(function () { return 1n >> -1000000000000n; }, RangeError);
assertThrows(function () { return -1n >> -1000000000000n; }, RangeError);
assertThrows(function () { return 123456789n >> -1000000000000n; }, RangeError);
assertThrows(function () { return 1n << 1000000000000n; }, RangeError);
assertThrows(function () { return -1n << 1000000000000n; }, RangeError);

// exponentiation reaches the same magnitudes, and a base that is not a power of
// two has to be refused before the digits are computed rather than after
assertThrows(function () { return 2n ** 1000000000000n; }, RangeError);
assertThrows(function () { return 3n ** 1000000000000n; }, RangeError);
assertThrows(function () { return (-3n) ** 1000000000000n; }, RangeError);

// BigInt.asUintN() builds a 2^bits mask, and `bits` goes up to 2^53-1
assertThrows(function () { return BigInt.asUintN(1000000000000, -1n); }, RangeError);
assertThrows(function () { return BigInt.asUintN(9007199254740991, -1n); }, RangeError);

// a mask wider than any representable BigInt cannot change these values
assert(BigInt.asUintN(1000000000000, 5n) === 5n);
assert(BigInt.asUintN(1000000000000, 0n) === 0n);
assert(BigInt.asIntN(1000000000000, -1n) === -1n);
assert(BigInt.asIntN(9007199254740991, -7n) === -7n);
assert(BigInt.asUintN(3, -1n) === 7n);
assert(BigInt.asIntN(3, 7n) === -1n);
assert(BigInt.asUintN(0, -1n) === 0n);

// a shift that pushes out every bit is a legal 0n/-1n, not an error, and it
// floors towards -inf. The 32bit build used to answer 0n for the negative ones
// because the libbf exponent underflowed to a signed zero.
assert((1n >> 1000000000000n) === 0n);
assert((-1n >> 1000000000000n) === -1n);
assert((1n << -1000000000000n) === 0n);
assert((-1n << -1000000000000n) === -1n);
assert((-1n >> 2147483647n) === -1n);
assert((-5n >> 1000n) === -1n);
assert((5n >> 1000n) === 0n);
assert((-5n << -1000n) === -1n);
assert((5n << -1000n) === 0n);

// the boundary of that shortcut: 4n and 7n are both 3 bits wide
assert((4n >> 2n) === 1n);
assert((4n >> 3n) === 0n);
assert((-4n >> 2n) === -1n);
assert((-4n >> 3n) === -1n);
assert((7n >> 3n) === 0n);
assert((-7n >> 2n) === -2n);
assert((-7n >> 3n) === -1n);

// ordinary operations are untouched
assert((5n >> 1n) === 2n);
assert((-5n >> 1n) === -3n);
assert((5n << 2n) === 20n);
assert((5n << -1n) === 2n);
assert((0n << 1000n) === 0n);
assert((2n ** 64n) === 18446744073709551616n);
assert((1n ** 1000000000000n) === 1n);
assert((0n ** 1000000000000n) === 0n);
assert((1n << 1000n).toString(16).length === 251);
assert(((1n << 1000n) >> 1000n) === 1n);
assert(((1n << 1000n) + 1n) % 2n === 1n);

// a width every target still holds, and one that is past the bound anywhere.
// A 32bit target gives up earlier than maxBitLength, when the libbf exponent
// itself overflows, but the error is a RangeError either way.
assert((1n << 100000000n) >> 100000000n === 1n);
assertThrows(function () { return 1n << 1073741824n; }, RangeError);

// growing an allowed value past the bound is refused as well. Multiplying
// powers of two only moves the exponent, so squaring doubles the width and has
// to be refused within a few steps on any target.
assertThrows(function () {
    var v = 1n << 100000000n;
    for (var i = 0; i < 8; i++) {
        v = v * v;
    }
    return v;
}, RangeError);
