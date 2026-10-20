/* Copyright 2026-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// https://github.com/Samsung/escargot/issues/1730
new class { constructor() { class D { static { assert(this === D); } } } };
new class { constructor() { class D { static x = this; } assert(D.x === D); } };
new class extends Object {
    constructor() {
        class Base { static get self() { return this; } }
        class D extends Base {
            static field = (() => this)();
            static inherited = super.self;
            static evaluated = eval("this");
            static {
                assert(this === D && super.self === D);
                this.saved = () => this;
            }
        }
        assert(D.field === D && D.inherited === D && D.evaluated === D);
        assert(D.saved() === D);
        var readOuter = () => this;
        assertThrows(readOuter, ReferenceError);
        super();
        assert(readOuter() === this);
    }
};
