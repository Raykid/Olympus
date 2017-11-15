define(["require", "exports", "../message/CommonMessage", "../message/CoreMessage"], function (require, exports, CommonMessage_1, CoreMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-31
     * @modify date 2017-10-31
     *
     * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
    */
    var Observable = /** @class */ (function () {
        function Observable() {
            this._listenerDict = {};
            this._commandDict = {};
            this._disposed = false;
        }
        Observable.prototype.handleMessages = function (msg) {
            var listeners1 = this._listenerDict[msg.type];
            var listeners2 = this._listenerDict[msg.constructor.toString()];
            var listeners = (listeners1 && listeners2 ? listeners1.concat(listeners2) : listeners1 || listeners2);
            if (listeners) {
                listeners = listeners.concat();
                for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                    var temp = listeners_1[_i];
                    // 调用处理函数
                    if (msg instanceof CommonMessage_1.default)
                        // 如果是通用消息，则将参数结构后调用回调
                        (_a = temp.handler).call.apply(_a, [temp.thisArg].concat(msg.params));
                    else
                        // 如果是其他消息，则直接将消息体传给回调
                        temp.handler.call(temp.thisArg, msg);
                }
            }
            var _a;
        };
        Observable.prototype.doDispatch = function (msg) {
            // 设置所属内核
            Object.defineProperty(msg, "__observable", {
                configurable: true,
                enumerable: false,
                value: this,
                writable: false
            });
            // 触发命令
            this.handleCommands(msg);
            // 触发用listen形式监听的消息
            this.handleMessages(msg);
        };
        /** dispatch方法实现 */
        Observable.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            // 统一消息对象
            var msg = typeOrMsg;
            if (typeof typeOrMsg == "string") {
                msg = new CommonMessage_1.default(typeOrMsg);
                msg.params = params;
            }
            // 派发消息
            this.doDispatch(msg);
            // 额外派发一个通用事件
            this.doDispatch(new CommonMessage_1.default(CoreMessage_1.default.MESSAGE_DISPATCHED, msg));
        };
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Observable
         */
        Observable.prototype.listen = function (type, handler, thisArg) {
            type = (typeof type == "string" ? type : type.toString());
            var listeners = this._listenerDict[type];
            if (!listeners)
                this._listenerDict[type] = listeners = [];
            // 检查存在性
            for (var i = 0, len = listeners.length; i < len; i++) {
                var temp = listeners[i];
                // 如果已经存在监听则直接返回
                if (temp.handler == handler && temp.thisArg == thisArg)
                    return;
            }
            // 添加监听
            listeners.push({ handler: handler, thisArg: thisArg });
        };
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Observable
         */
        Observable.prototype.unlisten = function (type, handler, thisArg) {
            type = (typeof type == "string" ? type : type.toString());
            var listeners = this._listenerDict[type];
            // 检查存在性
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var temp = listeners[i];
                    // 如果已经存在监听则直接返回
                    if (temp.handler == handler && temp.thisArg == thisArg) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        };
        Observable.prototype.handleCommands = function (msg) {
            var commands = this._commandDict[msg.type];
            if (commands) {
                commands = commands.concat();
                for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                    var cls = commands_1[_i];
                    // 执行命令
                    new cls(msg).exec();
                }
            }
        };
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Observable
         */
        Observable.prototype.mapCommand = function (type, cmd) {
            var commands = this._commandDict[type];
            if (!commands)
                this._commandDict[type] = commands = [];
            if (commands.indexOf(cmd) < 0)
                commands.push(cmd);
        };
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Observable
         */
        Observable.prototype.unmapCommand = function (type, cmd) {
            var commands = this._commandDict[type];
            if (!commands)
                return;
            var index = commands.indexOf(cmd);
            if (index < 0)
                return;
            commands.splice(index, 1);
        };
        Object.defineProperty(Observable.prototype, "disposed", {
            /** 是否已经被销毁 */
            get: function () {
                return this._disposed;
            },
            enumerable: true,
            configurable: true
        });
        /** 销毁 */
        Observable.prototype.dispose = function () {
            if (this._disposed)
                return;
            // 清空所有消息监听
            this._listenerDict = null;
            // 清空所有命令
            this._commandDict = null;
            // 标记销毁
            this._disposed = true;
        };
        return Observable;
    }());
    exports.default = Observable;
});
//# sourceMappingURL=Observable.js.map