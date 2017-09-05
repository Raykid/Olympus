define("core/interfaces/IConstructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/message/IMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
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
         * Creates an instance of Message.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof Message
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
    exports.default = Message;
});
define("core/command/Command", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
    */
    var Command = (function () {
        function Command(msg) {
            this.msg = msg;
        }
        Command.prototype.exec = function () {
            // 留待子类完善
        };
        return Command;
    }());
    exports.default = Command;
});
define("core/command/ICommandConstructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/interfaces/IDisposable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/mediator/IMediator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/mediator/Mediator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 界面中介者基类，不能直接继承使用该基类，而需要继承不同表现层提供的中介者类
    */
    var Mediator = (function () {
        function Mediator(skin) {
            this._isDestroyed = false;
            this._listeners = [];
            if (skin)
                this.setSkin(skin);
        }
        /**
         * 获取中介者是否已被销毁
         *
         * @returns {boolean} 是否已被销毁
         * @memberof Mediator
         */
        Mediator.prototype.isDisposed = function () {
            return this._isDestroyed;
        };
        /**
         * 获取皮肤
         *
         * @returns {*} 皮肤引用
         * @memberof Mediator
         */
        Mediator.prototype.getSkin = function () {
            return this._skin;
        };
        /**
         * 设置皮肤
         *
         * @param {*} value 皮肤引用
         * @memberof Mediator
         */
        Mediator.prototype.setSkin = function (value) {
            this._skin = value;
        };
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        Mediator.prototype.mapListener = function (target, type, handler, thisArg) {
            for (var i = 0, len = this._listeners.length; i < len; i++) {
                var data = this._listeners[i];
                if (data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg) {
                    // 已经存在一样的监听，不再监听
                    return;
                }
            }
            // 记录监听
            this._listeners.push({ target: target, type: type, handler: handler, thisArg: thisArg });
            // 调用自主实现部分接口
            this.doMalListener(target, type, handler, thisArg);
        };
        Mediator.prototype.doMalListener = function (target, type, handler, thisArg) {
            // 留待子类实现
        };
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        Mediator.prototype.unmapListener = function (target, type, handler, thisArg) {
            for (var i = 0, len = this._listeners.length; i < len; i++) {
                var data = this._listeners[i];
                if (data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg) {
                    // 调用自主实现部分接口
                    this.doUnmalListener(target, type, handler, thisArg);
                    // 移除记录
                    this._listeners.splice(i, 1);
                    break;
                }
            }
        };
        Mediator.prototype.doUnmalListener = function (target, type, handler, thisArg) {
            // 留待子类实现
        };
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        Mediator.prototype.unmapAllListeners = function () {
            for (var i = 0, len = this._listeners.length; i < len; i++) {
                var data = this._listeners[i];
                // 调用自主实现部分接口
                this.doUnmalListener(data.target, data.type, data.handler, data.thisArg);
                // 移除记录
                this._listeners.splice(i, 1);
            }
        };
        /**
         * 销毁中介者
         *
         * @memberof Mediator
         */
        Mediator.prototype.dispose = function () {
            // 注销事件监听
            this.unmapAllListeners();
            // 移除皮肤
            this._skin = null;
            // 设置已被销毁
            this._isDestroyed = true;
        };
        return Mediator;
    }());
    exports.default = Mediator;
});
define("core/view/IView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path="./declarations/Inject.ts"/>
define("core/Core", ["require", "exports", "core/Core", "core/message/Message", "core/command/Command", "core/mediator/Mediator"], function (require, exports, Core_1, Message_1, Command_1, Mediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Message = Message_1.default;
    exports.Command = Command_1.default;
    exports.Mediator = Mediator_1.default;
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * Core模组是Olympus框架的核心模组，负责实现框架内消息转发、对象注入等核心功能
     * Core模组是一切其他模组实现的基础和围绕的核心
    */
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
                get: function () { return Core_1.default.getInject(cls); }
            };
        };
    };
    window["Injectable"] = function (cls) {
        var params = cls;
        if (params.type instanceof Function) {
            // 需要转换注册类型，需要返回一个ClassDecorator
            return function (realCls) {
                Core_1.default.mapInject(realCls, params.type);
            };
        }
        else {
            // 不需要转换注册类型，直接注册
            Core_1.default.mapInject(cls);
        }
    };
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Core
     */
    var Core = (function () {
        function Core() {
            /*********************** 内核消息语法糖处理逻辑 ***********************/
            this._messageHandlerDict = {};
            /*********************** 下面是内核消息系统 ***********************/
            this._listenerDict = {};
            /*********************** 下面是依赖注入系统 ***********************/
            this._injectDict = {};
            /*********************** 下面是内核命令系统 ***********************/
            this._commandDict = {};
            /*********************** 下面是界面中介者系统 ***********************/
            this._mediatorList = [];
            // 进行单例判断
            if (Core._instance)
                throw new Error("已生成过Core实例，不允许多次生成");
            // 赋值单例
            Core._instance = this;
            // 注入自身
            this.mapInjectValue(this);
        }
        Core.prototype.handleMessageSugars = function (msg, target) {
            // 调用以Message类型为前缀，以_handler为后缀的方法
            var name = msg.getType() + "_handler";
            if (target[name] instanceof Function)
                target[name](msg);
        };
        Core.prototype.handleMessages = function (msg) {
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
        Core.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            // 统一事件对象
            var msg = typeOrMsg;
            if (typeof typeOrMsg == "string") {
                msg = new Message_1.default(typeOrMsg);
                msg.params = params;
            }
            // 触发依赖注入对象操作
            this.handleInjects(msg);
            // 触发中介者相关操作
            this.handleMediators(msg);
            // 触发命令
            this.handleCommands(msg);
            // 触发用listen形式监听的消息
            this.handleMessages(msg);
        };
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        Core.prototype.listen = function (type, handler, thisArg) {
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
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        Core.prototype.unlisten = function (type, handler, thisArg) {
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
        Core.prototype.handleInjects = function (msg) {
            for (var key in this._injectDict) {
                var inject = this._injectDict[key];
                // 执行语法糖
                this.handleMessageSugars(msg, inject);
            }
        };
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Core
         */
        Core.prototype.mapInject = function (target, type) {
            var value = new target();
            this.mapInjectValue(value, type);
        };
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @memberof Core
         */
        Core.prototype.mapInjectValue = function (value, type) {
            var key = (type || value.constructor).toString();
            this._injectDict[key] = value;
        };
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @memberof Core
         */
        Core.prototype.unmapInject = function (target) {
            var key = target.toString();
            delete this._injectDict[key];
        };
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Core
         */
        Core.prototype.getInject = function (type) {
            return this._injectDict[type.toString()];
        };
        Core.prototype.handleCommands = function (msg) {
            var commands = this._commandDict[msg.getType()];
            if (!commands)
                return;
            for (var i = 0, len = commands.length; i < len; i++) {
                var cls = commands[i];
                try {
                    // 执行命令
                    var cmd = new cls(msg);
                    cmd.exec();
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
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Core
         */
        Core.prototype.mapCommand = function (type, cmd) {
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
         * @memberof Core
         */
        Core.prototype.unmapCommand = function (type, cmd) {
            var commands = this._commandDict[type];
            if (!commands)
                return;
            var index = commands.indexOf(cmd);
            if (index < 0)
                return;
            commands.splice(index, 1);
        };
        Core.prototype.handleMediators = function (msg) {
            for (var i = 0, len = this._mediatorList.length; i < len; i++) {
                var mediator = this._mediatorList[i];
                // 执行语法糖
                this.handleMessageSugars(msg, mediator);
            }
        };
        /**
         * 注册界面中介者
         *
         * @param {IMediator} mediator 要注册的界面中介者实例
         * @memberof Core
         */
        Core.prototype.mapMediator = function (mediator) {
            if (this._mediatorList.indexOf(mediator) < 0)
                this._mediatorList.push(mediator);
        };
        /**
         * 注销界面中介者
         *
         * @param {IMediator} mediator 要注销的界面中介者实例
         * @memberof Core
         */
        Core.prototype.unmapMediator = function (mediator) {
            var index = this._mediatorList.indexOf(mediator);
            if (index >= 0)
                this._mediatorList.splice(index, 1);
        };
        return Core;
    }());
    exports.Core = Core;
    /** 导出Core实例 */
    exports.default = new Core();
});
define("env/explorer/ExplorerType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * 浏览器类型枚举
    */
    var ExplorerType;
    (function (ExplorerType) {
        ExplorerType[ExplorerType["IE"] = 0] = "IE";
        ExplorerType[ExplorerType["EDGE"] = 1] = "EDGE";
        ExplorerType[ExplorerType["OPERA"] = 2] = "OPERA";
        ExplorerType[ExplorerType["FIREFOX"] = 3] = "FIREFOX";
        ExplorerType[ExplorerType["SAFARI"] = 4] = "SAFARI";
        ExplorerType[ExplorerType["CHROME"] = 5] = "CHROME";
        ExplorerType[ExplorerType["OTHERS"] = 6] = "OTHERS";
    })(ExplorerType || (ExplorerType = {}));
    /** 默认导出 */
    exports.default = ExplorerType;
});
define("env/explorer/Explorer", ["require", "exports", "env/explorer/ExplorerType"], function (require, exports, ExplorerType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Explorer类记录浏览器相关数据
    */
    var Explorer = (function () {
        function Explorer() {
            //取得浏览器的userAgent字符串
            var userAgent = navigator.userAgent;
            // 判断浏览器类型
            var regExp;
            var result;
            if (window["ActiveXObject"] != null) {
                // IE浏览器
                this._type = ExplorerType_1.default.IE;
                // 获取IE版本号
                regExp = new RegExp("MSIE ([^ ;\\)]+);");
                result = regExp.exec(userAgent);
                if (result != null) {
                    // 是IE8以前
                    this._version = result[1];
                }
                else {
                    // 是IE9以后
                    regExp = new RegExp("rv:([^ ;\\)]+)");
                    result = regExp.exec(userAgent);
                    this._version = result[1];
                }
            }
            else if (userAgent.indexOf("Edge") > -1) {
                // Edge浏览器
                this._type = ExplorerType_1.default.EDGE;
                // 获取Edge版本号
                regExp = new RegExp("Edge/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Firefox") > -1) {
                // Firefox浏览器
                this._type = ExplorerType_1.default.FIREFOX;
                // 获取Firefox版本号
                regExp = new RegExp("Firefox/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Opera") > -1) {
                // Opera浏览器
                this._type = ExplorerType_1.default.OPERA;
                // 获取Opera版本号
                regExp = new RegExp("OPR/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Chrome") > -1) {
                // Chrome浏览器
                this._type = ExplorerType_1.default.CHROME;
                // 获取Crhome版本号
                regExp = new RegExp("Chrome/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Safari") > -1) {
                // Safari浏览器
                this._type = ExplorerType_1.default.SAFARI;
                // 获取Safari版本号
                regExp = new RegExp("Safari/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else {
                // 其他浏览器
                this._type = ExplorerType_1.default.OTHERS;
                // 随意设置一个版本号
                this._version = "0.0";
            }
            // 赋值类型字符串
            this._typeStr = ExplorerType_1.default[this._type];
            // 赋值大版本号
            this._bigVersion = this._version.split(".")[0];
        }
        /**
         * 获取浏览器类型枚举值
         *
         * @returns {ExplorerType} 浏览器类型枚举值
         * @memberof Env
         */
        Explorer.prototype.getType = function () {
            return this._type;
        };
        /**
         * 获取浏览器类型字符串
         *
         * @returns {string} 浏览器类型字符串
         * @memberof Env
         */
        Explorer.prototype.getTypeStr = function () {
            return this._typeStr;
        };
        /**
         * 获取浏览器版本
         *
         * @returns {string} 浏览器版本
         * @memberof Explorer
         */
        Explorer.prototype.getVersion = function () {
            return this._version;
        };
        /**
         * 获取浏览器大版本
         *
         * @returns {string} 浏览器大版本
         * @memberof Explorer
         */
        Explorer.prototype.getBigVersion = function () {
            return this._bigVersion;
        };
        return Explorer;
    }());
    exports.default = Explorer;
});
define("env/query/Query", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Query类记录通过GET参数传递给框架的参数字典
    */
    var Query = (function () {
        function Query() {
            this._params = {};
            var loc = window.location.href;
            var query = loc.substring(loc.search(/\?/) + 1);
            var vars = query.split('&');
            for (var i = 0, len = vars.length; i < len; i++) {
                var pair = vars[i].split('=', 2);
                if (pair.length != 2 || !pair[0])
                    continue;
                var name = pair[0];
                var value = pair[1];
                name = decodeURIComponent(name);
                value = decodeURIComponent(value);
                // decode twice for ios
                name = decodeURIComponent(name);
                value = decodeURIComponent(value);
                this._params[name] = value;
            }
        }
        /**
         * 获取GET参数
         *
         * @param {string} key 参数key
         * @returns {string} 参数值
         * @memberof Query
         */
        Query.prototype.getParam = function (key) {
            return this._params[key];
        };
        return Query;
    }());
    exports.default = Query;
});
define("env/external/External", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * External类为window.external参数字典包装类
    */
    var External = (function () {
        function External() {
            this._params = {};
            // 处理window.external
            try {
                if (!(window.external && typeof window.external === "object")) {
                    window.external = {};
                }
            }
            catch (err) {
                window.external = {};
            }
            this._params = window.external;
        }
        /**
         * 获取window.external中的参数
         *
         * @param {string} key 参数名
         * @returns {*} 参数值
         * @memberof External
         */
        External.prototype.getParam = function (key) {
            return this._params[key];
        };
        return External;
    }());
    exports.default = External;
});
define("env/Env", ["require", "exports", "core/Core", "env/explorer/Explorer", "env/query/Query", "env/external/External"], function (require, exports, Core_2, Explorer_1, Query_1, External_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Explorer = Explorer_1.default;
    exports.Query = Query_1.default;
    exports.External = External_1.default;
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Env模块是Olympus框架用来集成与运行时环境相关的部分，如浏览器环境、开发环境、运行时参数等
    */
    // 注入
    Core_2.default.mapInject(Explorer_1.default);
    Core_2.default.mapInject(Query_1.default);
    Core_2.default.mapInject(External_1.default);
});
define("Olympus", ["require", "exports", "core/Core", "env/Env"], function (require, exports, Core_3, Env_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.core = Core_3.default;
    exports.Core = Core_3.Core;
    exports.Message = Core_3.Message;
    exports.Command = Core_3.Command;
    __export(Env_1);
    /*********************** 下面是Core模组的常用接口 ***********************/
    /**
     * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
     *
     * @param {IConstructor} target 要注入的类型（注意不是实例）
     * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
     * @memberof Core
     */
    function mapInject(target, type) {
        Core_3.default.mapInject(target, type);
    }
    exports.mapInject = mapInject;
    /**
     * 获取注入的对象实例
     *
     * @param {(IConstructor)} type 注入对象的类型
     * @returns {*} 注入的对象实例
     * @memberof Core
     */
    function getInject(type) {
        return Core_3.default.getInject(type);
    }
    exports.getInject = getInject;
    /** dispatch方法实现 */
    function dispatch(typeOrMsg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        Core_3.default.dispatch.apply(Core_3.default, arguments);
    }
    exports.dispatch = dispatch;
    /**
     * 监听内核消息
     *
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Core
     */
    function listen(type, handler, thisArg) {
        Core_3.default.listen(type, handler, thisArg);
    }
    exports.listen = listen;
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Core
     */
    function unlisten(type, handler, thisArg) {
        Core_3.default.unlisten(type, handler, thisArg);
    }
    exports.unlisten = unlisten;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Core
     */
    function mapCommand(type, cmd) {
        Core_3.default.mapCommand(type, cmd);
    }
    exports.mapCommand = mapCommand;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Core
     */
    function unmapCommand(type, cmd) {
        Core_3.default.unmapCommand(type, cmd);
    }
    exports.unmapCommand = unmapCommand;
});
//# sourceMappingURL=Olympus.js.map