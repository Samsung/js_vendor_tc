var v0 = "function f1() {\n".repeat(80000);
v0 += v0;
v0 += ", x" + -2147483648 + " = " + 1;
v0 += ";\n";
v0 += "  return 80000;\n";
v0 += "}\n";
assertThrows(v0, RangeError)
