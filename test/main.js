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
define("modules/SecondModule", ["require", "exports", "engine/module/Module", "Injector"], function (require, exports, Module_1, Injector_1) {
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
define("modules/FirstModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "modules/SecondModule", "engine/module/ModuleMessage", "engine/mediator/Mediator", "Injector"], function (require, exports, Module_2, ModuleManager_1, SecondModule_1, ModuleMessage_1, Mediator_1, Injector_2) {
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
            console.log("first module activate");
        };
        FirstModule.prototype.onModuleChange = function (from, to) {
            if (to == FirstModule_1)
                console.log("change to first module!");
            else if (to == SecondModule_1.default)
                console.log("change to second module!");
        };
        __decorate([
            Injector_2.DelegateMediator
        ], FirstModule.prototype, "_mediator", void 0);
        __decorate([
            Injector_2.MessageHandler(ModuleMessage_1.default.MODULE_CHANGE)
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
            var _this = this;
            var fuck = new Fuck();
            _this = _super.call(this, fuck) || this;
            _this.mapListener(fuck.btn, egret.TouchEvent.TOUCH_TAP, function () {
                fuck.txt.text = "Fuck you!!!";
                _this.moduleManager.open(SecondModule_1.default, null, true);
            }, _this);
            _this.bridge.addChild(_this.bridge.sceneLayer, fuck);
            return _this;
        }
        __decorate([
            Injector_2.Inject(ModuleManager_1.default)
        ], FirstMediator.prototype, "moduleManager", void 0);
        FirstMediator = __decorate([
            Injector_2.MediatorClass
        ], FirstMediator);
        return FirstMediator;
    }(Mediator_1.default));
    var Fuck = /** @class */ (function (_super) {
        __extends(Fuck, _super);
        function Fuck() {
            var _this = _super.call(this) || this;
            _this.skinName = FuckSkin;
            return _this;
        }
        return Fuck;
    }(eui.Component));
});
/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
/// <reference path="../dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>
define("main", ["require", "exports", "branches/dom/Bridge", "branches/egret/Bridge", "modules/FirstModule", "Olympus"], function (require, exports, Bridge_1, Bridge_2, FirstModule_2, Olympus_1) {
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
    Olympus_1.default.startup(FirstModule_2.default, new Bridge_1.default("rootDOM"), new Bridge_2.default({
        width: 720,
        height: 1280,
        pathPrefix: "egret/",
        container: "rootEgret",
        backgroundColor: 0,
        scaleMode: egret.StageScaleMode.SHOW_ALL
    }));
});
//# sourceMappingURL=main.js.map