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

// Test cases for Atomics operations with ArrayBuffer transfer/resize vulnerabilities
// These tests verify that Atomics operations properly handle detached/resized buffers

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

// Test 1: Atomics.store with transfer() in valueOf (index 1)
// Tests that Atomics.store handles detached buffer properly
(function testAtomicsStoreWithTransfer1() {
    var ab = new ArrayBuffer(8), ta = new Int32Array(ab);
    var evil = { valueOf: function(){ ab.transfer(); return 0x41414141; } };
    // Atomics.store(ta, 1, evil);  // -> setValueInBuffer at nullptr+4
    // This should throw or handle gracefully, not crash
    try {
        Atomics.store(ta, 1, evil);
    } catch (e) {
        // Expected to throw after transfer
    }
})();

// Test 2: Atomics.store with transfer() in valueOf (index 0x3ff)
// Tests that Atomics.store handles detached buffer with large index
(function testAtomicsStoreWithTransfer2() {
    var ab = new ArrayBuffer(0x1000), ta = new Int32Array(ab);  // len 0x400
    var evil = { valueOf: function(){ ab.transfer(); return 0x11223344; } };
    // Atomics.store(ta, 0x3ff, evil);  // fault @ nullptr+0xffc
    // This should throw or handle gracefully, not crash
    try {
        Atomics.store(ta, 0x3ff, evil);
    } catch (e) {
        // Expected to throw after transfer
    }
})();

// Test 3: Atomics.store with resize() in valueOf (maxByteLength scenario)
// Tests that Atomics.store handles resized buffer with maxByteLength
(function testAtomicsStoreWithResize() {
    var ab = new ArrayBuffer(0x40, { maxByteLength: 0x40 }), ta = new Int32Array(ab);
    var evil = { valueOf: function(){ ab.resize(4); return 0x6f6f6f6f; } };
    // Atomics.store(ta, 0xf, evil);  // writes byte 60, past new len 4, into still-mapped maxlen region — NO crash
    // This should throw or handle gracefully, not crash
    try {
        Atomics.store(ta, 0xf, evil);
    } catch (e) {
        // Expected to throw after resize
    }
})();

// Test 4: Atomics.load with transfer() in valueOf
// Tests that Atomics.load handles detached buffer properly
(function testAtomicsLoadWithTransfer() {
    var ab = new ArrayBuffer(8), ta = new Int32Array(ab);
    // Atomics.load(ta, {valueOf:()=>{ab.transfer();return 1;}})
    // This should throw or handle gracefully, not crash
    try {
        Atomics.load(ta, {valueOf:()=>{ab.transfer();return 1;}});
    } catch (e) {
        // Expected to throw after transfer
    }
})();
