var err;
try {
    eval("const v0 = /(?<v>>||||`|^||||||||||(?<c>(?<d>.)?).)+(?<c>(?<d>.D*))\b/dsyig; v0.kwstIndex = '2'; v0.test('nud;');");
} catch (e) {
err =e;
}

assert(err instanceof SyntaxError);
