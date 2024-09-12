class Base {
};

class Child1 extends Base {
    constructor () {
        var ret = () => eval('(() => (this.x))()');
        super();
        assert(ret() == 1);
    }

    x = 1;
};

class Child2 extends Base {
    constructor () {
        var ret = eval('() => (() => (this.x))()');
        super();
        assert(ret() == 1);
    }

    x = 1;
};

class Child3 extends Base {
    constructor () {
        super();
        var ret = eval('(() => (this.x))()');
        assert(ret == 1);
    }

    x = 1;
};

var v1 = new Child1();
var v2 = new Child2();
var v3 = new Child3();
