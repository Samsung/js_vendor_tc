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

// Test for CVE fix: Heap-buffer-overflow in TypedArray.copyWithin after resizable ArrayBuffer shrink during argument coercion
// This test ensures that copyWithin handles buffer resize during callback gracefully without memory corruption

// Test 1: Basic copyWithin with resizable ArrayBuffer
let rab1 = new ArrayBuffer(1024, { maxByteLength: 2048 });
let ta1 = new Uint8Array(rab1);
for (let i = 0; i < 16; i++) {
    ta1[i] = i + 1;
}

// Normal copyWithin should work
ta1.copyWithin(0, 4, 8);
assert(ta1[0] == 5);
assert(ta1[1] == 6);
assert(ta1[2] == 7);
assert(ta1[3] == 8);

// Test 2: copyWithin with resize in valueOf callback (the vulnerability case)
let rab2 = new ArrayBuffer(1024, { maxByteLength: 2048 });
let ta2 = new Uint8Array(rab2);
for (let i = 0; i < 16; i++) {
    ta2[i] = i + 1;
}

let resizeObj = {
    valueOf: function() {
        // Resize buffer to 4 bytes during argument coercion
        rab2.resize(4);
        return 2;  // start index
    }
};

// This should not crash or cause memory corruption
let result = ta2.copyWithin(0, resizeObj, 8);
assert(result == ta2);
// After resize, the typed array length should be 4
assert(ta2.length == 4);

// Test 3: copyWithin with resize that makes indices invalid
let rab3 = new ArrayBuffer(1024, { maxByteLength: 2048 });
let ta3 = new Uint8Array(rab3);
for (let i = 0; i < 16; i++) {
    ta3[i] = i + 1;
}

let resizeObj2 = {
    valueOf: function() {
        // Resize to very small buffer
        rab3.resize(2);
        return 8;  // start index that would be out of bounds after resize
    }
};

// This should not crash
let result2 = ta3.copyWithin(0, resizeObj2, 12);
assert(result2 == ta3);
assert(ta3.length == 2);

// Test 4: copyWithin with target index causing negative count after resize
let rab4 = new ArrayBuffer(1024, { maxByteLength: 2048 });
let ta4 = new Uint8Array(rab4);
for (let i = 0; i < 16; i++) {
    ta4[i] = i + 1;
}

let resizeObj3 = {
    valueOf: function() {
        rab4.resize(4);
        return 0;  // start index
    }
};

// Target index 8 would be beyond the resized buffer length (4)
// count would be negative: min(4-0, 4-8) = min(4, -4) = -4
// The fix ensures count is clamped to 0
let result3 = ta4.copyWithin(8, resizeObj3);
assert(result3 == ta4);
assert(ta4.length == 4);

// Test 5: Verify data integrity after safe copyWithin with resize
let rab5 = new ArrayBuffer(16, { maxByteLength: 32 });
let ta5 = new Uint8Array(rab5);
for (let i = 0; i < 16; i++) {
    ta5[i] = i + 1;
}

// Resize before copyWithin starts
rab5.resize(8);
// Now copyWithin should work on the smaller buffer
ta5.copyWithin(0, 4);
assert(ta5[0] == 5);
assert(ta5[1] == 6);
assert(ta5[2] == 7);
assert(ta5[3] == 8);