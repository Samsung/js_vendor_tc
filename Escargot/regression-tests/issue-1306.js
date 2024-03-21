a = [ ] ; 
a = [ 0.1, 0.1, 0.1 ] ; 
a. length = 1 ; 
delete a [ 1 ] ; 
a = delete a ; 
delete a ; 
assertThrows("a [ 0 ] ;", ReferenceError);
