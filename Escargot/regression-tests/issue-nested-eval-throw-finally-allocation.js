// Test case for SVE-2026-2089: Nested eval throw with finally allocation crash
// This test verifies that nested eval throw patterns inside try/finally,
// followed by allocation in finally, does not cause memory corruption or crash.

// Test 1: Basic nested eval throw with finally allocation
try {
    eval("throw 1;");
} catch (e) {
    // caught
} finally {
    try { eval("throw 2;"); } catch (e) {}
    new Uint8Array(100);
}

// Test 2: Multiple nested eval throws
try {
    eval("throw 'first';");
} catch (e) {
    // caught
} finally {
    try {
        eval("throw 'second';");
    } catch (e) {
        // caught
    }
    try {
        eval("throw 'third';");
    } catch (e2) {
        // caught
    }
    new Uint8Array(50);
}

// Test 3: Nested try/finally with eval throws
let executed = false;
try {
    try {
        eval("throw 1;");
    } catch (e) {
        // caught
    } finally {
        try { eval("throw 2;"); } catch (e) {}
        new ArrayBuffer(10);
    }
} catch (e) {
    executed = true;
}

// Test 4: Deeply nested eval throws
try {
    eval("try { eval('throw 1;'); } finally { eval('throw 2;'); }");
} catch (e) {
    // Should catch the exception
}

// Test 5: Original PoC pattern - nested eval throw with finally allocation
try {
    eval("throw 1;");
} catch (e) {
    // caught
} finally {
    try { eval("throw 2;"); } catch (e) {}
    new Uint8Array(100);
}

print("PASS: All nested eval throw with finally allocation tests passed");