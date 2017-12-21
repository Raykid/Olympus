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
import Test from "../type/Test";
import ResponseData from "olympus-r/engine/net/ResponseData";
import { netManager } from "olympus-r/engine/net/NetManager";
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
        this.test = new Test().parse(data.test);
    };
    TestResponse.prototype.pack = function () {
        return {
            test: this.test.pack()
        };
    };
    TestResponse.type = "Test";
    return TestResponse;
}(ResponseData));
export default TestResponse;
/** 注册返回体 */
netManager.registerResponse(TestResponse);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGVzdFJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxjQUFjLENBQUM7QUFDaEMsT0FBTyxZQUFpQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUU3RDs7Ozs7O0VBTUU7QUFDRjtJQUEwQyxnQ0FBWTtJQUF0RDs7SUFrQ0EsQ0FBQztJQXhCRyxzQkFBVyxrQ0FBUTthQUFuQjtZQUVJLE1BQU0sQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsTUFBTSxFQUFFLEtBQUs7YUFDaEIsQ0FBQztRQUNOLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUlRLDhCQUFPLEdBQWpCLFVBQWtCLElBQVE7UUFFdEIsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSwyQkFBSSxHQUFYO1FBRUksTUFBTSxDQUFDO1lBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1NBQ3pCLENBQUM7SUFDTixDQUFDO0lBZGEsaUJBQUksR0FBVSxNQUFNLENBQUM7SUFldkMsbUJBQUM7Q0FBQSxBQWxDRCxDQUEwQyxZQUFZLEdBa0NyRDtlQWxDb0IsWUFBWTtBQW9DakMsWUFBWTtBQUNaLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0IGZyb20gXCIuLi90eXBlL1Rlc3RcIjtcclxuaW1wb3J0IFJlc3BvbnNlRGF0YSwgeyBJUmVzcG9uc2VQYXJhbXMgfSBmcm9tIFwib2x5bXB1cy1yL2VuZ2luZS9uZXQvUmVzcG9uc2VEYXRhXCI7XHJcbmltcG9ydCB7IG5ldE1hbmFnZXIgfSBmcm9tIFwib2x5bXB1cy1yL2VuZ2luZS9uZXQvTmV0TWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgVGVtcGxhdGVHZW5lcmF0b3JcclxuICogQGVtYWlsIGluaXRpYWxfckBxcS5jb21cclxuICogQG1vZGlmeSBkYXRlIDEwLzkvMjAxN1xyXG4gKiBcclxuICog5rWL6K+VXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RSZXNwb25zZSBleHRlbmRzIFJlc3BvbnNlRGF0YVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIOa1i+ivlVxyXG4gICAgICogXHJcbiAgICAgKiBAdHlwZSB7VGVzdH1cclxuICAgICAqIEBtZW1iZXJvZiBUZXN0UmVzcG9uc2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRlc3Q6VGVzdDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IF9fcGFyYW1zKCk6SVJlc3BvbnNlUGFyYW1zXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZTogXCJUZXN0XCIsXHJcbiAgICAgICAgICAgIHByb3RvY29sOiBcImh0dHBcIixcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0eXBlOnN0cmluZyA9IFwiVGVzdFwiO1xyXG5cclxuICAgIHByb3RlY3RlZCBkb1BhcnNlKGRhdGE6YW55KTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fX3BhcmFtcy5zdWNjZXNzID0gZGF0YS5zdWNjZXNzO1xyXG4gICAgICAgIHRoaXMudGVzdCA9IDxUZXN0Pm5ldyBUZXN0KCkucGFyc2UoZGF0YS50ZXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGFjaygpOmFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRlc3Q6IHRoaXMudGVzdC5wYWNrKCkgICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiog5rOo5YaM6L+U5Zue5L2TICovXHJcbm5ldE1hbmFnZXIucmVnaXN0ZXJSZXNwb25zZShUZXN0UmVzcG9uc2UpOyJdfQ==