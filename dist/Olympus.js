define("core/context/ContextMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    var ContextMessage = (function () {
        /**
         * Creates an instance of ContextMessage.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof ContextMessage
         */
        function ContextMessage(type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this._type = type;
            this.params = params;
        }
        ContextMessage.prototype.getType = function () {
            return this._type;
        };
        return ContextMessage;
    }());
    exports.default = ContextMessage;
});
define("core/context/Context", ["require", "exports", "core/context/ContextMessage"], function (require, exports, ContextMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Context
     */
    var Context = (function () {
        function Context() {
            // 进行单例判断
            if (Context._instance)
                throw new Error("已生成过Context实例，不允许多次生成");
            Context._instance = this;
            this._listenerDict = {};
        }
        /** dispatch方法实现 */
        Context.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            // 统一事件对象
            var msg = typeOrMsg;
            if (typeof typeOrMsg == "string") {
                msg = new ContextMessage_1.default(typeOrMsg);
                msg.params = params;
            }
            // 派发消息
            var listeners = this._listenerDict[msg.getType()];
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var temp = listeners[i];
                    temp.handler.call(temp.thisArg, msg);
                }
            }
        };
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        Context.prototype.listen = function (type, handler, thisArg) {
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
         * @
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        Context.prototype.unlisten = function (type, handler, thisArg) {
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
        return Context;
    }());
    exports.Context = Context;
    /** 默认导出Context实例 */
    exports.default = new Context();
});
define("core/view/IView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Olympus", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是Olympus框架的外观类，绝大多数与Olympus框架的交互都可以通过这个类解决
    */
    var Olympus = (function () {
        function Olympus() {
        }
        /**
         * 添加一个表现层实例到框架中
         *
         * @static
         * @param {IView} view 要添加的表现层实例
         * @param {string} [name] 为此表现层实例起名
         * @memberof Olympus
         */
        Olympus.addView = function (view, name) {
        };
        return Olympus;
    }());
    exports.default = Olympus;
});
//# sourceMappingURL=Olympus.js.map