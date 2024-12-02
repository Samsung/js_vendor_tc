function f0() {
    const v1 = /a\w/syu;
    v1.lastIndex = f0;
    try {
        v1[Symbol.replace]();
    } catch(e5) {
    }
}
f0.valueOf = f0;
f0();
