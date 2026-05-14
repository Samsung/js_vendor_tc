// SVE-2026-2146: Test for toString() that throws inside try/finally
// This tests that exception handling in toString with finally block doesn't cause crash

let o = {
    toString() {
        try {
            throw 1;
        } finally {
            new Uint8Array();
        }
        return "x";
    }
};

try {
    print(o + "y");
} catch (e) {
    print("caught: " + e);
}

// Should reach here without crash
print("test passed");