var r = new Uint8Array ( 1 ) ;
class n extends Int8Array {
    constructor ( r ) {
        super ( r ) ;
        eval ( " super ( ) ; " ) ;
    }
}
assertThrows("r. constructor = n, r. map ( function ( ) { } ) ;", ReferenceError);
