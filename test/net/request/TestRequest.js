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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUZXN0UmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxZQUFZLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxXQUErQixNQUFNLGtDQUFrQyxDQUFDO0FBRS9FLE9BQU8sTUFBTSxNQUFNLGlEQUFpRCxDQUFDO0FBRXJFOzs7Ozs7RUFNRTtBQUNGO0lBQXlDLCtCQUFXO0lBQXBEO1FBQUEscUVBdUJDO1FBRFUsY0FBUSxHQUFrQixNQUFNLENBQUM7O0lBQzVDLENBQUM7SUFiRyxzQkFBVyxpQ0FBUTthQUFuQjtZQUVJLE1BQU0sQ0FBQztnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDckIsSUFBSSxFQUFFLE9BQU87Z0JBQ0osUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixJQUFJLEVBQUU7b0JBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUEsY0FBYztpQkFDaEM7YUFDSixDQUFDO1FBQ04sQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRU4sa0JBQUM7QUFBRCxDQUFDLEFBdkJELENBQXlDLFdBQVcsR0F1Qm5EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3RSZXNwb25zZSBmcm9tIFwiLi4vcmVzcG9uc2UvVGVzdFJlc3BvbnNlXCI7XHJcbmltcG9ydCBSZXF1ZXN0RGF0YSwgeyBJUmVxdWVzdFBhcmFtcyB9IGZyb20gXCJvbHltcHVzLXIvZW5naW5lL25ldC9SZXF1ZXN0RGF0YVwiO1xyXG5pbXBvcnQgSVJlcXVlc3RQb2xpY3kgZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvbmV0L0lSZXF1ZXN0UG9saWN5XCI7XHJcbmltcG9ydCBwb2xpY3kgZnJvbSBcIm9seW1wdXMtci9lbmdpbmUvbmV0L3BvbGljaWVzL0hUVFBSZXF1ZXN0UG9saWN5XCI7XHJcblxyXG4vKipcclxuICogQGF1dGhvciBUZW1wbGF0ZUdlbmVyYXRvclxyXG4gKiBAZW1haWwgaW5pdGlhbF9yQHFxLmNvbVxyXG4gKiBAbW9kaWZ5IGRhdGUgMTAvOS8yMDE3XHJcbiAqIFxyXG4gKiDmtYvor5VcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdFJlcXVlc3QgZXh0ZW5kcyBSZXF1ZXN0RGF0YVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIOa1i+ivlVxyXG4gICAgICogXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQG1lbWJlcm9mIFRlc3RSZXF1ZXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0ZXN0OnN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IF9fcGFyYW1zKCk6SVJlcXVlc3RQYXJhbXNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiBcIlRlc3RcIixcclxuXHRcdFx0cGF0aDogXCIvdGVzdFwiLFxyXG4gICAgICAgICAgICBwcm90b2NvbDogXCJodHRwXCIsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiBUZXN0UmVzcG9uc2UsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHRlc3Q6IHRoaXMudGVzdC8vIHN0cmluZyAtIOa1i+ivlVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBwdWJsaWMgX19wb2xpY3k6SVJlcXVlc3RQb2xpY3kgPSBwb2xpY3k7XHJcbn0iXX0=