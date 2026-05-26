try {
const v5 = new ArrayBuffer(5, { maxByteLength: 10 });
v5.transfer(1974);
assert(false);
} catch (e) {
    assert(e instanceof RangeError)
}
