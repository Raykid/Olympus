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
        /**
         * 消息派发内核列表
         *
         * @type {IObservable}
         * @memberof Message
         */
        this.__observables = [];
        this._type = type;
    }
    Object.defineProperty(Message.prototype, "__type", {
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
    Object.defineProperty(Message.prototype, "__observable", {
        /**
         * 消息当前所属内核
         *
         * @type {IObservable}
         * @memberof Message
         */
        get: function () {
            return this.__observables[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "__oriObservable", {
        /**
         * 消息所属的原始内核（第一个派发到的内核）
         *
         * @type {IObservable}
         * @memberof Message
         */
        get: function () {
            return this.__observables[this.__observables.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     *
     * @memberof Message
     */
    Message.prototype.redispatch = function () {
        this.__oriObservable.dispatch(this);
    };
    return Message;
}());
export default Message;
