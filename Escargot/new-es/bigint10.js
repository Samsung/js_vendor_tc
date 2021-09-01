function check(number) {
    return number;
}

check.call(this, 5n);
check.call(this, 5n, 5);
check.call(this, 1n);
check.call(this, 0x100b);
check.call(this, -1n);
check.call(this, -2n);
check.call(this, -0x100n);
check.call(this, 0x80000000000004n);
check.call(this, 0x800000000000f400000000000000000000000000000000n);

check.apply(this, [5n, 5]);
check.apply(this, [0n, 1n, 0x100n, -1n, -2n, -0x100n, 0x80000000000004n, 0x800000000000f400000000000000000000000000000000n]);
