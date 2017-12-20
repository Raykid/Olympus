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
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import { Inject } from "olympus-r/core/injector/Injector";
import ModuleManager from "olympus-r/engine/module/ModuleManager";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import Module from "olympus-r/engine/module/Module";
import { BindOn, BindIf, BindFor, BindValue, MessageHandler, GlobalMessageHandler, ResponseHandler, ModuleClass, DelegateMediator } from "olympus-r/engine/injector/Injector";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { audioManager } from "olympus-r/engine/audio/AudioManager";
import SecondModule from "./SecondModule";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import FuckModel, { IFuckModel } from "../models/FuckModel";
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
            fuckList: [1, 2, "shit", "you"],
            fuckText: "fuck you",
            onClick: function () {
                _this.viewModel.fuckText = "clicked";
                _this.moduleManager.open(SecondModule, null, true);
            },
            fuckModel: this.fuckModel1
        };
        audioManager.playMusic({
            url: "./test.mp3"
        });
        setTimeout(function () {
            _this.viewModel.fuckText = "1234";
            _this.viewModel.fuckList = ["hello", "world"];
            _this.fuckModel1.fuck = "You!!!";
        }, 3000);
        this.dispatch(new TestRequest());
    };
    FirstMediator.prototype.onModuleChange = function (to, from) {
        if (to == FirstModule)
            console.log("change to first module!");
        else if (to == SecondModule)
            console.log("change to second module!");
    };
    FirstMediator.prototype.onResponse = function (res, req) {
        alert("123");
    };
    __decorate([
        Inject,
        __metadata("design:type", ModuleManager)
    ], FirstMediator.prototype, "moduleManager", void 0);
    __decorate([
        Inject,
        __metadata("design:type", FuckModel)
    ], FirstMediator.prototype, "fuckModel1", void 0);
    __decorate([
        Inject,
        __metadata("design:type", IFuckModel)
    ], FirstMediator.prototype, "fuckModel2", void 0);
    __decorate([
        Inject(1),
        __metadata("design:type", IFuckModel)
    ], FirstMediator.prototype, "fuckModel3", void 0);
    __decorate([
        BindOn({ click: "onClick" }),
        BindIf("fuckText == '1234'"),
        __metadata("design:type", HTMLElement)
    ], FirstMediator.prototype, "btn", void 0);
    __decorate([
        BindFor("fuck in fuckList"),
        BindValue({ textContent: "fuck + ' - ' + fuckText + ' - 1'" }),
        __metadata("design:type", HTMLElement)
    ], FirstMediator.prototype, "txt", void 0);
    __decorate([
        BindValue("textContent", "fuckModel.fuck"),
        __metadata("design:type", HTMLElement)
    ], FirstMediator.prototype, "fuck", void 0);
    __decorate([
        MessageHandler(ModuleMessage.MODULE_CHANGE),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], FirstMediator.prototype, "onModuleChange", null);
    __decorate([
        ResponseHandler,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [TestResponse, TestRequest]),
        __metadata("design:returntype", void 0)
    ], FirstMediator.prototype, "onResponse", null);
    FirstMediator = __decorate([
        DOMMediatorClass("./modules/test.html")
    ], FirstMediator);
    return FirstMediator;
}(SceneMediator));
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
        DelegateMediator,
        __metadata("design:type", FirstMediator)
    ], FirstModule.prototype, "_mediator", void 0);
    __decorate([
        MessageHandler("fuck"),
        GlobalMessageHandler("fuck"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FirstModule.prototype, "onFuck", null);
    FirstModule = __decorate([
        ModuleClass
    ], FirstModule);
    return FirstModule;
}(Module));
export default FirstModule;
//# sourceMappingURL=FirstModule.js.map