function main() {
    
    const Probe = (function() {

        const ProxyConstructor = Proxy;

    
        const getOwnPropertyNames = Object.getOwnPropertyNames;
        const getPrototypeOf = Object.getPrototypeOf;
        const setPrototypeOf = Object.setPrototypeOf;
        const hasOwnProperty = Object.hasOwn;
        const defineProperty = Object.defineProperty;
        const propertyValues = Object.values;
        const parseInteger = parseInt;
        const NumberIsInteger = Number.isInteger;
        const isNaN = Number.isNaN;
        const isFinite = Number.isFinite;
        const truncate = Math.trunc;
        const apply = Reflect.apply;
        const construct = Reflect.construct;
        const ReflectGet = Reflect.get;
        const ReflectSet = Reflect.set;
        const ReflectHas = Reflect.has;

        class RNG {
        }
    
        const PROPERTY_LOAD = "loads";
        const PROPERTY_STORE = "stores";
    
        const PROPERTY_NOT_FOUND = 0;
        const PROPERTY_FOUND = 1;

        let results = { __proto__: null };
    
        function reportError(msg) {
        }
    
        function reportResults() {
        }
    
        function probe(id, value) {
            let originalPrototype, newPrototype;
            let handler = {
                get(target, key, receiver) {
                    if (key === '__proto__' && receiver === value) return originalPrototype;
                    if (receiver === newPrototype) return ReflectGet(target, key);
                    recordActionWithErrorHandling(PROPERTY_LOAD, id, target, key);
                    return ReflectGet(target, key, receiver);
                },
                set(target, key, value, receiver) {
                    if (receiver === newPrototype) return ReflectSet(target, key, value);
                    recordActionWithErrorHandling(PROPERTY_STORE, id, target, key);
                    return ReflectSet(target, key, value, receiver);
                },
                has(target, key) {
                    // Treat this as a load.
                    recordActionWithErrorHandling(PROPERTY_LOAD, id, target, key);
                    return ReflectHas(target, key);
                },
            };
    
            try {
                // This can fail, e.g. due to "Cannot convert undefined or null to object" or if the object is non-extensible. In that case, do nothing.
                originalPrototype = getPrototypeOf(value);
                newPrototype = new ProxyConstructor(originalPrototype, handler);
                setPrototypeOf(value, newPrototype);
            } catch (e) {}
        }
    
        function probeWithErrorHandling(id, value) {
            try {
                probe(id, value);
            } catch(e) {
                reportError(e);
            }
        }
    
        return {
            probe: probeWithErrorHandling,
            reportResults: reportResults
        };
    })();
    class C1 {
        static h;
    }
    let v1 = new C1();
    Probe.probe("v1", v1);
    function f1(a1, a2, a3) {
        try {
            Probe.probe("v5", Map);
            const v6 = new Map();
            v6.set(Map, BigInt64Array);
            Map instanceof Array;
            f1(2.2250738585072014e-308, a1, 2.2250738585072014e-308);
        } catch(e1) {
        }
    }
    Probe.probe("v2", f1);
    f1(v1, v1, v1);
    f1(v1, v1, f1);
    
    }; main();
