// Test for Proxy ownKeys trap re-entry vulnerability fix
// https://github.com/Samsung/escargot/issues/xxx
// A Proxy `ownKeys` trap that re-enters enumeration flow should not trigger invalid free

let p;
p = new Proxy({a:1}, {
  ownKeys(t) { return Reflect.ownKeys(p); }
});

try { 
  Object.keys(p); 
} catch (e) { 
  // Should catch the error properly without crashing
}

print("PASS");