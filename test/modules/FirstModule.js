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
import SecondModule from "./SecondModule";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import FuckModel, { IFuckModel } from "../models/FuckModel";
import SceneMediator from 'olympus-r/engine/scene/SceneMediator';
import { Inject } from "olympus-r/core/injector/Injector";
import ModuleManager from "olympus-r/engine/module/ModuleManager";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import Module from "olympus-r/engine/module/Module";
import { BindOn, BindIf, BindFor, BindValue, MessageHandler, GlobalMessageHandler, ResponseHandler, ModuleClass, DelegateMediator } from "olympus-r/engine/injector/Injector";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { audioManager } from "olympus-r/engine/audio/AudioManager";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlyc3RNb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJGaXJzdE1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxZQUFZLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxXQUFXLE1BQU0sNEJBQTRCLENBQUM7QUFDckQsT0FBTyxTQUFTLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1RCxPQUFPLGFBQWEsTUFBTSxzQ0FBc0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDMUQsT0FBTyxhQUFhLE1BQU0sdUNBQXVDLENBQUM7QUFDbEUsT0FBTyxhQUFhLE1BQU0sdUNBQXVDLENBQUM7QUFDbEUsT0FBTyxNQUFNLE1BQU0sZ0NBQWdDLENBQUM7QUFDcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzlLLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUVuRTs7Ozs7OztFQU9FO0FBR0Y7SUFBNEIsaUNBQWE7SUFBekM7O0lBcUVBLENBQUM7SUFqRFUsa0NBQVUsR0FBakI7UUFFSSxNQUFNLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSw4QkFBTSxHQUFiO1FBQUEsaUJBOEJDO1FBNUJHLHNEQUFzRDtRQUN0RCxJQUFJO1FBQ0osNENBQTRDO1FBQzVDLDZDQUE2QztRQUM3QyxZQUFZO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJ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QixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFaRDtRQURDLGdCQUFnQjtrQ0FDQyxhQUFhO2tEQUFDO0lBU2hDO1FBRkMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUN0QixvQkFBb0IsQ0FBQyxNQUFNLENBQUM7Ozs7NkNBSTVCO0lBZmdCLFdBQVc7UUFEL0IsV0FBVztPQUNTLFdBQVcsQ0FnQi9CO0lBQUQsa0JBQUM7Q0FBQSxBQWhCRCxDQUF5QyxNQUFNLEdBZ0I5QztlQWhCb0IsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWNvbmRNb2R1bGUgZnJvbSBcIi4vU2Vjb25kTW9kdWxlXCI7XHJcbmltcG9ydCBUZXN0UmVzcG9uc2UgZnJvbSBcIi4uL25ldC9yZXNwb25zZS9UZXN0UmVzcG9uc2VcIjtcclxuaW1wb3J0IFRlc3RSZXF1ZXN0IGZyb20gXCIuLi9uZXQvcmVxdWVzdC9UZXN0UmVxdWVzdFwiO1xyXG5pbXBvcnQgRnVja01vZGVsLCB7IElGdWNrTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxzL0Z1Y2tNb2RlbFwiO1xyXG5pbXBvcnQgU2NlbmVNZWRpYXRvciBmcm9tICdvbHltcHVzLXIvZW5naW5lL3NjZW5lL1NjZW5lTWVkaWF0b3InO1xyXG5pbXBvcnQgeyBJbmplY3QgfSBmcm9tIFwib2x5bXB1cy1yL2NvcmUvaW5qZWN0b3IvSW5qZWN0b3JcIjtcclxuaW1wb3J0IE1vZHVsZU1hbmFnZXIgZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvbW9kdWxlL01vZHVsZU1hbmFnZXJcIjtcclxuaW1wb3J0IE1vZHVsZU1lc3NhZ2UgZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvbW9kdWxlL01vZHVsZU1lc3NhZ2VcIjtcclxuaW1wb3J0IE1vZHVsZSBmcm9tIFwib2x5bXB1cy1yL2VuZ2luZS9tb2R1bGUvTW9kdWxlXCI7XHJcbmltcG9ydCB7IEJpbmRPbiwgQmluZElmLCBCaW5kRm9yLCBCaW5kVmFsdWUsIE1lc3NhZ2VIYW5kbGVyLCBHbG9iYWxNZXNzYWdlSGFuZGxlciwgUmVzcG9uc2VIYW5kbGVyLCBNb2R1bGVDbGFzcywgRGVsZWdhdGVNZWRpYXRvciB9IGZyb20gXCJvbHltcHVzLXIvZW5naW5lL2luamVjdG9yL0luamVjdG9yXCI7XHJcbmltcG9ydCB7IERPTU1lZGlhdG9yQ2xhc3MgfSBmcm9tIFwib2x5bXB1cy1yLWRvbS9kb20vaW5qZWN0b3IvSW5qZWN0b3JcIjtcclxuaW1wb3J0IHsgYXVkaW9NYW5hZ2VyIH0gZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvYXVkaW8vQXVkaW9NYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICogQGF1dGhvciBSYXlraWRcclxuICogQGVtYWlsIGluaXRpYWxfckBxcS5jb21cclxuICogQGNyZWF0ZSBkYXRlIDIwMTctMDktMThcclxuICogQG1vZGlmeSBkYXRlIDIwMTctMDktMThcclxuICogXHJcbiAqIOa1i+ivlemmluS4quaooeWdl1xyXG4qL1xyXG5cclxuQERPTU1lZGlhdG9yQ2xhc3MoXCIuL21vZHVsZXMvdGVzdC5odG1sXCIpXHJcbmNsYXNzIEZpcnN0TWVkaWF0b3IgZXh0ZW5kcyBTY2VuZU1lZGlhdG9yXHJcbntcclxuICAgIEBJbmplY3RcclxuICAgIHByaXZhdGUgbW9kdWxlTWFuYWdlcjpNb2R1bGVNYW5hZ2VyO1xyXG4gICAgQEluamVjdFxyXG4gICAgcHJpdmF0ZSBmdWNrTW9kZWwxOkZ1Y2tNb2RlbDtcclxuICAgIEBJbmplY3RcclxuICAgIHByaXZhdGUgZnVja01vZGVsMjpJRnVja01vZGVsO1xyXG4gICAgQEluamVjdCgxKVxyXG4gICAgcHJpdmF0ZSBmdWNrTW9kZWwzOklGdWNrTW9kZWw7XHJcblxyXG4gICAgQEJpbmRPbih7Y2xpY2s6IFwib25DbGlja1wifSlcclxuICAgIEBCaW5kSWYoXCJmdWNrVGV4dCA9PSAnMTIzNCdcIilcclxuICAgIHB1YmxpYyBidG46SFRNTEVsZW1lbnRcclxuICAgIEBCaW5kRm9yKFwiZnVjayBpbiBmdWNrTGlzdFwiKVxyXG4gICAgQEJpbmRWYWx1ZSh7dGV4dENvbnRlbnQ6IFwiZnVjayArICcgLSAnICsgZnVja1RleHQgKyAnIC0gMSdcIn0pXHJcbiAgICBwdWJsaWMgdHh0OkhUTUxFbGVtZW50O1xyXG4gICAgQEJpbmRWYWx1ZShcInRleHRDb250ZW50XCIsIFwiZnVja01vZGVsLmZ1Y2tcIilcclxuICAgIHB1YmxpYyBmdWNrOkhUTUxFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBsaXN0QXNzZXRzKCk6c3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gW1wiLi9tb2R1bGVzL3Rlc3QuaHRtbFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25PcGVuKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8vIHRoaXMubWFwTGlzdGVuZXIodGhpcy5idG4sIFwiY2xpY2tcIiwgZnVuY3Rpb24oKTp2b2lkXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICB0aGlzLnR4dC50ZXh0Q29udGVudCA9IFwiRnVjayB5b3UhISFcIjtcclxuICAgICAgICAvLyAgICAgdGhpcy5tb2R1bGVNYW5hZ2VyLm9wZW4oU2Vjb25kTW9kdWxlKTtcclxuICAgICAgICAvLyB9LCB0aGlzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZ1Y2tNb2RlbDEuZnVjaywgdGhpcy5mdWNrTW9kZWwxID09PSB0aGlzLmZ1Y2tNb2RlbDIsIHRoaXMuZnVja01vZGVsMSA9PT0gdGhpcy5mdWNrTW9kZWwzKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSB7XHJcbiAgICAgICAgICAgIGZ1Y2tMaXN0OiBbMSwgMiwgXCJzaGl0XCIsIFwieW91XCJdLFxyXG4gICAgICAgICAgICBmdWNrVGV4dDogXCJmdWNrIHlvdVwiLFxyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3TW9kZWwuZnVja1RleHQgPSBcImNsaWNrZWRcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlTWFuYWdlci5vcGVuKFNlY29uZE1vZHVsZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1Y2tNb2RlbDogdGhpcy5mdWNrTW9kZWwxXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgYXVkaW9NYW5hZ2VyLnBsYXlNdXNpYyh7XHJcbiAgICAgICAgICAgIHVybDogXCIuL3Rlc3QubXAzXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5mdWNrVGV4dCA9IFwiMTIzNFwiO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5mdWNrTGlzdCA9IFtcImhlbGxvXCIsIFwid29ybGRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZnVja01vZGVsMS5mdWNrID0gXCJZb3UhISFcIjtcclxuICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaChuZXcgVGVzdFJlcXVlc3QoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIEBNZXNzYWdlSGFuZGxlcihNb2R1bGVNZXNzYWdlLk1PRFVMRV9DSEFOR0UpXHJcbiAgICBwcml2YXRlIG9uTW9kdWxlQ2hhbmdlKHRvOmFueSwgZnJvbTphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0byA9PSBGaXJzdE1vZHVsZSkgY29uc29sZS5sb2coXCJjaGFuZ2UgdG8gZmlyc3QgbW9kdWxlIVwiKTtcclxuICAgICAgICBlbHNlIGlmKHRvID09IFNlY29uZE1vZHVsZSkgY29uc29sZS5sb2coXCJjaGFuZ2UgdG8gc2Vjb25kIG1vZHVsZSFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgQFJlc3BvbnNlSGFuZGxlclxyXG4gICAgcHJpdmF0ZSBvblJlc3BvbnNlKHJlczpUZXN0UmVzcG9uc2UsIHJlcTpUZXN0UmVxdWVzdCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGFsZXJ0KFwiMTIzXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5ATW9kdWxlQ2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlyc3RNb2R1bGUgZXh0ZW5kcyBNb2R1bGVcclxue1xyXG4gICAgQERlbGVnYXRlTWVkaWF0b3JcclxuICAgIHByaXZhdGUgX21lZGlhdG9yOkZpcnN0TWVkaWF0b3I7XHJcblxyXG4gICAgcHVibGljIGxpc3RKc0ZpbGVzKCk6c3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gW1widGVzdDEuanNcIiwgXCIuL3Rlc3QyLmpzXCJdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBATWVzc2FnZUhhbmRsZXIoXCJmdWNrXCIpXHJcbiAgICBAR2xvYmFsTWVzc2FnZUhhbmRsZXIoXCJmdWNrXCIpXHJcbiAgICBwcml2YXRlIG9uRnVjayhhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlIGF0IEZpcnN0TW9kdWxlOiBcIiArIGEpO1xyXG4gICAgfVxyXG59Il19