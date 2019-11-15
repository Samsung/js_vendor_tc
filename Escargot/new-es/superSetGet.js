/* Copyright 2019-present Samsung Electronics Co., Ltd. and other contributors
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

var proto = {
    _x: null,
    _y: null,
    get x() {
        return this._x;
    },
    set x(value) {
        return this._x = value;
    },
    get y() {
        return this._y;
    },
    set y(value) {
        return this._y = value;
    }
};

var object = {
    get x() {
        return super.x;
    },
    set x(value) {
        super.x = value;
    },
    get y() {
        return super.y;
    },
    set y(value) {
        super.y = value;
    }
};

Object.setPrototypeOf(object, proto);

object.x = 1;
object.y = 2;
proto.x = 0;
proto.y = 0;
assert(object.x == 1);
assert(object.y == 2);
assert(object._x == 1);
assert(object._y == 2);
assert(proto.x == 0);
assert(proto.y == 0);
assert(proto._x == 0);
assert(proto._y == 0);

object._x = 3;
object._y = 4;
proto._x = -1;
proto._y = -1;
assert(object.x == 3);
assert(object.y == 4);
assert(object._x == 3);
assert(object._y == 4);
assert(proto.x == -1);
assert(proto.y == -1);
assert(proto._x == -1);
assert(proto._y == -1);
