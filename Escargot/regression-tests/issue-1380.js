var code = "function v3( v0 = 1";
code += "(function v6() {";
code += "for (let [a = v0] of [[]]) {";
code += "}})();";
assertThrows(code, SyntaxError);
