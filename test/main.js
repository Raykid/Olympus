var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../dist/Olympus.d.ts"/>
define("main", ["require", "exports", "core/Core", "view/View", "env/explorer/Explorer", "env/query/Query", "env/external/External", "env/hash/Hash", "engine/popup/PopupManager"], function (require, exports, Core_1, View_1, Explorer_1, Query_1, External_1, Hash_1, PopupManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * 测试项目
    */
    var core = global.Inject.getInject(Core_1.default);
    core.listen("fuck", handler, "this");
    core.dispatch("fuck");
    function handler(msg) {
        core.unlisten("fuck", handler, this);
    }
    var Fuck = (function () {
        function Fuck() {
        }
        __decorate([
            Inject(Core_1.default)
        ], Fuck.prototype, "core", void 0);
        Fuck = __decorate([
            Injectable
        ], Fuck);
        return Fuck;
    }());
    var Fuck2 = (function () {
        function Fuck2() {
        }
        __decorate([
            Inject(Fuck)
        ], Fuck2.prototype, "fuck", void 0);
        __decorate([
            Inject(Core_1.default)
        ], Fuck2.prototype, "core", void 0);
        __decorate([
            Inject(View_1.default)
        ], Fuck2.prototype, "view", void 0);
        __decorate([
            Inject(Explorer_1.default)
        ], Fuck2.prototype, "explorer", void 0);
        __decorate([
            Inject(Query_1.default)
        ], Fuck2.prototype, "query", void 0);
        __decorate([
            Inject(External_1.default)
        ], Fuck2.prototype, "external", void 0);
        __decorate([
            Inject(Hash_1.default)
        ], Fuck2.prototype, "hash", void 0);
        __decorate([
            Inject(PopupManager_1.default)
        ], Fuck2.prototype, "popupManager", void 0);
        return Fuck2;
    }());
    var fuck2 = new Fuck2();
    window["fuck2"] = fuck2;
    window["Fuck2"] = Fuck2;
    console.log(fuck2);
});
//# sourceMappingURL=main.js.map