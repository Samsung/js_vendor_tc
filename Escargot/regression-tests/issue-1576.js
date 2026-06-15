
function F0() {
    if (!new.target) {
        throw 'must be called with new';
    }

    function F2() {
        if (!new.target) {
            throw 'must be called with new';
        }

        function F4() {
            if (!new.target) {
                throw 'must be called with new';
            }
            with(this) {}
        }
        let v6 = 10;
        v6--;
        L9: for (let v8 = 0; v8 < 5; v8++) {
            continue L9;
        }
    }
    new F2();
}
new F0();
