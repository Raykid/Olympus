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
define("modules/SecondModule", ["require", "exports", "engine/scene/SceneMediator", "engine/module/Module", "core/injector/Injector", "engine/injector/Injector", "egret/injector/Injector"], function (require, exports, SceneMediator_1, Module_1, Injector_1, Injector_2, Injector_3) {
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
        SecondMediator.prototype.listAssets = function () {
            return ["preload"];
        };
        SecondMediator.prototype.onOpen = function () {
            var _this = this;
            this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, function () {
                // moduleManager.close(SecondModule);
                _this.dispatchModule("FuckMsg", "Shit!!!");
            });
            this.viewModel = {
                onMsg: function (msg) {
                    // 表达式里使用函数可以在函数里执行复杂逻辑，并且具有代码提示
                    console.log(msg);
                    return msg + " - 1";
                },
                fuck: "you"
            };
            // 测试系统消息
            this.dispatch("fuck", 123);
            // 测试模块消息
            this.dispatchModule("fuck", 123);
        };
        __decorate([
            Injector_2.BindModuleMessage("FuckMsg", { label: "onMsg($arguments[0])" }),
            Injector_2.BindFunc("getCurrentState", ["fuck", "onMsg", undefined]),
            __metadata("design:type", eui.Button)
        ], SecondMediator.prototype, "btn", void 0);
        SecondMediator = __decorate([
            Injector_3.EgretMediatorClass("Fuck2Skin")
        ], SecondMediator);
        return SecondMediator;
    }(SceneMediator_1.default));
    var SecondModule = /** @class */ (function (_super) {
        __extends(SecondModule, _super);
        function SecondModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SecondModule.prototype.onFuck = function (a) {
            console.log("message at SecondModule: " + a);
        };
        __decorate([
            Injector_2.DelegateMediator,
            __metadata("design:type", SecondMediator)
        ], SecondModule.prototype, "_mediator", void 0);
        __decorate([
            Injector_1.MessageHandler("fuck"),
            Injector_2.ModuleMessageHandler("fuck"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], SecondModule.prototype, "onFuck", null);
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
define("net/response/TestResponse", ["require", "exports", "net/type/Test", "engine/net/ResponseData", "engine/net/NetManager"], function (require, exports, Test_1, ResponseData_1, NetManager_1) {
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
define("net/request/TestRequest", ["require", "exports", "net/response/TestResponse", "engine/net/RequestData", "engine/net/policies/HTTPRequestPolicy"], function (require, exports, TestResponse_1, RequestData_1, HTTPRequestPolicy_1) {
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
define("models/FuckModel", ["require", "exports", "engine/injector/Injector", "core/injector/Injector", "engine/env/Hash"], function (require, exports, Injector_4, Injector_5, Hash_1) {
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
            var _this = _super.call(this) || this;
            console.log("Fuck Model Constructed!");
            return _this;
        }
        Object.defineProperty(FuckModel.prototype, "fuck", {
            get: function () {
                return "Fuck you";
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            Injector_5.Inject,
            __metadata("design:type", Hash_1.default)
        ], FuckModel.prototype, "hash", void 0);
        FuckModel = __decorate([
            Injector_4.ModelClass(1, IFuckModel),
            __metadata("design:paramtypes", [])
        ], FuckModel);
        return FuckModel;
    }(IFuckModel));
    exports.default = FuckModel;
});
define("modules/FirstModule", ["require", "exports", "modules/SecondModule", "net/response/TestResponse", "net/request/TestRequest", "models/FuckModel", "dom/injector/Injector", "engine/scene/SceneMediator", "core/injector/Injector", "engine/module/ModuleManager", "engine/audio/AudioManager", "engine/module/ModuleMessage", "engine/module/Module", "engine/injector/Injector"], function (require, exports, SecondModule_1, TestResponse_2, TestRequest_1, FuckModel_1, Injector_6, SceneMediator_2, Injector_7, ModuleManager_1, AudioManager_1, ModuleMessage_1, Module_2, Injector_8) {
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
            return ["./modules/test.html"];
        };
        FirstMediator.prototype.onOpen = function () {
            var _this = this;
            // this.mapListener(this.btn, "click", function():void
            // {
            //     this.txt.textContent = "Fuck you!!!";
            //     this.moduleManager.open(SecondModule);
            // }, this);
            console.log(this.fuckModel1.fuck, this.fuckModel1 === this.fuckModel2, this.fuckModel1 === this.fuckModel3);
            this.viewModel = {
                fuckText: "fuck you",
                onClick: function () {
                    _this.viewModel.fuckText = "clicked";
                    _this.moduleManager.open(SecondModule_1.default);
                }
            };
            AudioManager_1.audioManager.playMusic({
                url: "./test.mp3"
            });
            setTimeout(function () {
                _this.viewModel.fuckText = "1234";
            }, 3000);
        };
        FirstMediator.prototype.onModuleChange = function (to, from) {
            if (to == FirstModule)
                console.log("change to first module!");
            else if (to == SecondModule_1.default)
                console.log("change to second module!");
        };
        FirstMediator.prototype.onResponse = function (res, req) {
            alert("123");
        };
        __decorate([
            Injector_7.Inject,
            __metadata("design:type", ModuleManager_1.default)
        ], FirstMediator.prototype, "moduleManager", void 0);
        __decorate([
            Injector_7.Inject,
            __metadata("design:type", FuckModel_1.default)
        ], FirstMediator.prototype, "fuckModel1", void 0);
        __decorate([
            Injector_7.Inject,
            __metadata("design:type", FuckModel_1.IFuckModel)
        ], FirstMediator.prototype, "fuckModel2", void 0);
        __decorate([
            Injector_7.Inject(1),
            __metadata("design:type", FuckModel_1.IFuckModel)
        ], FirstMediator.prototype, "fuckModel3", void 0);
        __decorate([
            Injector_8.BindOn({ click: "onClick" }),
            Injector_8.BindIf({ "labelDisplay": "fuckText == '1234'" }),
            __metadata("design:type", eui.Button)
        ], FirstMediator.prototype, "btn", void 0);
        __decorate([
            Injector_8.BindValue({ textContent: "fuckText + ' - 1'" }),
            __metadata("design:type", eui.Label)
        ], FirstMediator.prototype, "txt", void 0);
        __decorate([
            Injector_7.MessageHandler(ModuleMessage_1.default.MODULE_CHANGE),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", void 0)
        ], FirstMediator.prototype, "onModuleChange", null);
        __decorate([
            Injector_8.ResponseHandler,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [TestResponse_2.default, TestRequest_1.default]),
            __metadata("design:returntype", void 0)
        ], FirstMediator.prototype, "onResponse", null);
        FirstMediator = __decorate([
            Injector_6.DOMMediatorClass("./modules/test.html")
        ], FirstMediator);
        return FirstMediator;
    }(SceneMediator_2.default));
    var FirstModule = /** @class */ (function (_super) {
        __extends(FirstModule, _super);
        function FirstModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FirstModule.prototype.listJsFiles = function () {
            return ["test1.js", "./test2.js"];
        };
        FirstModule.prototype.onFuck = function (a) {
            console.log("message at FirstModule: " + a);
        };
        __decorate([
            Injector_8.DelegateMediator,
            __metadata("design:type", FirstMediator)
        ], FirstModule.prototype, "_mediator", void 0);
        __decorate([
            Injector_7.MessageHandler("fuck"),
            Injector_8.ModuleMessageHandler("fuck"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], FirstModule.prototype, "onFuck", null);
        FirstModule = __decorate([
            Injector_8.ModuleClass
        ], FirstModule);
        return FirstModule;
    }(Module_2.default));
    exports.default = FirstModule;
});
/// <amd-module name="main"/>
/// <reference path="../trunk/dist/Olympus.d.ts"/>
/// <reference path="../branches/dom/dist/DOM.d.ts"/>
/// <reference path="../branches/egret/dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>
define("main", ["require", "exports", "utils/InitParamsUtil", "modules/FirstModule", "Olympus", "engine/env/Environment", "DOMBridge", "EgretBridge"], function (require, exports, InitParamsUtil_1, FirstModule_1, Olympus_1, Environment_1, DOMBridge_1, EgretBridge_1) {
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
        pathDict: {
            a: "test1.js",
            b: "test2.js"
        },
        preloads: ["a", "b"],
        onInited: function () {
            // bridgeManager.getBridge("Egret").defaultScenePolicy = none;
        }
    });
    console.log(Environment_1.environment.env, Environment_1.environment.getHost(), Environment_1.environment.curCDNHost);
});
//# sourceMappingURL=main.js.map