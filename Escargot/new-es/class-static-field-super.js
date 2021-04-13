/* Copyright 2021-present Samsung Electronics Co., Ltd. and other contributors
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

Number.a = 100;

class ClassWithStaticField extends Number {
  static asdf1 = super.a
  static asdf2 = ()=>{ return super.a };
}

assert(ClassWithStaticField.asdf1 == 100)
assert(ClassWithStaticField.asdf2() == 100)


function foo() {
  class ClassWithStaticField extends Number {
    static asdf1 = super.a
    static asdf2 = ()=>{ return super.a };
  }

  foo.ClassWithStaticField = ClassWithStaticField
}
foo()

assert(foo.ClassWithStaticField.asdf1 == 100)
assert(foo.ClassWithStaticField.asdf2() == 100)

class ClassWithSelfReferenceStaticField {
  static field = new ClassWithSelfReferenceStaticField();
  static fieldMethod = ()=>{ return this.field }
}

assert(ClassWithSelfReferenceStaticField.field instanceof ClassWithSelfReferenceStaticField);
assert(ClassWithSelfReferenceStaticField.fieldMethod() instanceof ClassWithSelfReferenceStaticField);
assert(ClassWithSelfReferenceStaticField.fieldMethod() == ClassWithSelfReferenceStaticField.field);

function boo() {
  class ClassWithSelfReferenceStaticField {
    static field = new ClassWithSelfReferenceStaticField();
    static fieldMethod = ()=>{ return this.field }
  }

  boo.ClassWithSelfReferenceStaticField = ClassWithSelfReferenceStaticField;

  assert(ClassWithSelfReferenceStaticField.field instanceof ClassWithSelfReferenceStaticField);
  assert(ClassWithSelfReferenceStaticField.fieldMethod() instanceof ClassWithSelfReferenceStaticField);
  assert(ClassWithSelfReferenceStaticField.fieldMethod() == ClassWithSelfReferenceStaticField.field);
}
boo();
