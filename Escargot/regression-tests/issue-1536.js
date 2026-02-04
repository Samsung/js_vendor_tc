/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let code = `
const caesarCipher=(r,t)=>{const e=t%26,o=e>0?e:26+e;let n="";for(let t=0;t<r.length;t++){const e=r[t],C=r.charCodeAt(t);n+=C>=65&&C<=90?String.fromCharCode((C-65+o)%26+65):C>=97&&C<=122?String.fromCharCode((C-97+o)%26+97):e}return n};
let msg = "hello world"
msg = caesarCipher(msg, 3)
msg = caesarCipher(msg, -3)
`
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")
for (let i = 0; i < 200; i ++) {
  evalOnThreadAndWait(code, 10);
}
print(processMemoryUsage()/1024+"kB")

assert(processMemoryUsage() < 512*1024*1024);
