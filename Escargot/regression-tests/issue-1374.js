let v2 = new Proxy(function(){}, {});
for (let v4 = 0; v4 < 100000; v4++) {
    v2 = new Proxy(v2, {});
}

try { Reflect.apply(v2, {}, []) } catch(_) {}
try { Reflect.construct(v2, []) } catch(_) {}
