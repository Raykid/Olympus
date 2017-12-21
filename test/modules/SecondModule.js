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
import { ModuleClass, DelegateMediator, BindFunc, BindFor, BindValue, MessageHandler, GlobalMessageHandler, BindMessage } from "olympus-r/engine/injector/Injector";
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
        BindValue("txt.text", "i"),
        BindFor("lst", "key in fuckList"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vjb25kTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2Vjb25kTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLGFBQWEsTUFBTSxzQ0FBc0MsQ0FBQztBQUNqRSxPQUFPLE1BQU0sTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQVUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1SyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUU3RTs7Ozs7OztFQU9FO0FBR0Y7SUFBNkIsa0NBQWE7SUFBMUM7O0lBdUNBLENBQUM7SUF4QlUsbUNBQVUsR0FBakI7UUFFSSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU0sK0JBQU0sR0FBYjtRQUFBLGlCQWtCQztRQWhCRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDbkQscUNBQXFDO1lBRXJDLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNiLEtBQUssRUFBRSxVQUFBLEdBQUc7Z0JBQ04sZ0NBQWdDO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztZQUN4QixDQUFDO1lBQ0QsSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7U0FDM0MsQ0FBQztRQUNGLE9BQU87UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBbENEO1FBRkMsV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQyxDQUFDO1FBQ3ZELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7a0NBQy9DLEdBQUcsQ0FBQyxNQUFNOytDQUFDO0lBU3RCO1FBUkMsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUN4QixTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztRQUMxQixPQUFPLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDO1FBQ2pDLFNBQVMsQ0FBQztZQUNQLEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQUUsbUJBQW1CO2FBQzVCO1NBQ0osQ0FBQztrQ0FDUyxHQUFHLENBQUMsU0FBUzsrQ0FBQztJQWJ2QixjQUFjO1FBRG5CLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztPQUMxQixjQUFjLENBdUNuQjtJQUFELHFCQUFDO0NBQUEsQUF2Q0QsQ0FBNkIsYUFBYSxHQXVDekM7QUFHRDtJQUEwQyxnQ0FBTTtJQUFoRDs7SUFXQSxDQUFDO0lBSlcsNkJBQU0sR0FBZCxVQUFlLENBQUM7UUFFWixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFQRDtRQURDLGdCQUFnQjtrQ0FDQyxjQUFjO21EQUFDO0lBSWpDO1FBRkMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUN0QixvQkFBb0IsQ0FBQyxNQUFNLENBQUM7Ozs7OENBSTVCO0lBVmdCLFlBQVk7UUFEaEMsV0FBVztPQUNTLFlBQVksQ0FXaEM7SUFBRCxtQkFBQztDQUFBLEFBWEQsQ0FBMEMsTUFBTSxHQVcvQztlQVhvQixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lTWVkaWF0b3IgZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvc2NlbmUvU2NlbmVNZWRpYXRvclwiO1xyXG5pbXBvcnQgTW9kdWxlIGZyb20gXCJvbHltcHVzLXIvZW5naW5lL21vZHVsZS9Nb2R1bGVcIjtcclxuaW1wb3J0IHsgTW9kdWxlQ2xhc3MsIERlbGVnYXRlTWVkaWF0b3IsIEJpbmRGdW5jLCBCaW5kRm9yLCBCaW5kVmFsdWUsIE1lc3NhZ2VIYW5kbGVyLCBHbG9iYWxNZXNzYWdlSGFuZGxlciwgQmluZE1lc3NhZ2UsIEJpbmRJZiB9IGZyb20gXCJvbHltcHVzLXIvZW5naW5lL2luamVjdG9yL0luamVjdG9yXCI7XHJcbmltcG9ydCB7IEVncmV0TWVkaWF0b3JDbGFzcyB9IGZyb20gXCJvbHltcHVzLXItZWdyZXQvZWdyZXQvaW5qZWN0b3IvSW5qZWN0b3JcIjtcclxuXHJcbi8qKlxyXG4gKiBAYXV0aG9yIFJheWtpZFxyXG4gKiBAZW1haWwgaW5pdGlhbF9yQHFxLmNvbVxyXG4gKiBAY3JlYXRlIGRhdGUgMjAxNy0wOS0xOFxyXG4gKiBAbW9kaWZ5IGRhdGUgMjAxNy0wOS0xOFxyXG4gKiBcclxuICog5rWL6K+V56ys5LqM5Liq5qih5Z2XXHJcbiovXHJcblxyXG5ARWdyZXRNZWRpYXRvckNsYXNzKFwiRnVjazJTa2luXCIpXHJcbmNsYXNzIFNlY29uZE1lZGlhdG9yIGV4dGVuZHMgU2NlbmVNZWRpYXRvclxyXG57XHJcbiAgICBAQmluZE1lc3NhZ2UoXCJGdWNrTXNnXCIsIHtsYWJlbDogXCJvbk1zZygkYXJndW1lbnRzWzBdKVwifSlcclxuICAgIEBCaW5kRnVuYyhcImdldEN1cnJlbnRTdGF0ZVwiLCBbXCJmdWNrXCIsIFwib25Nc2dcIiwgdW5kZWZpbmVkXSlcclxuICAgIHB1YmxpYyBidG46ZXVpLkJ1dHRvbjtcclxuICAgIEBCaW5kRm9yKFwiaSBpbiBmdWNrTGlzdFwiKVxyXG4gICAgQEJpbmRWYWx1ZShcInR4dC50ZXh0XCIsIFwiaVwiKVxyXG4gICAgQEJpbmRGb3IoXCJsc3RcIiwgXCJrZXkgaW4gZnVja0xpc3RcIilcclxuICAgIEBCaW5kVmFsdWUoe1xyXG4gICAgICAgIHR4dDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIiR0YXJnZXQuJGhhc2hDb2RlXCJcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcHVibGljIGxzdDpldWkuRGF0YUdyb3VwO1xyXG5cclxuICAgIHB1YmxpYyBsaXN0QXNzZXRzKCk6c3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gW1wicHJlbG9hZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25PcGVuKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubWFwTGlzdGVuZXIodGhpcy5idG4sIGVncmV0LlRvdWNoRXZlbnQuVE9VQ0hfVEFQLCAoKT0+e1xyXG4gICAgICAgICAgICAvLyBtb2R1bGVNYW5hZ2VyLmNsb3NlKFNlY29uZE1vZHVsZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKFwiRnVja01zZ1wiLCBcIlNoaXQhISFcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSB7XHJcbiAgICAgICAgICAgIG9uTXNnOiBtc2c9PntcclxuICAgICAgICAgICAgICAgIC8vIOihqOi+vuW8j+mHjOS9v+eUqOWHveaVsOWPr+S7peWcqOWHveaVsOmHjOaJp+ihjOWkjeadgumAu+i+ke+8jOW5tuS4lOWFt+acieS7o+eggeaPkOekulxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtc2cgKyBcIiAtIDFcIjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVjazogXCJ5b3VcIixcclxuICAgICAgICAgICAgZnVja0xpc3Q6IFtcImZ1Y2tcIiwgXCJzaGl0XCIsIFwieW91XCIsIFwiISEhXCJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyDmtYvor5Xmtojmga9cclxuICAgICAgICB0aGlzLmRpc3BhdGNoKFwiZnVja1wiLCAxMjMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5ATW9kdWxlQ2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Vjb25kTW9kdWxlIGV4dGVuZHMgTW9kdWxlXHJcbntcclxuICAgIEBEZWxlZ2F0ZU1lZGlhdG9yXHJcbiAgICBwcml2YXRlIF9tZWRpYXRvcjpTZWNvbmRNZWRpYXRvcjtcclxuICAgIFxyXG4gICAgQE1lc3NhZ2VIYW5kbGVyKFwiZnVja1wiKVxyXG4gICAgQEdsb2JhbE1lc3NhZ2VIYW5kbGVyKFwiZnVja1wiKVxyXG4gICAgcHJpdmF0ZSBvbkZ1Y2soYSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZSBhdCBTZWNvbmRNb2R1bGU6IFwiICsgYSk7XHJcbiAgICB9XHJcbn0iXX0=