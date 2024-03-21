var a = / a / ; 
assertThrows("a. a?. a [ Symbol. Symbol ] = 0.1 ;", SyntaxError);
for ( var r in a ) r : { }
