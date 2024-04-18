let t = new Uint32Array ( 3 ) ;
Object. setPrototypeOf ( t, [ 0.1 ] ) ;
t. length = Infinity ;
var code = "t. slice ( 2 ) ;"
assertThrows(code, RangeError);
