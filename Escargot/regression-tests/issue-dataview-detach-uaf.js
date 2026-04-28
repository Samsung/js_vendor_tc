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

// Test for CVE fix: Heap use-after-free in DataView.setFloat64 when ArrayBuffer is detached in valueOf callback
// This test ensures that DataView setX methods handle buffer detachment during value coercion gracefully

function assert(expression) {
  if (!expression) {
    throw new Error("Assertion failed");
  }
}

function assertThrows(code, errorType) {
    try {
        if (typeof code === 'function') {
            code();
        } else {
            eval(code);
        }
    } catch (e) {
        if (errorType && !(e instanceof errorType)) {
            throw new Error("Expected exception has failed");
        }
        return;
    }
    throw new Error("Did not throw exception");
}

// Test 1: Normal DataView operations should work correctly
let ab1 = new ArrayBuffer(16);
let dv1 = new DataView(ab1);

dv1.setFloat64(0, 1.5);
assert(dv1.getFloat64(0) === 1.5);

dv1.setInt32(0, 42);
assert(dv1.getInt32(0) === 42);

dv1.setFloat32(4, 3.14);
assert(Math.abs(dv1.getFloat32(4) - 3.14) < 0.001);

// Test 2: setFloat64 with valueOf callback that detaches buffer (the vulnerability case)
let ab2 = new ArrayBuffer(16);
let dv2 = new DataView(ab2);

let maliciousValue = {
    valueOf: function() {
        // Detach the buffer by transferring it
        ab2.transfer(8);
        return 1.0;
    }
};

// This should throw TypeError because buffer is detached during coercion
assertThrows(function() {
    dv2.setFloat64(0, maliciousValue);
}, TypeError);

// Test 3: setInt32 with valueOf callback that detaches buffer
let ab3 = new ArrayBuffer(16);
let dv3 = new DataView(ab3);

let maliciousValue2 = {
    valueOf: function() {
        ab3.transfer(4);
        return 42;
    }
};

assertThrows(function() {
    dv3.setInt32(0, maliciousValue2);
}, TypeError);

// Test 4: setBigInt64 with valueOf callback that detaches buffer
let ab4 = new ArrayBuffer(16);
let dv4 = new DataView(ab4);

let maliciousBigInt = {
    valueOf: function() {
        ab4.transfer(8);
        return 123456789n;
    }
};

assertThrows(function() {
    dv4.setBigInt64(0, maliciousBigInt);
}, TypeError);

// Test 5: Verify buffer state after failed set operation
let ab5 = new ArrayBuffer(16);
let dv5 = new DataView(ab5);
dv5.setFloat64(0, 2.5);

let detachValue = {
    valueOf: function() {
        ab5.transfer(8);
        return 99.0;
    }
};

try {
    dv5.setFloat64(0, detachValue);
} catch (e) {
    // Expected TypeError
}

// After the failed operation, the buffer should be detached
// Any read operation should throw TypeError
assertThrows(function() {
    dv5.getFloat64(0);
}, TypeError);

// Test 6: Multiple valueOf calls - only first should succeed
let callCount = 0;
let ab6 = new ArrayBuffer(16);
let dv6 = new DataView(ab6);

let countingValue = {
    valueOf: function() {
        callCount++;
        if (callCount === 1) {
            return 1.0;  // First call returns valid value
        }
        // Second call should not happen
        throw new Error("valueOf called multiple times");
    }
};

// This should work - valueOf should only be called once during coercion
dv6.setFloat64(0, countingValue);
assert(callCount === 1);
assert(dv6.getFloat64(0) === 1.0);

// Test 7: Verify that normal values still work after fix
let ab7 = new ArrayBuffer(32);
let dv7 = new DataView(ab7);

// Test various numeric types
dv7.setInt8(0, -128);
assert(dv7.getInt8(0) === -128);

dv7.setUint8(1, 255);
assert(dv7.getUint8(1) === 255);

dv7.setInt16(2, -32768);
assert(dv7.getInt16(2) === -32768);

dv7.setUint16(4, 65535);
assert(dv7.getUint16(4) === 65535);

dv7.setFloat64(8, 123.456);
assert(Math.abs(dv7.getFloat64(8) - 123.456) < 0.001);

// Test 8: Detach via transfer with different sizes
let ab8 = new ArrayBuffer(16);
let dv8 = new DataView(ab8);

let detachToSmaller = {
    valueOf: function() {
        ab8.transfer(0);  // Detach to zero length
        return 1.0;
    }
};

assertThrows(function() {
    dv8.setFloat64(0, detachToSmaller);
}, TypeError);