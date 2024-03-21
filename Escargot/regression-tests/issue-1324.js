var program = "for ( var a = 0 ; a < 128 ; a ++ ) { \
                   Object. getPrototypeOf ( \
                       function * func0 ( f,... a ) { \
    	        		   g. apply ( null, [ a ] ) ; yield * ( this, a ) ; \
                	   } \
                   ) ( ). next ( ) ; \
               }"

assertThrows(program, TypeError);
