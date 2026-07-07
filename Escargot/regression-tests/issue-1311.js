var myObj = { p1 : 0, del : 1 } ;
eval ( " with ( myObj ) { delete p1 ; p1 ='a'; p1 = delete this. p1 } " ) ;
