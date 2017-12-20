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
import TestResponse from "../response/TestResponse";
import RequestData from "olympus-r/engine/net/RequestData";
import policy from "olympus-r/engine/net/policies/HTTPRequestPolicy";
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
        _this.__policy = policy;
        return _this;
    }
    Object.defineProperty(TestRequest.prototype, "__params", {
        get: function () {
            return {
                type: "Test",
                path: "/test",
                protocol: "http",
                response: TestResponse,
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
}(RequestData));
export default TestRequest;
//# sourceMappingURL=TestRequest.js.map