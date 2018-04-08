import * as tslib_1 from "tslib";
import Message from "./Message";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 框架内核通用消息
*/
var CommonMessage = /** @class */ (function (_super) {
    tslib_1.__extends(CommonMessage, _super);
    /**
     * Creates an instance of Message.
     * @param {string} type 消息类型
     * @param {...any[]} params 可能的消息参数列表
     * @memberof Message
     */
    function CommonMessage(type) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, type) || this;
        _this.params = params;
        return _this;
    }
    return CommonMessage;
}(Message));
export default CommonMessage;
