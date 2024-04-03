assertThrows('Object.prototype.__proto__ = {};', TypeError);
assertThrows('this.__proto__ = {};', TypeError);

function test() {
    var e = this ;
    e. __defineSetter__ ( " ", function ( func0 ) { }, this. __proto__ = e ) ;
    " global. x = 0 " in e ;
}

assertThrows(test, TypeError);
