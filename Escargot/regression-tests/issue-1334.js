try { eval("( function ( ... { 0 : n = function func1 ( ) { },... { } } ) { } ) ( ) ") }
catch(e) { assert(e.toString().includes("SyntaxError")) }
