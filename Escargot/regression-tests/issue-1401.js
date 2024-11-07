function test(a) {
    var b = "e";
    return (b&&a.get(b))??a.get("unknown");
}

test({get : function(a) {return a}});
