var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("modules/SecondModule", ["require", "exports", "engine/module/Module"], function (require, exports, Module_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 测试第二个模块
    */
    var SecondModule = /** @class */ (function (_super) {
        __extends(SecondModule, _super);
        function SecondModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SecondModule.prototype.onOpen = function (data) {
            console.log("second module open");
        };
        SecondModule.prototype.onGetResponses = function (responses) {
            console.log("second module gotResponse");
        };
        SecondModule.prototype.onActivate = function (from, data) {
            console.log("second module activate");
        };
        return SecondModule;
    }(Module_1.default));
    exports.default = SecondModule;
});
define("modules/FirstModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "modules/SecondModule"], function (require, exports, Module_2, ModuleManager_1, SecondModule_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 测试首个模块
    */
    var FirstModule = /** @class */ (function (_super) {
        __extends(FirstModule, _super);
        function FirstModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FirstModule.prototype.onOpen = function (data) {
            console.log("first module open");
        };
        FirstModule.prototype.onGetResponses = function (responses) {
            console.log("first module gotResponse");
        };
        FirstModule.prototype.onActivate = function (from, data) {
            var _this = this;
            console.log("first module activate");
            setTimeout(function () {
                _this.moduleManager.open(SecondModule_1.default);
            }, 1000);
        };
        __decorate([
            inject(ModuleManager_1.default)
        ], FirstModule.prototype, "moduleManager", void 0);
        FirstModule = __decorate([
            module
        ], FirstModule);
        return FirstModule;
    }(Module_2.default));
    exports.default = FirstModule;
});
/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
define("main", ["require", "exports", "branches/dom/Bridge", "modules/FirstModule", "Olympus"], function (require, exports, Bridge_1, FirstModule_1, Olympus_1) {
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
    Olympus_1.default.startup(FirstModule_1.default, new Bridge_1.default("rootDOM"));
});
//# sourceMappingURL=main.js.map