/* Copyright 2023-present Samsung Electronics Co., Ltd. and other contributors
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
// Crash with ObjectStructureWithMap and inline cache

function createBigObject()
{
    let obj = {
        a1: 10, a2: 10, a3: 10, a4: 10, a5: 10, a6: 10, a7: 10, a8: 10, a9: 10, a10: 10,
        a11: 10, a12: 10, a13: 10, a14: 10, a15: 10, a16: 10, a17: 10, a18: 10, a19: 10, a10: 20,
        a21: 10, a22: 10, a23: 10, a24: 10, a25: 10, a26: 10, a27: 10, a28: 10, a29: 10, a10: 30,
        a31: 10, a32: 10, a33: 10, a34: 10, a35: 10, a36: 10, a37: 10, a38: 10, a39: 10, a10: 40,
        a41: 10, a42: 10, a43: 10, a44: 10, a45: 10, a46: 10, a47: 10, a48: 10, a49: 10, a10: 50,
        a51: 10, a52: 10, a53: 10, a54: 10, a55: 10, a56: 10, a57: 10, a58: 10, a59: 10, a10: 60,
        a61: 10, a62: 10, a63: 10, a64: 10, a65: 10, a66: 10, a67: 10, a68: 10, a69: 10, a10: 70,
        a71: 10, a72: 10, a73: 10, a74: 10, a75: 10, a76: 10, a77: 10, a78: 10, a79: 10, a10: 80,
        a81: 10, a82: 10, a83: 10, a84: 10, a85: 10, a86: 10, a87: 10, a88: 10, a89: 10, a10: 90,
        a91: 10, a92: 10, a93: 10, a94: 10, a95: 10, a96: 10, a97: 10, a98: 10, a99: 10, a10: 100,
        a101: 10
    }
    return obj;
}

function readA(a)
{
    return a.a;
}

createBigObject()
createBigObject()
createBigObject()
createBigObject()
createBigObject()

function test()
{
    let obj = createBigObject()
    for (let i = 0; i < 100; i ++) {
        if (i == 90) {
            delete obj.a1
            obj = createBigObject()
        }
    }
    return obj.a1
}

assert(test() == 10);
