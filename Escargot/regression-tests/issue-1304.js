if ( isNaN ( true % null )!== true ) { throw new Test262Error ( " 1 : true % null === Not - a - Number. Actual : " + true % null ) ; }
if ( null % true!== 0 ) { throw new Test262Error ( " 2 : null % true === 0 Actual : " + null % true ) ; }
assertThrows('Function(if ( isNaN ( new Boolean Number ( true ) % null )!== true ) { throw new Test262Error ( " " ) ; })', SyntaxError);
