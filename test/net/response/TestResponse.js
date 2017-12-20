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
//# sourceMappingURL=TestResponse.js.map