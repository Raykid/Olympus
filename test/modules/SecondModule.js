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
import Module from "olympus-r/engine/module/Module";
import { ModuleClass, DelegateMediator, BindFunc, BindFor, BindValue, MessageHandler, GlobalMessageHandler, BindMessage, BindIf } from "olympus-r/engine/injector/Injector";
import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
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
            _this.dispatch("FuckMsg", "Shit!!!");
        });
        this.viewModel = {
            onMsg: function (msg) {
                // 表达式里使用函数可以在函数里执行复杂逻辑，并且具有代码提示
                console.log(msg);
                return msg + " - 1";
            },
            fuck: "you",
            fuckList: ["fuck", "shit", "you", "!!!"]
        };
        // 测试消息
        this.dispatch("fuck", 123);
    };
    __decorate([
        BindMessage("FuckMsg", { label: "onMsg($arguments[0])" }),
        BindFunc("getCurrentState", ["fuck", "onMsg", undefined]),
        __metadata("design:type", eui.Button)
    ], SecondMediator.prototype, "btn", void 0);
    __decorate([
        BindFor("i in fuckList"),
        BindIf("txt", "false"),
        BindValue("txt.text", "i"),
        BindFor("lst", "key in fuckList"),
        BindIf("txt", "false"),
        BindValue({
            txt: {
                text: "$target.$hashCode"
            }
        }),
        __metadata("design:type", eui.DataGroup)
    ], SecondMediator.prototype, "lst", void 0);
    SecondMediator = __decorate([
        EgretMediatorClass("Fuck2Skin")
    ], SecondMediator);
    return SecondMediator;
}(SceneMediator));
var SecondModule = /** @class */ (function (_super) {
    __extends(SecondModule, _super);
    function SecondModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecondModule.prototype.onFuck = function (a) {
        console.log("message at SecondModule: " + a);
    };
    __decorate([
        DelegateMediator,
        __metadata("design:type", SecondMediator)
    ], SecondModule.prototype, "_mediator", void 0);
    __decorate([
        MessageHandler("fuck"),
        GlobalMessageHandler("fuck"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SecondModule.prototype, "onFuck", null);
    SecondModule = __decorate([
        ModuleClass
    ], SecondModule);
    return SecondModule;
}(Module));
export default SecondModule;
//# sourceMappingURL=SecondModule.js.map