var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了对现有js功能打补丁修bug等
*/
/** 修复Array.findIndex会被遍历到的问题 */
if (Array.prototype.hasOwnProperty("findIndex")) {
    var desc = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
    if (desc.enumerable) {
        desc.enumerable = false;
        Object.defineProperty(Array.prototype, "findIndex", desc);
    }
}
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
var global;
(function (global) {
    var Inject = (function () {
        function Inject() {
        }
        /**
         * 获取注入字典
         *
         * @static
         * @returns {{[key:string]:any}}
         * @memberof Inject
         */
        Inject.getInjectDict = function () {
            return Inject._injectDict;
        };
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @static
         * @memberof Inject
         */
        Inject.mapInject = function (target, type) {
            var value = new target();
            Inject.mapInjectValue(value, type);
        };
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @static
         * @memberof Inject
         */
        Inject.mapInjectValue = function (value, type) {
            var key = (type || value.constructor).toString();
            Inject._injectDict[key] = value;
        };
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @static
         * @memberof Inject
         */
        Inject.unmapInject = function (target) {
            var key = target.toString();
            delete Inject._injectDict[key];
        };
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @static
         * @memberof Inject
         */
        Inject.getInject = function (type) {
            return Inject._injectDict[type.toString()];
        };
        Inject._injectDict = {};
        return Inject;
    }());
    global.Inject = Inject;
})(global || (global = {}));
/// <reference path="Inject.ts"/>
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
function Inject(cls) {
    return function (prototype, propertyKey) {
        return {
            get: function () { return global.Inject.getInject(cls); }
        };
    };
}
function Injectable(cls) {
    var params = cls;
    if (params.type instanceof Function) {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function (realCls) {
            global.Inject.mapInject(realCls, params.type);
        };
    }
    else {
        // 不需要转换注册类型，直接注册
        global.Inject.mapInject(cls);
    }
}
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
        return Command;
    }());
    exports.default = Command;
});
define("core/command/ICommandConstructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path="./global/Patch.ts"/>
/// <reference path="./global/Decorator.ts"/>
define("core/Core", ["require", "exports", "core/message/Message"], function (require, exports, Message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            /*********************** 下面是内核命令系统 ***********************/
            this._commandDict = {};
            /*********************** 下面是界面中介者系统 ***********************/
            this._mediatorList = [];
            // 进行单例判断
            if (Core_1._instance)
                throw new Error("已生成过Core实例，不允许多次生成");
            // 赋值单例
            Core_1._instance = this;
        }
        Core_1 = Core;
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
        /*********************** 下面是依赖注入系统 ***********************/
        Core.prototype.handleInjects = function (msg) {
            var dict = global.Inject.getInjectDict();
            for (var key in dict) {
                var inject = dict[key];
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
            global.Inject.mapInject(target, type);
        };
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @memberof Core
         */
        Core.prototype.mapInjectValue = function (value, type) {
            global.Inject.mapInjectValue(value, type);
        };
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @memberof Core
         */
        Core.prototype.unmapInject = function (target) {
            global.Inject.unmapInject(target);
        };
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Core
         */
        Core.prototype.getInject = function (type) {
            return global.Inject.getInject(type);
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
         * @param {any} mediator 要注册的界面中介者实例
         * @memberof Core
         */
        Core.prototype.mapMediator = function (mediator) {
            if (this._mediatorList.indexOf(mediator) < 0)
                this._mediatorList.push(mediator);
        };
        /**
         * 注销界面中介者
         *
         * @param {any} mediator 要注销的界面中介者实例
         * @memberof Core
         */
        Core.prototype.unmapMediator = function (mediator) {
            var index = this._mediatorList.indexOf(mediator);
            if (index >= 0)
                this._mediatorList.splice(index, 1);
        };
        Core = Core_1 = __decorate([
            Injectable
        ], Core);
        return Core;
        var Core_1;
    }());
    exports.default = Core;
    /** 再额外导出一个core单例 */
    exports.core = global.Inject.getInject(Core);
});
define("engine/system/System", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
    */
    var System = (function () {
        function System() {
            this._timer = 0;
            var self = this;
            try {
                requestAnimationFrame(onRequestAnimationFrame);
            }
            catch (err) {
                // 如果不支持requestAnimationFrame则改用setTimeout计时，延迟时间1000/60毫秒
                var startTime = Date.now();
                setInterval(function () {
                    var curTime = Date.now();
                    // 赋值timer
                    self._timer = curTime - startTime;
                }, 1000 / 60);
            }
            function onRequestAnimationFrame(timer) {
                // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
                self._timer = timer;
                // 计划下一次执行
                requestAnimationFrame(onRequestAnimationFrame);
            }
        }
        /**
         * 获取从程序运行到当前所经过的毫秒数
         *
         * @returns {number} 毫秒数
         * @memberof System
         */
        System.prototype.getTimer = function () {
            return this._timer;
        };
        System = __decorate([
            Injectable
        ], System);
        return System;
    }());
    exports.default = System;
});
define("view/bridge/IBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("view/bridge/IHasBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/interfaces/IDisposable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/popup/IPopupPolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/popup/IPopup", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/popup/NonePopupPolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 无任何动画的弹出策略，可应用于任何显示层实现
    */
    var NonePopupPolicy = (function () {
        function NonePopupPolicy() {
        }
        NonePopupPolicy.prototype.open = function (popup, callback, from) {
            setTimeout(callback, 0);
        };
        NonePopupPolicy.prototype.close = function (popup, callback, from) {
            setTimeout(callback, 0);
        };
        return NonePopupPolicy;
    }());
    exports.NonePopupPolicy = NonePopupPolicy;
    /** 默认导出实例 */
    exports.default = new NonePopupPolicy();
});
define("engine/popup/PopupMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗相关的消息
    */
    var PopupMessage = (function () {
        function PopupMessage() {
        }
        /**
         * 打开弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        PopupMessage.POPUP_BEFORE_OPEN = "popupBeforeOpen";
        /**
         * 打开弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        PopupMessage.POPUP_AFTER_OPEN = "popupAfterOpen";
        /**
         * 关闭弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        PopupMessage.POPUP_BEFORE_CLOSE = "popupBeforeClose";
        /**
         * 关闭弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        PopupMessage.POPUP_AFTER_CLOSE = "popupAfterClose";
        return PopupMessage;
    }());
    exports.default = PopupMessage;
});
define("engine/popup/PopupManager", ["require", "exports", "core/Core", "engine/popup/NonePopupPolicy", "engine/popup/PopupMessage"], function (require, exports, Core_2, NonePopupPolicy_1, PopupMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
    */
    var PopupManager = (function () {
        function PopupManager() {
            this._popups = [];
        }
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPopup[]} 已打开弹窗数组
         * @memberof PopupManager
         */
        PopupManager.prototype.getOpened = function (cls) {
            if (!cls)
                return this._popups.concat();
            else
                return this._popups.filter(function (popup) { return popup.constructor == cls; });
        };
        /**
         * 打开一个弹窗
         *
         * @param {IPopup} popup 要打开的弹窗
         * @param {boolean} [isModel=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        PopupManager.prototype.open = function (popup, isModel, from) {
            if (isModel === void 0) { isModel = true; }
            if (this._popups.indexOf(popup) < 0) {
                var policy = popup.getPolicy();
                if (policy == null)
                    policy = NonePopupPolicy_1.default;
                // 派发消息
                Core_2.core.dispatch(PopupMessage_1.default.POPUP_BEFORE_OPEN, popup, isModel, from);
                // 调用回调
                popup.onBeforeOpen(isModel, from);
                // 调用策略接口
                policy.open(popup, function () {
                    // 派发消息
                    Core_2.core.dispatch(PopupMessage_1.default.POPUP_AFTER_OPEN, popup, isModel, from);
                    // 调用回调
                    popup.onAfterOpen(isModel, from);
                }, from);
            }
            return popup;
        };
        /**
         * 关闭一个弹窗
         *
         * @param {IPopup} popup 要关闭的弹窗
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        PopupManager.prototype.close = function (popup, to) {
            var index = this._popups.indexOf(popup);
            if (index >= 0) {
                var policy = popup.getPolicy();
                if (policy == null)
                    policy = NonePopupPolicy_1.default;
                // 派发消息
                Core_2.core.dispatch(PopupMessage_1.default.POPUP_BEFORE_CLOSE, popup, to);
                // 调用回调
                popup.onBeforeClose(to);
                // 调用策略接口
                policy.close(popup, function () {
                    // 派发消息
                    Core_2.core.dispatch(PopupMessage_1.default.POPUP_AFTER_CLOSE, popup, to);
                    // 调用回调
                    popup.onAfterClose(to);
                }, to);
            }
            return popup;
        };
        PopupManager = __decorate([
            Injectable
        ], PopupManager);
        return PopupManager;
    }());
    exports.default = PopupManager;
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * Explorer类记录浏览器相关数据
*/
define("engine/env/Explorer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 浏览器类型枚举
     *
     * @enum {number}
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
    })(ExplorerType = exports.ExplorerType || (exports.ExplorerType = {}));
    var Explorer = (function () {
        function Explorer() {
            //取得浏览器的userAgent字符串
            var userAgent = navigator.userAgent;
            // 判断浏览器类型
            var regExp;
            var result;
            if (window["ActiveXObject"] != null) {
                // IE浏览器
                this._type = ExplorerType.IE;
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
                this._type = ExplorerType.EDGE;
                // 获取Edge版本号
                regExp = new RegExp("Edge/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Firefox") > -1) {
                // Firefox浏览器
                this._type = ExplorerType.FIREFOX;
                // 获取Firefox版本号
                regExp = new RegExp("Firefox/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Opera") > -1) {
                // Opera浏览器
                this._type = ExplorerType.OPERA;
                // 获取Opera版本号
                regExp = new RegExp("OPR/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Chrome") > -1) {
                // Chrome浏览器
                this._type = ExplorerType.CHROME;
                // 获取Crhome版本号
                regExp = new RegExp("Chrome/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else if (userAgent.indexOf("Safari") > -1) {
                // Safari浏览器
                this._type = ExplorerType.SAFARI;
                // 获取Safari版本号
                regExp = new RegExp("Safari/([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
            else {
                // 其他浏览器
                this._type = ExplorerType.OTHERS;
                // 随意设置一个版本号
                this._version = "0.0";
            }
            // 赋值类型字符串
            this._typeStr = ExplorerType[this._type];
            // 赋值大版本号
            this._bigVersion = this._version.split(".")[0];
        }
        /**
         * 获取浏览器类型枚举值
         *
         * @returns {ExplorerType} 浏览器类型枚举值
         * @memberof Explorer
         */
        Explorer.prototype.getType = function () {
            return this._type;
        };
        /**
         * 获取浏览器类型字符串
         *
         * @returns {string} 浏览器类型字符串
         * @memberof Explorer
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
        Explorer = __decorate([
            Injectable
        ], Explorer);
        return Explorer;
    }());
    exports.default = Explorer;
});
define("engine/env/External", ["require", "exports"], function (require, exports) {
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
        External = __decorate([
            Injectable
        ], External);
        return External;
    }());
    exports.default = External;
});
define("engine/env/Hash", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
    */
    var Hash = (function () {
        function Hash() {
            this._params = {};
            this._direct = false;
            this._keepHash = false;
            this._hash = window.location.hash;
            var reg = /#([^\?&]+)(\?([^\?&=]+=[^\?&=]+)(&([^\?&=]+=[^\?&=]+))*)?/;
            var result = reg.exec(this._hash);
            if (result) {
                // 解析模块名称
                this._moduleName = result[1];
                // 解析模块参数
                var paramsStr = result[2];
                if (paramsStr != null) {
                    paramsStr = paramsStr.substr(1);
                    var params = paramsStr.split("&");
                    for (var i = 0, len = params.length; i < len; i++) {
                        var pair = params[i];
                        if (pair != null) {
                            var temp = pair.split("=");
                            // 键和值都要做一次URL解码
                            var key = decodeURIComponent(temp[0]);
                            var value = decodeURIComponent(temp[1]);
                            this._params[key] = value;
                        }
                    }
                }
                // 处理direct参数
                this._direct = (this._params.direct == "true");
                delete this._params.direct;
                // 处理keepHash参数
                this._keepHash = (this._params.keepHash == "true");
                delete this._params.keepHash;
                // 如果keepHash不是true，则移除哈希值
                if (!this._keepHash)
                    window.location.hash = "";
            }
        }
        /**
         * 获取原始的哈希字符串
         *
         * @returns {string}
         * @memberof Hash
         */
        Hash.prototype.getHash = function () {
            return this._hash;
        };
        /**
         * 获取模块名
         *
         * @returns {string} 模块名
         * @memberof Hash
         */
        Hash.prototype.getModuleName = function () {
            return this._moduleName;
        };
        /**
         * 获取传递给模块的参数
         *
         * @returns {{[key:string]:string}} 模块参数
         * @memberof Hash
         */
        Hash.prototype.getParams = function () {
            return this._params;
        };
        /**
         * 获取是否直接跳转模块
         *
         * @returns {boolean} 是否直接跳转模块
         * @memberof Hash
         */
        Hash.prototype.getDirect = function () {
            return this._direct;
        };
        /**
         * 获取是否保持哈希值
         *
         * @returns {boolean} 是否保持哈希值
         * @memberof Hash
         */
        Hash.prototype.getKeepHash = function () {
            return this._keepHash;
        };
        /**
         * 获取指定哈希参数
         *
         * @param {string} key 参数名
         * @returns {string} 参数值
         * @memberof Hash
         */
        Hash.prototype.getParam = function (key) {
            return this._params[key];
        };
        Hash = __decorate([
            Injectable
        ], Hash);
        return Hash;
    }());
    exports.default = Hash;
});
define("engine/env/Query", ["require", "exports"], function (require, exports) {
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
        Query = __decorate([
            Injectable
        ], Query);
        return Query;
    }());
    exports.default = Query;
});
define("engine/Engine", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/ 
define("view/messages/ViewMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 表现层消息
    */
    var ViewMessage = (function () {
        function ViewMessage() {
        }
        /**
         * 初始化表现层实例前的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        ViewMessage.VIEW_BEFORE_INIT = "viewBeforeInit";
        /**
         * 初始化表现层实例后的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        ViewMessage.VIEW_AFTER_INIT = "viewAfterInit";
        /**
         * 所有表现层实例都初始化完毕的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        ViewMessage.VIEW_ALL_INIT = "viewAllInit";
        return ViewMessage;
    }());
    exports.default = ViewMessage;
});
define("view/View", ["require", "exports", "core/Core", "view/messages/ViewMessage"], function (require, exports, Core_3, ViewMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var View = (function () {
        function View() {
            this._viewDict = {};
        }
        /**
         * 注册一个表现层桥实例到框架中
         *
         * @param {IBridge} view
         * @memberof View
         */
        View.prototype.registerBridge = function (view) {
            var _this = this;
            var type = view.getType();
            if (!this._viewDict[type]) {
                var data = { view: view, inited: false };
                this._viewDict[type] = data;
                // 派发消息
                Core_3.core.dispatch(ViewMessage_1.default.VIEW_BEFORE_INIT, view);
                // 初始化该表现层实例
                view.initView(function () {
                    // 派发消息
                    Core_3.core.dispatch(ViewMessage_1.default.VIEW_AFTER_INIT, view);
                    // 设置初始化完毕属性
                    data.inited = true;
                    // 测试是否全部初始化完毕
                    _this.testAllInit();
                });
            }
        };
        View.prototype.testAllInit = function () {
        };
        View = __decorate([
            Injectable
        ], View);
        return View;
    }());
    exports.default = View;
});
//# sourceMappingURL=Olympus.js.map