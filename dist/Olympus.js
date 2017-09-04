define("core/message/Message", ["require", "exports"], function (require, exports) {
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
    var Message = (function () {
        /**
         * Creates an instance of ContextMessage.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof ContextMessage
         */
        function Message(type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this._type = type;
            this.params = params;
        }
        Message.prototype.getType = function () {
            return this._type;
        };
        return Message;
    }());
    exports.Message = Message;
});
define("core/command/Command", ["require", "exports", "core/context/Context"], function (require, exports, Context_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 内和命令的类形式
     *
     * @export
     * @class Command
     */
    var Command = (function () {
        function Command(msg) {
            this.msg = msg;
            this.context = Context_1.context;
        }
        Command.prototype.exec = function () {
            // 留待子类完善
        };
        return Command;
    }());
    exports.Command = Command;
});
define("core/interfaces/Constructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path="../declarations/Inject.ts"/>
define("core/context/Context", ["require", "exports", "core/message/Message"], function (require, exports, Message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 修复Array.findIndex会被遍历到的问题
    if (Array.prototype.hasOwnProperty("findIndex")) {
        var desc = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
        if (desc.enumerable) {
            desc.enumerable = false;
            Object.defineProperty(Array.prototype, "findIndex", desc);
        }
    }
    // 下面是为了装饰器功能做的
    window["Inject"] = function (cls) {
        return function (prototype, propertyKey) {
            return {
                get: function () { return exports.context.getInject(cls); }
            };
        };
    };
    window["Injectable"] = function (cls) {
        var params = cls;
        if (params.type instanceof Function) {
            // 需要转换注册类型，需要返回一个ClassDecorator
            return function (realCls) {
                exports.context.mapInject(realCls, params.type);
            };
        }
        else {
            // 不需要转换注册类型，直接注册
            exports.context.mapInject(cls);
        }
    };
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Context
     */
    var Context = (function () {
        function Context() {
            /*********************** 下面是依赖注入系统 ***********************/
            this._injectDict = {};
            /*********************** 下面是内核消息系统 ***********************/
            this._listenerDict = {};
            /*********************** 下面是内核命令系统 ***********************/
            this._commandDict = {};
            // 进行单例判断
            if (Context._instance)
                throw new Error("已生成过Context实例，不允许多次生成");
            // 赋值单例
            Context._instance = this;
        }
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {Constructor} target 要注入的类型（注意不是实例）
         * @param {Constructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Context
         */
        Context.prototype.mapInject = function (target, type) {
            var key = (type || target).toString();
            var value = new target();
            this._injectDict[key] = value;
        };
        /**
         * 获取注入的对象实例
         *
         * @param {(Constructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Context
         */
        Context.prototype.getInject = function (type) {
            return this._injectDict[type.toString()];
        };
        Context.prototype.handleMessages = function (msg) {
            var listeners = this._listenerDict[msg.getType()];
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var temp = listeners[i];
                    try {
                        // 调用处理函数
                        temp.handler.call(temp.thisArg, msg);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        };
        /** dispatch方法实现 */
        Context.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            // 统一事件对象
            var msg = typeOrMsg;
            if (typeof typeOrMsg == "string") {
                msg = new Message_1.Message(typeOrMsg);
                msg.params = params;
            }
            // 触发命令
            this.handleCommands(msg);
            // 触发用listen形式监听的消息
            this.handleMessages(msg);
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
        Context.prototype.handleCommands = function (msg) {
            var commands = this._commandDict[msg.getType()];
            if (!commands)
                return;
            for (var i = 0, len = commands.length; i < len; i++) {
                var cls = commands[i];
                try {
                    // 执行命令
                    new cls(msg).exec();
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(CommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Context
         */
        Context.prototype.mapCommand = function (type, cmd) {
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
         * @param {(CommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Context
         */
        Context.prototype.unmapCommand = function (type, cmd) {
            var commands = this._commandDict[type];
            if (!commands)
                return;
            var index = commands.indexOf(cmd);
            if (index < 0)
                return;
            commands.splice(index, 1);
        };
        return Context;
    }());
    exports.Context = Context;
    /** 导出Context实例 */
    exports.context = new Context();
});
define("core/view/IView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Olympus", ["require", "exports", "core/context/Context", "core/message/Message", "core/command/Command"], function (require, exports, Context_2, Message_2, Command_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.context = Context_2.context;
    exports.Context = Context_2.Context;
    exports.Message = Message_2.Message;
    exports.Command = Command_1.Command;
    /** dispatch方法实现 */
    function dispatch(typeOrMsg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        Context_2.context.dispatch.apply(Context_2.context, arguments);
    }
    exports.dispatch = dispatch;
    /**
     * 监听内核消息
     *
     * @param {string} type 消息类型
     * @param {(msg:IContextMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    function listen(type, handler, thisArg) {
        Context_2.context.listen(type, handler, thisArg);
    }
    exports.listen = listen;
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {(msg:IContextMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    function unlisten(type, handler, thisArg) {
        Context_2.context.unlisten(type, handler, thisArg);
    }
    exports.unlisten = unlisten;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(CommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Context
     */
    function mapCommand(type, cmd) {
        Context_2.context.mapCommand(type, cmd);
    }
    exports.mapCommand = mapCommand;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(CommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Context
     */
    function unmapCommand(type, cmd) {
        Context_2.context.unmapCommand(type, cmd);
    }
    exports.unmapCommand = unmapCommand;
});
//# sourceMappingURL=Olympus.js.map