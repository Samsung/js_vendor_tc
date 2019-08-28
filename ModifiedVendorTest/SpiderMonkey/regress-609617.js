// this is modified source
// original source location
// # SpiderMonkey
// - repo: https://github.com/mozilla/gecko-dev
// - path: js/src/test/js1_8_5/regress/regress-609617.js
//        commit 790b2cb423ea1ecb5746722d51633caec9bab95a
//        Author: Phil Ringnalda <philringnalda@gmail.com>
//        Date:   Mon Jan 16 21:42:59 2017 -0800
//
//                Merge m-i to m-c, a=merge
//

/* -*- indent-tabs-mode: nil; js-indent-level: 4 -*- */
/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/licenses/publicdomain/
 */

var actual;
var expect = "pass";

var x = "fail";
function f() {
    var x = "pass"; 
    delete(eval("actual = x"));
}
f();
assertEq(actual, expect);

function g() { return 1 }
function h() { function g() { throw 2; } eval('g()')++; } 

try {
    h();
    assertEq(0, -1);
} catch (e) {
    assertEq(e, 2);
}

var lhs_prefix = ["",        "++", "--", "",   "",];
var lhs_suffix = [" = 'no'", "",   "",   "++", "--"];

for (var i = 0; i < lhs_prefix.length; i++) {
    try {
        eval(lhs_prefix[i] + "eval('x')" + lhs_suffix[i]);
        assertEq(i, -2);
    } catch (e) {
        if (/\[/.test(lhs_prefix[i])) {
            assertEq(e.message, "invalid destructuring target");
        } else {
            /*
             * NB: JSOP_SETCALL throws only JSMSG_BAD_LEFTSIDE_OF_ASS, it does not
             * specialize for ++ and -- as the compiler's error reporting does. See
             * the next section's forked assertEq code.
             */
            assertEq(e.message, "Invalid assignment left-hand side");
        }
    }
}

/* Now test for strict mode rejecting any SETCALL variant at compile time. */
for (var i = 0; i < lhs_prefix.length; i++) {
    try {
        eval("(function () { 'use strict'; " + lhs_prefix[i] + "foo('x')" + lhs_suffix[i] + "; })");
        assertEq(i, -3);
    } catch (e) {
        assertEq(e.message, "Line 1: Invalid left-hand side in assignment");
    }
}

/*
 * The useless delete is optimized away, but the SETCALL must not be. It's not
 * an early error, though.
 */
var fooArg;
function foo(arg) { fooArg = arg; }
try {
    eval("delete (foo('x') = 42);");
    assertEq(0, -4);
} catch (e) {
    assertEq(e.message, "Invalid assignment left-hand side");
}
assertEq(fooArg, 'x');

/* Delete of a call expression is not an error at all, even in strict mode. */
function g() {
    "use strict";
    assertEq(delete Object(), true);
}
g();

// reportCompare(0, 0, "ok");
