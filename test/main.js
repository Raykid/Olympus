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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
define("modules/SecondModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "engine/scene/SceneMediator", "egret/injector/Injector", "engine/injector/Injector"], function (require, exports, Module_1, ModuleManager_1, SceneMediator_1, Injector_1, Injector_2) {
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
    var SecondMediator = /** @class */ (function (_super) {
        __extends(SecondMediator, _super);
        function SecondMediator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SecondMediator.prototype.onOpen = function () {
            this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, function () {
                ModuleManager_1.moduleManager.close(SecondModule);
            });
        };
        SecondMediator = __decorate([
            Injector_1.EgretMediatorClass("Fuck2Skin")
        ], SecondMediator);
        return SecondMediator;
    }(SceneMediator_1.default));
    var SecondModule = /** @class */ (function (_super) {
        __extends(SecondModule, _super);
        function SecondModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        __decorate([
            Injector_2.DelegateMediator,
            __metadata("design:type", SecondMediator)
        ], SecondModule.prototype, "_mediator", void 0);
        SecondModule = __decorate([
            Injector_2.ModuleClass
        ], SecondModule);
        return SecondModule;
    }(Module_1.default));
    exports.default = SecondModule;
});
define("net/type/Test", ["require", "exports", "engine/net/DataType"], function (require, exports, DataType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author TemplateGenerator
     * @email initial_r@qq.com
     * @modify date 10/9/2017
     *
     * 测试
    */
    var Test = /** @class */ (function (_super) {
        __extends(Test, _super);
        function Test() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Test.prototype.doParse = function (data) {
            if (data == null)
                return;
            this.test = data.test;
        };
        Test.prototype.pack = function () {
            return {
                test: this.test
            };
        };
        return Test;
    }(DataType_1.default));
    exports.default = Test;
});
define("net/response/TestResponse", ["require", "exports", "engine/net/ResponseData", "engine/net/NetManager", "net/type/Test"], function (require, exports, ResponseData_1, NetManager_1, Test_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author TemplateGenerator
     * @email initial_r@qq.com
     * @modify date 10/9/2017
     *
     * 测试
    */
    var TestResponse = /** @class */ (function (_super) {
        __extends(TestResponse, _super);
        function TestResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(TestResponse.prototype, "__params", {
            get: function () {
                return {
                    type: "Test",
                    protocol: "http",
                    method: "GET"
                };
            },
            enumerable: true,
            configurable: true
        });
        ;
        TestResponse.prototype.doParse = function (data) {
            if (data == null)
                return;
            this.__params.success = data.success;
            this.test = new Test_1.default().parse(data.test);
        };
        TestResponse.prototype.pack = function () {
            return {
                test: this.test.pack()
            };
        };
        TestResponse.type = "Test";
        return TestResponse;
    }(ResponseData_1.default));
    exports.default = TestResponse;
    /** 注册返回体 */
    NetManager_1.netManager.registerResponse(TestResponse);
});
define("net/request/TestRequest", ["require", "exports", "engine/net/RequestData", "engine/net/policies/HTTPRequestPolicy", "net/response/TestResponse"], function (require, exports, RequestData_1, HTTPRequestPolicy_1, TestResponse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author TemplateGenerator
     * @email initial_r@qq.com
     * @modify date 10/9/2017
     *
     * 测试
    */
    var TestRequest = /** @class */ (function (_super) {
        __extends(TestRequest, _super);
        function TestRequest() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.__policy = HTTPRequestPolicy_1.default;
            return _this;
        }
        Object.defineProperty(TestRequest.prototype, "__params", {
            get: function () {
                return {
                    type: "Test",
                    path: "/test",
                    protocol: "http",
                    response: TestResponse_1.default,
                    data: {
                        test: this.test // string - 测试
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        ;
        return TestRequest;
    }(RequestData_1.default));
    exports.default = TestRequest;
});
define("models/FuckModel", ["require", "exports", "engine/injector/Injector", "core/injector/Injector", "engine/env/Hash"], function (require, exports, Injector_3, Injector_4, Hash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IFuckModel = /** @class */ (function () {
        function IFuckModel() {
        }
        Object.defineProperty(IFuckModel.prototype, "fuck", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        return IFuckModel;
    }());
    exports.IFuckModel = IFuckModel;
    var FuckModel = /** @class */ (function (_super) {
        __extends(FuckModel, _super);
        function FuckModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(FuckModel.prototype, "fuck", {
            get: function () {
                return "Fuck you";
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            Injector_4.Inject,
            __metadata("design:type", Hash_1.default)
        ], FuckModel.prototype, "hash", void 0);
        FuckModel = __decorate([
            Injector_3.ModelClass(IFuckModel)
        ], FuckModel);
        return FuckModel;
    }(IFuckModel));
    exports.default = FuckModel;
});
define("modules/FirstModule", ["require", "exports", "engine/module/Module", "engine/module/ModuleManager", "egret/injector/Injector", "core/injector/Injector", "engine/injector/Injector", "modules/SecondModule", "engine/module/ModuleMessage", "engine/scene/SceneMediator", "net/response/TestResponse", "net/request/TestRequest", "models/FuckModel"], function (require, exports, Module_2, ModuleManager_2, Injector_5, Injector_6, Injector_7, SecondModule_1, ModuleMessage_1, SceneMediator_2, TestResponse_2, TestRequest_1, FuckModel_1) {
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
    var FirstMediator = /** @class */ (function (_super) {
        __extends(FirstMediator, _super);
        function FirstMediator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FirstMediator.prototype.listAssets = function () {
            return ["preload"];
        };
        FirstMediator.prototype.onOpen = function () {
            this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, function () {
                this.txt.test = "Fuck you!!!";
                this.moduleManager.open(SecondModule_1.default);
            }, this);
            console.log(this.fuckModel.fuck);
        };
        FirstMediator.prototype.onModuleChange = function (from, to) {
            if (to == FirstModule)
                console.log("change to first module!");
            else if (to == SecondModule_1.default)
                console.log("change to second module!");
        };
        FirstMediator.prototype.onResponse = function (res, req) {
            alert("123");
        };
        __decorate([
            Injector_6.Inject,
            __metadata("design:type", ModuleManager_2.default)
        ], FirstMediator.prototype, "moduleManager", void 0);
        __decorate([
            Injector_6.Inject,
            __metadata("design:type", FuckModel_1.IFuckModel)
        ], FirstMediator.prototype, "fuckModel", void 0);
        __decorate([
            Injector_6.MessageHandler(ModuleMessage_1.default.MODULE_CHANGE),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", void 0)
        ], FirstMediator.prototype, "onModuleChange", null);
        __decorate([
            Injector_7.ResponseHandler,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [TestResponse_2.default, TestRequest_1.default]),
            __metadata("design:returntype", void 0)
        ], FirstMediator.prototype, "onResponse", null);
        FirstMediator = __decorate([
            Injector_5.EgretMediatorClass("FuckSkin")
        ], FirstMediator);
        return FirstMediator;
    }(SceneMediator_2.default));
    var FirstModule = /** @class */ (function (_super) {
        __extends(FirstModule, _super);
        function FirstModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        __decorate([
            Injector_7.DelegateMediator,
            __metadata("design:type", FirstMediator)
        ], FirstModule.prototype, "_mediator", void 0);
        FirstModule = __decorate([
            Injector_7.ModuleClass
        ], FirstModule);
        return FirstModule;
    }(Module_2.default));
    exports.default = FirstModule;
});
/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
/// <reference path="../dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>
define("main", ["require", "exports", "DOMBridge", "EgretBridge", "Olympus", "engine/env/Environment", "utils/InitParamsUtil", "modules/FirstModule", "net/request/TestRequest", "core/Core"], function (require, exports, DOMBridge_1, EgretBridge_1, Olympus_1, Environment_1, InitParamsUtil_1, FirstModule_1, TestRequest_2, Core_1) {
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
            new DOMBridge_1.default({
                container: "#rootDOM"
            }),
            new EgretBridge_1.default({
                width: 720,
                height: 1280,
                pathPrefix: "egret/",
                container: "#rootEgret",
                backgroundColor: 0,
            })
        ],
        firstModule: FirstModule_1.default,
        loadElement: "#loading",
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
        },
        onInited: function () {
            // bridgeManager.getBridge("Egret").defaultScenePolicy = none;
        }
    });
    console.log(Environment_1.environment.env, Environment_1.environment.getHost(), Environment_1.environment.curCDNHost);
    var req = new TestRequest_2.default();
    req.test = "Fuck you";
    Core_1.core.dispatch(req);
});
//# sourceMappingURL=main.js.map