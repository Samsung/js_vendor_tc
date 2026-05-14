// SVE-2026-2149: Test for FinalizationRegistry cleanup callback that throws
// This tests that cleanup callback throwing during finalization doesn't cause invalid free

let collected = 0;
let fr = new FinalizationRegistry(h => { collected++; throw 1; });

for (let i = 0; i < 100; i++) {
    let o = {};
    fr.register(o, i);
    o = null;
}

// Force GC
for (let i = 0; i < 1000; i++) new Array(1000);

// Should reach here without crash (invalid free)
// The callback may have been called some number of times
print("collected: " + collected);
print("test passed");