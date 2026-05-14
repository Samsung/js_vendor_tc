// Test case for SVE-2026-2087: Proxy getOwnPropertyDescriptor trap that mutates target object state
// should not cause GC corruption / crash

// Test 1: Proxy with getOwnPropertyDescriptor trap that mutates String object
let o = new String("x");
let p = new Proxy(o, {
  getOwnPropertyDescriptor(t, k) {
    Object.defineProperty(o, k, { value: null });
    return Reflect.getOwnPropertyDescriptor(t, k);
  }
});

try {
  new Uint8Array(p);
} catch (e) {
  // Should throw TypeError instead of crashing
  if (!(e instanceof TypeError)) {
    throw new Error("Test 1 failed: Expected TypeError but got " + e);
  }
}

// Test 2: Verify String object index properties cannot be redefined
let s = new String("abc");
try {
  Object.defineProperty(s, "0", { value: "x" });
  throw new Error("Test 2 failed: Should have thrown TypeError");
} catch (e) {
  if (!(e instanceof TypeError)) {
    throw new Error("Test 2 failed: Expected TypeError but got " + e);
  }
}
// The property should remain unchanged because String index properties are non-configurable
if (s[0] !== "a") {
  throw new Error("Test 2 failed: String index property should not be changed");
}

// Test 3: Verify normal proxy behavior still works
let arr = [1, 2, 3];
let p2 = new Proxy(arr, {
  getOwnPropertyDescriptor(t, k) {
    return Reflect.getOwnPropertyDescriptor(t, k);
  }
});
let u4 = new Uint8Array(p2);
if (u4.length !== 3) {
  throw new Error("Test 3 failed: Normal proxy should work");
}

print("All tests passed!");