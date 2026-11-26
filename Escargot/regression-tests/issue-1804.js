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

// Samsung/escargot#1804
(function () {
    const handlers = {};
    handlers.onClick = function () {};

    class Widget {
        count = 0;
        static Options = class { static observedName = this.name; };
        static create = function () {};
        Item = class {};
        callback = () => {};
        named = function explicit() {};
        nested = [function () {}];
    }

    const widget = new Widget();
    assert(handlers.onClick.name === "");
    assert(Widget.Options.name === "Options");
    assert(Widget.Options.observedName === "Options");
    assert(Widget.create.name === "create");
    assert(widget.Item.name === "Item");
    assert(widget.callback.name === "callback");
    assert(widget.named.name === "explicit");
    assert(widget.nested[0].name === "");
})();
