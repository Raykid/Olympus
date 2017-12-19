/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 消息基类
*/
var Message = /** @class */ (function () {
    function Message(type) {
        this._type = type;
    }
    Object.defineProperty(Message.prototype, "type", {
        /**
         * 获取消息类型字符串
         *
         * @readonly
         * @type {string}
         * @memberof Message
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
export default Message;
