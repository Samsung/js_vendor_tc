var code = '( async ( ) => { } ) ( ); \
            await new Error ( ) ;';

assertThrows(code, SyntaxError);
