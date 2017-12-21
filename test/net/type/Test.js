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
import DataType from "olympus-r/engine/net/DataType";
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
}(DataType));
export default Test;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sUUFBUSxNQUFNLCtCQUErQixDQUFDO0FBRXJEOzs7Ozs7RUFNRTtBQUNGO0lBQWtDLHdCQUFRO0lBQTFDOztJQXNCQSxDQUFDO0lBWmEsc0JBQU8sR0FBakIsVUFBa0IsSUFBUTtRQUV0QixFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRU0sbUJBQUksR0FBWDtRQUVJLE1BQU0sQ0FBQztZQUNILElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNsQixDQUFDO0lBQ04sQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBdEJELENBQWtDLFFBQVEsR0FzQnpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFUeXBlIGZyb20gXCJvbHltcHVzLXIvZW5naW5lL25ldC9EYXRhVHlwZVwiO1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgVGVtcGxhdGVHZW5lcmF0b3JcclxuICogQGVtYWlsIGluaXRpYWxfckBxcS5jb21cclxuICogQG1vZGlmeSBkYXRlIDEwLzkvMjAxN1xyXG4gKiBcclxuICog5rWL6K+VXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3QgZXh0ZW5kcyBEYXRhVHlwZVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIOa1i+ivlVxyXG4gICAgICogXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQG1lbWJlcm9mIFRlc3RSZXNwb25zZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdGVzdDpzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGRvUGFyc2UoZGF0YTphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB0aGlzLnRlc3QgPSBkYXRhLnRlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhY2soKTphbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZXN0OiB0aGlzLnRlc3QgICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il19