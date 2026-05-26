// pass if no crash
try {
var a = new Float64Array(0x20000001);
print(a.byteLength);
a[1] = 13.37;
print(a[1]);
} catch(e) {
}
