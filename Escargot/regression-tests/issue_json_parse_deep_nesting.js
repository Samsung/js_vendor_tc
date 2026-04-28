let s = "";
const N = 100000;
for (let i = 0; i < N; i++) s += "[";
for (let i = 0; i < N; i++) s += "]";
JSON.parse(s);
