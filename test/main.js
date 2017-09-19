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
define("modules/SecondModule", ["require", "exports", "engine/module/Module", "engine/injector/Injector"], function (require, exports, Module_1, Injector_1) {
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
        SecondModule = __decorate([
            Injector_1.ModuleClass
        ], SecondModule);
        return SecondModule;
    }(Module_1.default));
    exports.default = SecondModule;
});
define("modules/FirstModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "modules/SecondModule", "engine/module/ModuleMessage", "engine/injector/Injector", "core/injector/Injector", "engine/mediator/Mediator"], function (require, exports, Module_2, ModuleManager_1, SecondModule_1, ModuleMessage_1, Injector_2, Injector_3, Mediator_1) {
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
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._mediator = new FirstMediator();
            return _this;
        }
        FirstModule_1 = FirstModule;
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
                _this.moduleManager.open(SecondModule_1.default, null, true);
            }, 1000);
        };
        FirstModule.prototype.onModuleChange = function (from, to) {
            if (to == FirstModule_1)
                console.log("change to first module!");
            else if (to == SecondModule_1.default)
                console.log("change to second module!");
        };
        __decorate([
            Injector_3.Inject(ModuleManager_1.default)
        ], FirstModule.prototype, "moduleManager", void 0);
        __decorate([
            Injector_2.DelegateMediator
        ], FirstModule.prototype, "_mediator", void 0);
        __decorate([
            Injector_3.MessageHandler(ModuleMessage_1.default.MODULE_CHANGE)
        ], FirstModule.prototype, "onModuleChange", null);
        FirstModule = FirstModule_1 = __decorate([
            Injector_2.ModuleClass
        ], FirstModule);
        return FirstModule;
        var FirstModule_1;
    }(Module_2.default));
    exports.default = FirstModule;
    var FirstMediator = /** @class */ (function (_super) {
        __extends(FirstMediator, _super);
        function FirstMediator() {
            var _this = _super.call(this, document.createElement("a")) || this;
            _this.mapListener(_this.getSkin(), "click", function () {
                console.log("onclick");
            }, _this);
            _this.getSkin().textContent = "Fuck";
            _this.getBridge().getHTMLWrapper().appendChild(_this.getSkin());
            return _this;
        }
        FirstMediator = __decorate([
            Injector_2.MediatorClass
        ], FirstMediator);
        return FirstMediator;
    }(Mediator_1.default));
});
/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
define("main", ["require", "exports", "branches/dom/Bridge", "modules/FirstModule", "Olympus"], function (require, exports, Bridge_1, FirstModule_2, Olympus_1) {
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
    Olympus_1.default.startup(FirstModule_2.default, new Bridge_1.default("rootDOM"));
});
//# sourceMappingURL=main.js.map