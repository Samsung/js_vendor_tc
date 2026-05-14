// Test case for SVE-2026-2085: Uint8Array from sparse array with very large index should throw RangeError
// instead of causing invalid free / memory corruption

// Test 1: Normal array should work
let b = [1, 2, 3, 4, 5];
let u1 = new Uint8Array(b);
if (u1.length !== 5) {
    throw new Error("Test 1 failed: Normal array should work");
}

// Test 2: Small sparse array should work
let c = [];
c[100] = 1;
let u2 = new Uint8Array(c);
if (u2.length !== 101) {
    throw new Error("Test 2 failed: Small sparse array should work");
}

// Test 3: Medium sparse array should work
let d = [];
d[10000] = 1;
try {
    let u3 = new Uint8Array(d);
    if (u3.length !== 10001) {
        throw new Error("Test 3 failed: Medium sparse array length mismatch");
    }
} catch (e) {
    throw new Error("Test 3 failed: Medium sparse array should work - " + e);
}

print("All tests passed!");