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
define("utils/InitParamsUtil", ["require", "exports", "engine/env/WindowExternal", "engine/env/Query"], function (require, exports, WindowExternal_1, Query_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 初始参数工具，先从windowExternal取，取不到再从query里取
    */
    function getParam(key) {
        return (WindowExternal_1.windowExternal.getParam(key) || Query_1.query.getParam(key));
    }
    exports.default = getParam;
});
define("modules/SecondModule", ["require", "exports", "engine/module/Module", "Injector", "egret/scene/SceneMediator", "engine/module/ModuleManager"], function (require, exports, Module_1, Injector_1, SceneMediator_1, ModuleManager_1) {
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
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._mediator = new SecondMediator();
            return _this;
        }
        __decorate([
            Injector_1.DelegateMediator
        ], SecondModule.prototype, "_mediator", void 0);
        return SecondModule;
    }(Module_1.default));
    exports.default = SecondModule;
    var SecondMediator = /** @class */ (function (_super) {
        __extends(SecondMediator, _super);
        function SecondMediator() {
            return _super.call(this, Fuck2Skin) || this;
        }
        SecondMediator.prototype.onBeforeIn = function () {
            this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, function () {
                ModuleManager_1.moduleManager.close(SecondModule);
            });
        };
        SecondMediator = __decorate([
            Injector_1.MediatorClass
        ], SecondMediator);
        return SecondMediator;
    }(SceneMediator_1.default));
});
define("modules/FirstModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "modules/SecondModule", "engine/module/ModuleMessage", "Injector", "egret/scene/SceneMediator"], function (require, exports, Module_2, ModuleManager_2, SecondModule_1, ModuleMessage_1, Injector_2, SceneMediator_2) {
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
        __decorate([
            Injector_2.DelegateMediator
        ], FirstModule.prototype, "_mediator", void 0);
        return FirstModule;
    }(Module_2.default));
    exports.default = FirstModule;
    var FirstMediator = /** @class */ (function (_super) {
        __extends(FirstMediator, _super);
        function FirstMediator() {
            return _super.call(this, FuckSkin) || this;
        }
        FirstMediator.prototype.listAssets = function () {
            return ["preload"];
        };
        FirstMediator.prototype.onBeforeIn = function () {
            var _this = this;
            this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, function () {
                _this.txt.text = "Fuck you!!!";
                _this.moduleManager.open(SecondModule_1.default);
            }, this);
        };
        FirstMediator.prototype.onModuleChange = function (from, to) {
            if (to == FirstModule)
                console.log("change to first module!");
            else if (to == SecondModule_1.default)
                console.log("change to second module!");
        };
        __decorate([
            Injector_2.Inject(ModuleManager_2.default)
        ], FirstMediator.prototype, "moduleManager", void 0);
        __decorate([
            Injector_2.MessageHandler(ModuleMessage_1.default.MODULE_CHANGE)
        ], FirstMediator.prototype, "onModuleChange", null);
        FirstMediator = __decorate([
            Injector_2.MediatorClass
        ], FirstMediator);
        return FirstMediator;
    }(SceneMediator_2.default));
});
/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
/// <reference path="../dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>
define("main", ["require", "exports", "DOMBridge", "EgretBridge", "Olympus", "engine/env/Environment", "utils/InitParamsUtil", "modules/FirstModule"], function (require, exports, DOMBridge_1, EgretBridge_1, Olympus_1, Environment_1, InitParamsUtil_1, FirstModule_1) {
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
    Olympus_1.default.startup({
        bridges: [
            new DOMBridge_1.default("rootDOM"),
            new EgretBridge_1.default({
                width: 720,
                height: 1280,
                pathPrefix: "egret/",
                container: "rootEgret",
                backgroundColor: 0,
                scaleMode: egret.StageScaleMode.SHOW_ALL
            })
        ],
        firstModule: FirstModule_1.default,
        loadElement: "loading",
        env: InitParamsUtil_1.default("server_type"),
        hostsDict: {
            dev: ["http://www.test.17zuoye.net/"],
            test: ["https://www.test.17zuoye.net/"],
            staging: ["https://www.staging.17zuoye.net/"],
            prod: ["https://www.17zuoye.com/"]
        },
        cdnsDict: {
            test: ["https://cdn-cnc.test.17zuoye.net/"],
            staging: ["https://cdn-cnc.staging.17zuoye.net/"],
            prod: ["https://cdn-cnc.17zuoye.com/"]
        }
    });
    console.log(Environment_1.environment.env, Environment_1.environment.getHost(), Environment_1.environment.curCDNHost);
});
//# sourceMappingURL=main.js.map