function assertEq(a, b, msg) {
    if (a !== b) {
        if (!msg)
            msg = "assertEq failed";
        throw msg + " (" + a + ", " + b + ")";
    }
}
