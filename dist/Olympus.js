var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
define("core/interfaces/IDisposable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
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
        /**
         * 获取消息类型字符串
         *
         * @returns {string} 消息类型字符串
         * @memberof Message
         */
        Message.prototype.getType = function () {
            return this._type;
        };
        return Message;
    }());
    exports.default = Message;
});
define("core/message/CoreMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-13
     * @modify date 2017-09-13
     *
     * 核心事件类型
    */
    var CoreMessage = (function () {
        function CoreMessage(type, message) {
            this._type = type;
            this._message = message;
        }
        /**
         * 获取事件类型
         *
         * @returns {string}
         * @memberof CoreMessage
         */
        CoreMessage.prototype.getType = function () {
            return this._type;
        };
        /**
         * 获取发送到框架内核的消息体
         *
         * @returns {IMessage}
         * @memberof CoreMessage
         */
        CoreMessage.prototype.getMessage = function () {
            return this._message;
        };
        /**
         * 任何消息派发到框架后都会派发这个消息
         *
         * @static
         * @type {string}
         * @memberof CoreMessage
         */
        CoreMessage.MESSAGE_DISPATCHED = "messageDispatched";
        return CoreMessage;
    }());
    exports.default = CoreMessage;
});
define("core/command/Command", ["require", "exports", "core/Core"], function (require, exports, Core_1) {
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
        Command.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            Core_1.core.dispatch.apply(Core_1.core, [typeOrMsg].concat(params));
        };
        return Command;
    }());
    exports.default = Command;
});
define("core/command/ICommandConstructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 对象工具集
*/
define("utils/ObjectUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    function extendObject(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) {
            if (!source)
                return;
            for (var propName in source) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            }
        });
        return target;
    }
    exports.extendObject = extendObject;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    function cloneObject(target, deep) {
        if (deep === void 0) { deep = false; }
        if (target == null)
            return null;
        var newObject = {};
        for (var key in target) {
            var value = target[key];
            if (deep && typeof value == "object") {
                // 如果是深表复制，则需要递归复制子对象
                value = cloneObject(value, true);
            }
            newObject[key] = value;
        }
        return newObject;
    }
    exports.cloneObject = cloneObject;
    /**
     * 生成一个随机ID
     */
    function getGUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }
    exports.getGUID = getGUID;
    var _getAutoIncIdMap = {};
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    function getAutoIncId(type) {
        var index = _getAutoIncIdMap[type] || 0;
        _getAutoIncIdMap[type] = index++;
        return type + "-" + index;
    }
    exports.getAutoIncId = getAutoIncId;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    function isEmpty(obj) {
        var result = true;
        for (var key in obj) {
            result = false;
            break;
        }
        return result;
    }
    exports.isEmpty = isEmpty;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    function trimData(data) {
        for (var key in data) {
            if (data[key] == null) {
                delete data[key];
            }
        }
        return data;
    }
    exports.trimData = trimData;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    exports.extendsClass = (function () {
        var extendStatics = Object["setPrototypeOf"] ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
});
define("utils/ConstructUtil", ["require", "exports", "utils/ObjectUtil"], function (require, exports, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-13
     * @modify date 2017-09-13
     *
     * 装饰器工具集
    */
    var instanceDict = {};
    function handleInstance(instance) {
        var cls = instance.constructor;
        var key = cls && cls.toString();
        var funcs = instanceDict[key];
        if (funcs)
            for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {
                var func = funcs_1[_i];
                func(instance);
            }
    }
    /**
     * 包装一个类型，监听类型的实例化操作
     *
     * @export
     * @param {IConstructor} cls 要监听构造的类型构造器
     * @returns {IConstructor} 新的构造函数
     */
    function wrapConstruct(cls) {
        // 创建一个新的构造函数
        var func;
        eval('func = function ' + cls["name"] + '(){onConstruct(this)}');
        // 动态设置继承
        ObjectUtil_1.extendsClass(func, cls);
        // 为新的构造函数打一个标签，用以记录原始的构造函数
        func["__ori_constructor__"] = cls;
        // 为了伪装得更像，将toString也替换掉
        func.toString = function () { return cls.toString(); };
        // 返回新的构造函数
        return func;
        function onConstruct(instance) {
            // 恢复__proto__
            instance["__proto__"] = cls.prototype;
            // 调用父类构造函数构造实例
            cls.apply(instance, arguments);
            // 调用回调
            handleInstance(instance);
        }
    }
    exports.wrapConstruct = wrapConstruct;
    /**
     * 监听类型的实例化
     *
     * @export
     * @param {IConstructor} cls 要监听实例化的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    function listenConstruct(cls, handler) {
        var key = cls.toString();
        var list = instanceDict[key];
        if (!list)
            instanceDict[key] = list = [];
        if (list.indexOf(handler) < 0)
            list.push(handler);
    }
    exports.listenConstruct = listenConstruct;
    /**
     * 移除实例化监听
     *
     * @export
     * @param {IConstructor} cls 要移除监听实例化的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    function unlistenConstruct(cls, handler) {
        var key = cls.toString();
        var list = instanceDict[key];
        if (list) {
            var index = list.indexOf(handler);
            if (index >= 0)
                list.splice(index, 1);
        }
    }
    exports.unlistenConstruct = unlistenConstruct;
    /**
     * 监听类型销毁（如果能够销毁的话，需要类型具有dispose方法），该监听不需要移除
     *
     * @export
     * @param {IConstructor} cls 要监听销毁的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    function listenDispose(cls, handler) {
        var dispose = cls.prototype.dispose;
        // 判断类型是否具有dispose方法
        if (dispose) {
            // 替换dispose方法
            cls.prototype.dispose = function () {
                // 调用回调
                handler(this);
                // 调用原始dispose方法执行销毁
                return dispose.apply(this, arguments);
            };
        }
    }
    exports.listenDispose = listenDispose;
});
define("core/interfaces/IDispatcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path="./global/Patch.ts"/>
/// <reference path="./global/Decorator.ts"/>
define("core/Core", ["require", "exports", "core/message/Message", "core/message/CoreMessage", "utils/ConstructUtil"], function (require, exports, Message_1, CoreMessage_1, ConstructUtil_1) {
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
            /*********************** 下面是内核消息系统 ***********************/
            this._listenerDict = {};
            /*********************** 下面是依赖注入系统 ***********************/
            this._injectDict = {};
            /*********************** 下面是内核命令系统 ***********************/
            this._commandDict = {};
            // 进行单例判断
            if (Core._instance)
                throw new Error("已生成过Core实例，不允许多次生成");
            // 赋值单例
            Core._instance = this;
            // 注入自身
            this.mapInjectValue(this);
        }
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
        Core.prototype.doDispatch = function (msg) {
            // 触发命令
            this.handleCommands(msg);
            // 触发用listen形式监听的消息
            this.handleMessages(msg);
        };
        /** dispatch方法实现 */
        Core.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            // 统一消息对象
            var msg = typeOrMsg;
            if (typeof typeOrMsg == "string") {
                msg = new Message_1.default(typeOrMsg);
                msg.params = params;
            }
            // 派发消息
            this.doDispatch(msg);
            // 额外派发一个通用事件
            this.doDispatch(new CoreMessage_1.default(CoreMessage_1.default.MESSAGE_DISPATCHED, msg));
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
            // 需要用原始的构造函数取
            type = type["__ori_constructor__"] || type;
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
        return Core;
    }());
    exports.default = Core;
    /** 再额外导出一个单例 */
    exports.core = new Core();
    /*********************** 下面是装饰器方法实现 ***********************/
    /** Injectable，仅生成类型实例并注入 */
    window["Injectable"] = function Injectable(cls) {
        var params = cls;
        if (params.type instanceof Function) {
            // 需要转换注册类型，需要返回一个ClassDecorator
            return function (realCls) {
                exports.core.mapInject(realCls, params.type);
            };
        }
        else {
            // 不需要转换注册类型，直接注册
            exports.core.mapInject(cls);
        }
    };
    /** Model */
    window["Model"] = function Model(cls) {
        // Model先进行托管
        var result = ConstructUtil_1.wrapConstruct(cls);
        // 然后要注入新生成的类
        exports.core.mapInject(result);
        // 返回结果
        return result;
    };
    /** Mediator */
    window["Mediator"] = function Mediator(cls) {
        // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
        if (!cls.prototype.dispose)
            console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
        return ConstructUtil_1.wrapConstruct(cls);
    };
    /** Inject */
    window["Inject"] = function Inject(cls) {
        return function (prototype, propertyKey) {
            // 监听实例化
            ConstructUtil_1.listenConstruct(prototype.constructor, function (instance) {
                Object.defineProperty(instance, propertyKey, {
                    configurable: true,
                    enumerable: true,
                    get: function () { return exports.core.getInject(cls); }
                });
            });
        };
    };
    /** Handler */
    window["Handler"] = function Handler(type) {
        return function (prototype, propertyKey, descriptor) {
            // 监听实例化
            ConstructUtil_1.listenConstruct(prototype.constructor, function (instance) {
                exports.core.listen(type, instance[propertyKey], instance);
            });
            // 监听销毁
            ConstructUtil_1.listenDispose(prototype.constructor, function (instance) {
                exports.core.unlisten(type, instance[propertyKey], instance);
            });
        };
    };
});
define("engine/system/System", ["require", "exports", "core/Core"], function (require, exports, Core_2) {
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
            // 这里尝试一下TS的Tuple类型——Raykid
            this._nextFrameList = [];
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
                    // 调用tick方法
                    self.tick();
                }, 1000 / 60);
            }
            function onRequestAnimationFrame(timer) {
                // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
                self._timer = timer;
                // 调用tick方法
                self.tick();
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
        System.prototype.tick = function () {
            // 调用下一帧回调
            for (var i = 0, len = this._nextFrameList.length; i < len; i++) {
                var data = this._nextFrameList.shift();
                data[0].apply(data[1], data[2]);
            }
        };
        /**
         * 在下一帧执行某个方法
         *
         * @param {Function} handler 希望在下一帧执行的某个方法
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 方法参数列表
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        System.prototype.nextFrame = function (handler, thisArg) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var data = [handler, thisArg, args];
            this._nextFrameList.push(data);
            return {
                cancel: function () {
                    var index = _this._nextFrameList.indexOf(data);
                    if (index >= 0)
                        _this._nextFrameList.splice(index, 1);
                }
            };
        };
        /**
         * 设置延迟回调
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        System.prototype.setTimeout = function (duration, handler, thisArg) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var startTimer = this._timer;
            // 启动计时器
            var nextFrame = this.nextFrame(tick, this);
            function tick() {
                var delta = this._timer - startTimer;
                if (delta >= duration) {
                    nextFrame = null;
                    handler.apply(thisArg, args);
                }
                else {
                    nextFrame = this.nextFrame(tick, this);
                }
            }
            return {
                cancel: function () {
                    nextFrame && nextFrame.cancel();
                    nextFrame = null;
                }
            };
        };
        /**
         * 设置延时间隔
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        System.prototype.setInterval = function (duration, handler, thisArg) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var timeout = this.setTimeout(duration, onTimeout, this);
            function onTimeout() {
                // 触发回调
                handler.apply(thisArg, args);
                // 继续下一次
                timeout = this.setTimeout(duration, onTimeout, this);
            }
            return {
                cancel: function () {
                    timeout && timeout.cancel();
                    timeout = null;
                }
            };
        };
        System = __decorate([
            Injectable
        ], System);
        return System;
    }());
    exports.default = System;
    /** 再额外导出一个单例 */
    exports.system = Core_2.core.getInject(System);
});
define("engine/model/Model", ["require", "exports", "core/Core"], function (require, exports, Core_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * Model的基类，也可以不继承该基类，因为Model是很随意的东西
    */
    var Model = (function () {
        function Model() {
        }
        Model.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            Core_3.core.dispatch.apply(Core_3.core, [typeOrMsg].concat(params));
        };
        return Model;
    }());
    exports.default = Model;
});
define("view/bridge/IBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("view/bridge/IHasBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("view/mediator/IMediator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/component/Mediator", ["require", "exports", "core/Core"], function (require, exports, Core_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 组件界面中介者基类
    */
    var Mediator = (function () {
        function Mediator(bridge, skin) {
            this._isDestroyed = false;
            this._listeners = [];
            this._bridge = bridge;
            if (skin)
                this.setSkin(skin);
        }
        /**
         * 获取表现层桥
         *
         * @returns {IBridge} 表现层桥
         * @memberof Mediator
         */
        Mediator.prototype.getBridge = function () {
            return this._bridge;
        };
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
            // 调用桥接口
            this._bridge.mapListener(target, type, handler, thisArg);
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
                    // 调用桥接口
                    this._bridge.unmapListener(target, type, handler, thisArg);
                    // 移除记录
                    this._listeners.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        Mediator.prototype.unmapAllListeners = function () {
            for (var i = 0, len = this._listeners.length; i < len; i++) {
                var data = this._listeners[i];
                // 调用桥接口
                this._bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
                // 移除记录
                this._listeners.splice(i, 1);
            }
        };
        Mediator.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            Core_4.core.dispatch.apply(Core_4.core, [typeOrMsg].concat(params));
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
define("engine/panel/IPanelPolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/panel/IPanel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/panel/NonePanelPolicy", ["require", "exports"], function (require, exports) {
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
    var NonePanelPolicy = (function () {
        function NonePanelPolicy() {
        }
        NonePanelPolicy.prototype.pop = function (panel, callback, from) {
            setTimeout(callback, 0);
        };
        NonePanelPolicy.prototype.drop = function (panel, callback, from) {
            setTimeout(callback, 0);
        };
        return NonePanelPolicy;
    }());
    exports.NonePanelPolicy = NonePanelPolicy;
    /** 默认导出实例 */
    exports.default = new NonePanelPolicy();
});
define("engine/panel/PanelMessage", ["require", "exports"], function (require, exports) {
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
    var PanelMessage = (function () {
        function PanelMessage() {
        }
        /**
         * 打开弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        PanelMessage.PANEL_BEFORE_POP = "panelBeforePop";
        /**
         * 打开弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        PanelMessage.PANEL_AFTER_POP = "panelAfterPop";
        /**
         * 关闭弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        PanelMessage.PANEL_BEFORE_DROP = "panelBeforeDrop";
        /**
         * 关闭弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        PanelMessage.PANEL_AFTER_DROP = "panelAfterDrop";
        return PanelMessage;
    }());
    exports.default = PanelMessage;
});
define("engine/panel/PanelManager", ["require", "exports", "core/Core", "engine/panel/NonePanelPolicy", "engine/panel/PanelMessage"], function (require, exports, Core_5, NonePanelPolicy_1, PanelMessage_1) {
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
    var PanelManager = (function () {
        function PanelManager() {
            this._panels = [];
        }
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPanel[]} 已打开弹窗数组
         * @memberof PanelManager
         */
        PanelManager.prototype.getOpened = function (cls) {
            if (!cls)
                return this._panels.concat();
            else
                return this._panels.filter(function (panel) { return panel.constructor == cls; });
        };
        /**
         * 打开一个弹窗
         *
         * @param {IPanel} panel 要打开的弹窗
         * @param {*} [data] 数据
         * @param {boolean} [isModel=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        PanelManager.prototype.open = function (panel, data, isModel, from) {
            if (isModel === void 0) { isModel = true; }
            if (this._panels.indexOf(panel) < 0) {
                var policy = panel.getPolicy();
                if (policy == null)
                    policy = NonePanelPolicy_1.default;
                // 派发消息
                Core_5.core.dispatch(PanelMessage_1.default.PANEL_BEFORE_POP, panel, isModel, from);
                // 调用回调
                panel.onBeforePop && panel.onBeforePop(data, isModel, from);
                // 调用策略接口
                policy.pop(panel, function () {
                    // 派发消息
                    Core_5.core.dispatch(PanelMessage_1.default.PANEL_AFTER_POP, panel, isModel, from);
                    // 调用回调
                    panel.onAfterPop && panel.onAfterPop(data, isModel, from);
                }, from);
            }
            return panel;
        };
        /**
         * 关闭一个弹窗
         *
         * @param {IPanel} panel 要关闭的弹窗
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        PanelManager.prototype.close = function (panel, data, to) {
            var index = this._panels.indexOf(panel);
            if (index >= 0) {
                var policy = panel.getPolicy();
                if (policy == null)
                    policy = NonePanelPolicy_1.default;
                // 派发消息
                Core_5.core.dispatch(PanelMessage_1.default.PANEL_BEFORE_DROP, panel, to);
                // 调用回调
                panel.onBeforeDrop && panel.onBeforeDrop(data, to);
                // 调用策略接口
                policy.drop(panel, function () {
                    // 派发消息
                    Core_5.core.dispatch(PanelMessage_1.default.PANEL_AFTER_DROP, panel, to);
                    // 调用回调
                    panel.onAfterDrop && panel.onAfterDrop(data, to);
                }, to);
            }
            return panel;
        };
        PanelManager = __decorate([
            Injectable
        ], PanelManager);
        return PanelManager;
    }());
    exports.default = PanelManager;
    /** 再额外导出一个单例 */
    exports.panelManager = Core_5.core.getInject(PanelManager);
});
define("engine/panel/PanelMediator", ["require", "exports", "engine/component/Mediator", "engine/panel/PanelManager"], function (require, exports, Mediator_1, PanelManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 实现了IPanel接口的弹窗中介者基类
    */
    var PanelMediator = (function (_super) {
        __extends(PanelMediator, _super);
        function PanelMediator(bridge, skin, policy) {
            var _this = _super.call(this, bridge, skin) || this;
            _this.setPolicy(policy);
            return _this;
        }
        /**
         * 获取弹出策略
         *
         * @returns {IPanelPolicy} 弹出策略
         * @memberof PanelMediator
         */
        PanelMediator.prototype.getPolicy = function () {
            return this._policy;
        };
        /**
         * 设置弹出策略
         *
         * @param {IPanelPolicy} policy 设置弹出策略
         * @memberof PanelMediator
         */
        PanelMediator.prototype.setPolicy = function (policy) {
            this._policy = policy;
        };
        /**
         * 弹出当前弹窗（等同于调用PanelManager.open方法）
         *
         * @param {*} [data] 数据
         * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
         * @param {{x:number, y:number}} [from] 弹出点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        PanelMediator.prototype.pop = function (data, isModel, from) {
            return PanelManager_1.panelManager.open(this, data, isModel, from);
        };
        /**
         * 关闭当前弹窗（等同于调用PanelManager.close方法）
         *
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        PanelMediator.prototype.drop = function (data, to) {
            return PanelManager_1.panelManager.close(this, data, to);
        };
        return PanelMediator;
    }(Mediator_1.default));
    exports.default = PanelMediator;
});
define("engine/scene/IScenePolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/scene/IScene", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/scene/NoneScenePolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 无任何动画的场景策略，可应用于任何显示层实现
    */
    var NoneScenePolicy = (function () {
        function NoneScenePolicy() {
        }
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        NoneScenePolicy.prototype.prepareSwitch = function (from, to) {
            // 这个策略里啥也不用准备
        };
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        NoneScenePolicy.prototype.switch = function (from, to, callback) {
            // 直接延迟到下一帧回调（不能同步回调，否则可能会出问题）
            setTimeout(callback, 0);
        };
        return NoneScenePolicy;
    }());
    exports.NoneScenePolicy = NoneScenePolicy;
    /** 默认导出实例 */
    exports.default = new NoneScenePolicy();
});
define("engine/scene/SceneMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景相关的消息
    */
    var SceneMessage = (function () {
        function SceneMessage() {
        }
        /**
         * 切换场景前的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        SceneMessage.SCENE_BEFORE_CHANGE = "sceneBeforeChange";
        /**
         * 切换场景后的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        SceneMessage.SCENE_AFTER_CHANGE = "sceneBeforeChange";
        return SceneMessage;
    }());
    exports.default = SceneMessage;
});
define("utils/SyncUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 同步工具集，用于对多个
    */
    var _cache = {};
    /**
     * 判断是否正在进行操作
     *
     * @export
     * @param {Function} fn 要执行的方法
     * @returns {boolean} 队列是否正在操作
     */
    function isOperating(fn) {
        var ctx = _cache[fn.toString()];
        return (ctx != null && ctx.operating);
    }
    exports.isOperating = isOperating;
    /**
     * 开始同步操作，所有传递了相同name的操作会被以队列方式顺序执行
     *
     * @export
     * @param name 一个队列的名字
     * @param {Function} fn 要执行的方法
     * @param {*} [thisArg] 方法this对象
     * @param {...any[]} [args] 方法参数
     */
    function wait(name, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var ctx = _cache[name];
        if (ctx == null) {
            _cache[name] = ctx = { operating: false, datas: [] };
        }
        if (ctx.operating) {
            // 队列正在执行，推入缓存
            ctx.datas.push({ fn: fn, thisArg: thisArg, args: args });
        }
        else {
            // 队列没有在执行，直接执行
            ctx.operating = true;
            fn.apply(thisArg, args);
        }
    }
    exports.wait = wait;
    /**
     * 完成一步操作并唤醒后续操作
     *
     * @export
     * @param {string} name 队列名字
     * @returns {void}
     */
    function notify(name) {
        var ctx = _cache[name];
        if (ctx == null || ctx.datas.length <= 0) {
            // 队列执行完了，直接结束
            ctx.operating = false;
            return;
        }
        var data = ctx.datas.shift();
        data.fn.apply(data.thisArg, data.args);
    }
    exports.notify = notify;
});
define("engine/scene/SceneManager", ["require", "exports", "core/Core", "engine/scene/NoneScenePolicy", "engine/scene/SceneMessage", "utils/SyncUtil"], function (require, exports, Core_6, NoneScenePolicy_1, SceneMessage_1, SyncUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 弹窗管理器，包含切换场景、push场景、pop场景功能
    */
    var SYNC_NAME = "SceneManager_sync";
    var ChangeType;
    (function (ChangeType) {
        ChangeType[ChangeType["Switch"] = 0] = "Switch";
        ChangeType[ChangeType["Push"] = 1] = "Push";
        ChangeType[ChangeType["Pop"] = 2] = "Pop";
    })(ChangeType || (ChangeType = {}));
    var SceneManager = (function () {
        function SceneManager() {
            this._sceneStack = [];
        }
        /**
         * 获取当前场景
         *
         * @returns {IScene} 当前场景
         * @memberof SceneManager
         */
        SceneManager.prototype.getCurScene = function () {
            return this._sceneStack[this._sceneStack.length - 1];
        };
        /**
         * 获取活动场景个数
         *
         * @returns {number} 活动场景个数
         * @memberof SceneManager
         */
        SceneManager.prototype.getActiveCount = function () {
            return this._sceneStack.length;
        };
        /**
         * 切换场景，替换当前场景，当前场景会被销毁
         *
         * @param {IScene} scene 要切换到的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        SceneManager.prototype.switch = function (scene, data) {
            var _this = this;
            // 非空判断
            if (scene == null)
                return;
            // 如果切入的是第一个场景，则改用pushScene操作
            if (this.getActiveCount() == 0)
                return this.push(scene, data);
            // 同步执行
            SyncUtil_1.wait(SYNC_NAME, this.doChange, this, this.getCurScene(), scene, data, scene.getPolicy(), ChangeType.Switch, function () { return _this._sceneStack[length - 1] = scene; });
            return scene;
        };
        /**
         * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
         *
         * @param {IScene} scene 要推入的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        SceneManager.prototype.push = function (scene, data) {
            var _this = this;
            // 非空判断
            if (scene == null)
                return scene;
            // 同步执行
            SyncUtil_1.wait(SYNC_NAME, this.doChange, this, this.getCurScene(), scene, data, scene.getPolicy(), ChangeType.Push, function () { return _this._sceneStack.push(scene); });
            return scene;
        };
        /**
         * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
         *
         * @param {IScene} scene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换弹出操作
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        SceneManager.prototype.pop = function (scene, data) {
            // 非空判断
            if (scene == null)
                return scene;
            // 同步执行
            SyncUtil_1.wait(SYNC_NAME, this.doPop, this, scene, data);
            return scene;
        };
        SceneManager.prototype.doPop = function (scene, data) {
            var _this = this;
            // 如果是最后一个场景则什么都不做
            var length = this.getActiveCount();
            if (length <= 1) {
                console.log("已经是最后一个场景，无法执行popScene操作");
                // 完成步骤
                SyncUtil_1.notify(SYNC_NAME);
                return;
            }
            // 验证是否是当前场景，不是则直接移除，不使用Policy
            var to = this._sceneStack[this._sceneStack.length - 2];
            var policy = scene.getPolicy();
            var index = this._sceneStack.indexOf(scene);
            if (index != length - 1) {
                to = null;
                policy = NoneScenePolicy_1.default;
            }
            // 执行切换
            this.doChange(scene, to, data, policy, ChangeType.Pop, function () { return _this._sceneStack.splice(index, 1); });
        };
        SceneManager.prototype.doChange = function (from, to, data, policy, type, complete) {
            if (policy == null)
                policy = NoneScenePolicy_1.default;
            // 如果要交替的两个场景不是同一个类型的场景，则暂不提供切换策略的支持，直接套用NoneScenePolicy
            if (from == null || to.getBridge().getType() != from.getBridge().getType())
                policy = NoneScenePolicy_1.default;
            // 派发事件
            Core_6.core.dispatch(SceneMessage_1.default.SCENE_BEFORE_CHANGE, from, to);
            // 获取接口引用
            var prepareFunc;
            var doFunc;
            switch (type) {
                case ChangeType.Switch:
                    prepareFunc = policy.prepareSwitch;
                    doFunc = policy.switch;
                    break;
                case ChangeType.Push:
                    prepareFunc = policy.preparePush || policy.prepareSwitch;
                    doFunc = policy.push || policy.switch;
                    break;
                case ChangeType.Pop:
                    prepareFunc = policy.preparePop || policy.prepareSwitch;
                    doFunc = policy.pop || policy.switch;
                    break;
            }
            // 调用准备接口
            prepareFunc.call(policy, from, to);
            // 前置处理
            from && from.onBeforeOut && from.onBeforeOut(to, data);
            to && to.onBeforeIn && to.onBeforeIn(from, data);
            // 调用切换接口
            doFunc.call(policy, from, to, function () {
                complete();
                // 后置处理
                from && from.onAfterOut && from.onAfterOut(to, data);
                to && to.onAfterIn && to.onAfterIn(from, data);
                // 派发事件
                Core_6.core.dispatch(SceneMessage_1.default.SCENE_AFTER_CHANGE, from, to);
                // 完成步骤
                SyncUtil_1.notify(SYNC_NAME);
            });
        };
        SceneManager = __decorate([
            Injectable
        ], SceneManager);
        return SceneManager;
    }());
    exports.default = SceneManager;
    /** 再额外导出一个单例 */
    exports.sceneManager = Core_6.core.getInject(SceneManager);
});
define("engine/scene/SceneMediator", ["require", "exports", "engine/component/Mediator", "engine/scene/SceneManager"], function (require, exports, Mediator_2, SceneManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 实现了IScene接口的场景中介者基类
    */
    var SceneMediator = (function (_super) {
        __extends(SceneMediator, _super);
        function SceneMediator(bridge, skin, policy) {
            var _this = _super.call(this, bridge, skin) || this;
            _this.setPolicy(policy);
            return _this;
        }
        /**
         * 获取弹出策略
         *
         * @returns {IScenePolicy} 弹出策略
         * @memberof SceneMediator
         */
        SceneMediator.prototype.getPolicy = function () {
            return this._policy;
        };
        /**
         * 设置弹出策略
         *
         * @param {IScenePolicy} policy 弹出策略
         * @memberof SceneMediator
         */
        SceneMediator.prototype.setPolicy = function (policy) {
            this._policy = policy;
        };
        /**
         * 切入当前场景（相当于调用SceneManager.switch方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        SceneMediator.prototype.switch = function (data) {
            return SceneManager_1.sceneManager.switch(this, data);
        };
        /**
         * 推入当前场景（相当于调用SceneManager.push方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        SceneMediator.prototype.push = function (data) {
            return SceneManager_1.sceneManager.push(this, data);
        };
        /**
         * 弹出当前场景（相当于调用SceneManager.pop方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        SceneMediator.prototype.pop = function (data) {
            return SceneManager_1.sceneManager.pop(this, data);
        };
        return SceneMediator;
    }(Mediator_2.default));
    exports.default = SceneMediator;
});
define("engine/net/IRequestPolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/net/DataType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 请求或返回数据结构体
    */
    var DataType = (function () {
        function DataType() {
        }
        /**
         * 解析后端返回的JSON对象，生成结构体
         *
         * @param {any} data 后端返回的JSON对象
         * @returns {DataType} 结构体对象
         * @memberof DataType
         */
        DataType.prototype.parse = function (data) {
            this.__rawData = data;
            this.doParse(data);
            return this;
        };
        return DataType;
    }());
    exports.default = DataType;
});
define("engine/net/ResponseData", ["require", "exports", "engine/net/DataType"], function (require, exports, DataType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResponseData = (function (_super) {
        __extends(ResponseData, _super);
        function ResponseData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ResponseData;
    }(DataType_1.default));
    exports.default = ResponseData;
});
define("engine/net/RequestData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequestData = (function () {
        function RequestData() {
            /**
             * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
             *
             * @type {*}
             * @memberof RequestData
             */
            this.__userData = {};
        }
        /**
         * 获取请求消息类型字符串
         *
         * @returns {string} 请求消息类型字符串
         * @memberof RequestData
         */
        RequestData.prototype.getType = function () {
            return this.__params.type;
        };
        return RequestData;
    }());
    exports.default = RequestData;
    /** 导出公共消息参数对象 */
    exports.commonData = {};
});
define("engine/module/IModule", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/module/IModuleConstructor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/module/ModuleManager", ["require", "exports", "core/Core"], function (require, exports, Core_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
    */
    var ModuleManager = (function () {
        function ModuleManager() {
            this._moduleStack = [];
        }
        /**
         * 打开模块
         *
         * @param {IModuleConstructor} moduleCls
         * @param {*} [data]
         * @param {boolean} [replace=false]
         * @memberof ModuleManager
         */
        ModuleManager.prototype.openModule = function (moduleCls, data, replace) {
            if (replace === void 0) { replace = false; }
        };
        /**
         *
         *
         * @param {IModuleConstructor} moduleCls
         * @param {*} [data]
         * @param {boolean} [replace=false]
         * @memberof ModuleManager
         */
        ModuleManager.prototype.closeModule = function (moduleCls, data, replace) {
            if (replace === void 0) { replace = false; }
        };
        ModuleManager = __decorate([
            Injectable
        ], ModuleManager);
        return ModuleManager;
    }());
    exports.default = ModuleManager;
    /** 再额外导出一个单例 */
    exports.moduleManager = Core_7.core.getInject(ModuleManager);
});
define("engine/module/Module", ["require", "exports", "core/Core"], function (require, exports, Core_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * 模块基类
    */
    var Module = (function () {
        function Module() {
        }
        /**
         * 列出模块所需CSS资源URL，可以重写
         *
         * @returns {string[]} CSS资源列表
         * @memberof Module
         */
        Module.prototype.listStyleFiles = function () {
            return null;
        };
        /**
         * 列出模块所需JS资源URL，可以重写
         *
         * @returns {string[]} js资源列表
         * @memberof Module
         */
        Module.prototype.listJsFiles = function () {
            return null;
        };
        /**
         * 列出模块初始化请求，可以重写
         *
         * @returns {RequestData[]} 模块的初始化请求列表
         * @memberof Module
         */
        Module.prototype.listInitRequests = function () {
            return null;
        };
        /**
         * 获取模块名称，默认使用类名，可以重写
         *
         * @returns {string} 模块名称
         * @memberof Module
         */
        Module.prototype.getName = function () {
            var cls = this["constructor"];
            return cls && cls.name;
        };
        /**
         * 打开模块时调用，可以重写
         *
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        Module.prototype.onOpen = function (data) {
        };
        /**
         * 关闭模块时调用，可以重写
         *
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        Module.prototype.onClose = function (data) {
        };
        /**
         * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
         *
         * @param {IModule} from 从哪个模块切换过来
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        Module.prototype.onActivate = function (from, data) {
        };
        /**
         * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
         *
         * @param {IModule} to 要切换到哪个模块
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        Module.prototype.onDeactivate = function (to, data) {
        };
        Module.prototype.dispatch = function (typeOrMsg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            Core_8.core.dispatch.apply(Core_8.core, [typeOrMsg].concat(params));
        };
        /**
         * 销毁模块，可以重写
         *
         * @memberof Module
         */
        Module.prototype.dispose = function () {
        };
        return Module;
    }());
    exports.default = Module;
});
define("engine/env/Explorer", ["require", "exports", "core/Core"], function (require, exports, Core_9) {
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
    /** 再额外导出一个单例 */
    exports.explorer = Core_9.core.getInject(Explorer);
});
define("engine/env/External", ["require", "exports", "core/Core"], function (require, exports, Core_10) {
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
    /** 再额外导出一个单例 */
    exports.external = Core_10.core.getInject(External);
});
define("engine/env/Hash", ["require", "exports", "core/Core"], function (require, exports, Core_11) {
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
    /** 再额外导出一个单例 */
    exports.hash = Core_11.core.getInject(Hash);
});
define("engine/env/Query", ["require", "exports", "core/Core"], function (require, exports, Core_12) {
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
    /** 再额外导出一个单例 */
    exports.query = Core_12.core.getInject(Query);
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
define("engine/net/NetMessage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯相关的消息
    */
    var NetMessage = (function () {
        function NetMessage() {
        }
        /**
         * 发送网络请求消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        NetMessage.NET_REQUEST = "netRequest";
        /**
         * 接受网络返回消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        NetMessage.NET_RESPONSE = "netResponse";
        /**
         * 网络请求错误消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        NetMessage.NET_ERROR = "netError";
        return NetMessage;
    }());
    exports.default = NetMessage;
});
/// <reference path="../global/Decorator.ts"/>
define("engine/net/NetManager", ["require", "exports", "core/Core", "core/message/CoreMessage", "utils/ObjectUtil", "utils/ConstructUtil", "engine/net/RequestData", "engine/net/NetMessage"], function (require, exports, Core_13, CoreMessage_2, ObjectUtil_2, ConstructUtil_2, RequestData_1, NetMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NetManager = (function () {
        function NetManager() {
            this._responseDict = {};
            this._responseListeners = {};
            Core_13.core.listen(CoreMessage_2.default.MESSAGE_DISPATCHED, this.onMsgDispatched, this);
        }
        NetManager.prototype.onMsgDispatched = function (msg) {
            var netMsg = msg.getMessage();
            // 如果消息是通讯消息则做处理
            if (msg instanceof RequestData_1.default) {
                // 指定消息参数连接上公共参数作为参数
                ObjectUtil_2.extendObject(netMsg.__params.data, RequestData_1.commonData);
                // 发送消息
                netMsg.__policy.sendRequest(netMsg);
                // 派发系统消息
                Core_13.core.dispatch(NetMessage_1.default.NET_REQUEST, netMsg);
            }
        };
        /**
         * 注册一个返回结构体
         *
         * @param {string} type 返回类型
         * @param {IResponseDataConstructor} cls 返回结构体构造器
         * @memberof NetManager
         */
        NetManager.prototype.registerResponse = function (cls) {
            this._responseDict[cls.getType()] = cls;
        };
        /**
         * 添加一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @memberof NetManager
         */
        NetManager.prototype.listenResponse = function (clsOrType, handler, thisArg, once) {
            if (once === void 0) { once = false; }
            var type = (typeof clsOrType == "string" ? clsOrType : clsOrType.getType());
            var listeners = this._responseListeners[type];
            if (!listeners)
                this._responseListeners[type] = listeners = [];
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                var listener = listeners_1[_i];
                if (handler == listener[0] && thisArg == listener[1] && once == listener[2])
                    return;
            }
            listeners.push([handler, thisArg, once]);
        };
        /**
         * 移除一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @memberof NetManager
         */
        NetManager.prototype.unlistenResponse = function (clsOrType, handler, thisArg, once) {
            if (once === void 0) { once = false; }
            var type = (typeof clsOrType == "string" ? clsOrType : clsOrType.getType());
            var listeners = this._responseListeners[type];
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var listener = listeners[i];
                    if (handler == listener[0] && thisArg == listener[1] && once == listener[2]) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        };
        /** 这里导出不希望用户使用的方法，供框架内使用 */
        NetManager.prototype.__onResponse = function (type, result, request) {
            // 解析结果
            var cls = this._responseDict[type];
            if (cls) {
                var response = new cls();
                response.parse(result);
                // 派发事件
                Core_13.core.dispatch(NetMessage_1.default.NET_RESPONSE, response, request);
                // 触发事件形式监听
                var listeners = this._responseListeners[type];
                if (listeners) {
                    for (var _i = 0, listeners_2 = listeners; _i < listeners_2.length; _i++) {
                        var listener = listeners_2[_i];
                        listener[0].call(listener[1], response, request);
                        // 如果是一次性监听则移除之
                        if (listener[2])
                            this.unlistenResponse(type, listener[0], listener[1], listener[2]);
                    }
                }
            }
            else {
                console.warn("没有找到返回结构体定义：" + type);
            }
        };
        NetManager.prototype.__onError = function (err, request) {
            // 派发事件
            Core_13.core.dispatch(NetMessage_1.default.NET_ERROR, err, request);
        };
        NetManager = __decorate([
            Injectable
        ], NetManager);
        return NetManager;
    }());
    exports.default = NetManager;
    /** 再额外导出一个单例 */
    exports.netManager = Core_13.core.getInject(NetManager);
    /*********************** 下面是装饰器方法实现 ***********************/
    /** Result */
    window["Result"] = function (clsOrType) {
        return function (prototype, propertyKey, descriptor) {
            // 监听实例化
            ConstructUtil_2.listenConstruct(prototype.constructor, function (instance) {
                exports.netManager.listenResponse(clsOrType, instance[propertyKey], instance);
            });
            // 监听销毁
            ConstructUtil_2.listenDispose(prototype.constructor, function (instance) {
                exports.netManager.unlistenResponse(clsOrType, instance[propertyKey], instance);
            });
        };
    };
});
define("utils/URLUtil", ["require", "exports", "utils/ObjectUtil"], function (require, exports, ObjectUtil_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 规整url
     * @param url
     */
    function trimURL(url) {
        // 去除多余的"/"
        url = url.replace(/([^:/])(\/)+/g, "$1/");
        if (url.charAt(0) == "/")
            url = url.substr(1);
        // 处理"/xx/../"
        var reg = /\/[^\/\.]+?\/\.\.\//;
        while (reg.test(url)) {
            url = url.replace(reg, "/");
        }
        return url;
    }
    exports.trimURL = trimURL;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    function isAbsolutePath(url) {
        if (url == null)
            return false;
        return (url.indexOf("://") >= 0);
    }
    exports.isAbsolutePath = isAbsolutePath;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    function validateProtocol(url) {
        if (url == null)
            return null;
        var index = url.indexOf("://");
        if (index < 0)
            return url;
        var protocol = url.substring(0, index);
        // 调整http和https
        if (protocol == "http" || protocol == "https") {
            return window.location.protocol + url.substr(index + 1);
        }
        // 调整ws和wss
        if (protocol == "ws" || protocol == "wss") {
            if (window.location.protocol == "https:")
                protocol = "wss";
            else
                protocol = "ws";
            return protocol + url.substr(index);
        }
        // 不需要调整
        return url;
    }
    exports.validateProtocol = validateProtocol;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    function wrapHost(url, host, forced) {
        if (forced === void 0) { forced = false; }
        host = host || "/";
        var re = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
        var arr = url.match(re);
        if (arr && arr.length > 0) {
            if (forced) {
                url = url.substr(arr[0].length);
                url = host + "/" + url;
            }
        }
        else {
            url = host + "/" + url;
        }
        // 最后规整一下url
        url = trimURL(url);
        return url;
    }
    exports.wrapHost = wrapHost;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    function wrapAbsolutePath(relativePath, host) {
        // 获取当前页面的url
        var curPath = getPath(window.location.href);
        var url = trimURL(curPath + "/" + relativePath);
        if (host != null) {
            url = wrapHost(url, host, true);
        }
        return url;
    }
    exports.wrapAbsolutePath = wrapAbsolutePath;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    function getHostAndPathname(url) {
        if (url == null)
            throw new Error("url不能为空");
        // 去掉get参数和hash
        url = url.split("#")[0].split("?")[0];
        // 去掉多余的/
        url = trimURL(url);
        return url;
    }
    exports.getHostAndPathname = getHostAndPathname;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    function getPath(url) {
        // 首先去掉多余的/
        url = getHostAndPathname(url);
        // 然后获取到路径
        var urlArr = url.split("/");
        urlArr.pop();
        return urlArr.join("/") + "/";
    }
    exports.getPath = getPath;
    /**
     * 获取URL的文件名
     * @param url 要分析的URL
     */
    function getName(url) {
        // 先去掉get参数和hash
        url = url.split("#")[0].split("?")[0];
        // 然后获取到文件名
        var urlArr = url.split("/");
        var fileName = urlArr[urlArr.length - 1];
        return fileName;
    }
    exports.getName = getName;
    /**
     * 解析URL
     * @param url 要被解析的URL字符串
     * @returns {any} 解析后的URLLocation结构体
     */
    function parseUrl(url) {
        var regExp = /(([^:]+:)\/\/(([^:\/\?#]+)(:(\d+))?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
        var match = regExp.exec(url);
        if (match) {
            return {
                href: match[0] || "",
                origin: match[1] || "",
                protocol: match[2] || "",
                host: match[3] || "",
                hostname: match[4] || "",
                port: match[6] || "",
                pathname: match[7] || "",
                search: match[8] || "",
                hash: (match[9] == "#" ? "" : match[9]) || ""
            };
        }
        else {
            throw new Error("传入parseUrl方法的参数不是一个完整的URL：" + url);
        }
    }
    exports.parseUrl = parseUrl;
    /**
     * 解析url查询参数
     * @TODO 添加对jquery编码方式的支持
     * @param url url
     */
    function getQueryParams(url) {
        var index = url.indexOf("#");
        if (index >= 0) {
            url = url.substring(0, index);
        }
        index = url.indexOf("?");
        if (index < 0)
            return {};
        var queryString = url.substring(index + 1);
        var params = {};
        var kvs = queryString.split("&");
        kvs.forEach(function (kv) {
            var pair = kv.split("=", 2);
            if (pair.length !== 2 || !pair[0]) {
                console.log("[URLUtil] invalid query params: " + kv);
                return;
            }
            var name = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            params[name] = value;
        });
        return params;
    }
    exports.getQueryParams = getQueryParams;
    /**
     * 将参数连接到指定URL后面
     * @param url url
     * @param params 一个map，包含要连接的参数
     * @return string 连接后的URL地址
     */
    function joinQueryParams(url, params) {
        if (url == null)
            throw new Error("url不能为空");
        var oriParams = getQueryParams(url);
        var targetParams = ObjectUtil_3.extendObject(oriParams, params);
        var hash = parseUrl(url).hash;
        url = getHostAndPathname(url);
        var isFirst = true;
        for (var key in targetParams) {
            if (isFirst) {
                url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
                isFirst = false;
            }
            else {
                url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
            }
        }
        // 加上hash
        url += hash;
        return url;
    }
    exports.joinQueryParams = joinQueryParams;
    /**
     * 将参数链接到URL的hash后面
     * @param url 如果传入的url没有注明hash模块，则不会进行操作
     * @param params 一个map，包含要连接的参数
     */
    function joinHashParams(url, params) {
        if (url == null)
            throw new Error("url不能为空");
        var hash = parseUrl(url).hash;
        if (hash == null || hash == "")
            return url;
        for (var key in params) {
            var value = params[key];
            if (value && typeof value != "string")
                value = value.toString();
            hash += ((hash.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
        return (url.split("#")[0] + hash);
    }
    exports.joinHashParams = joinHashParams;
    /**
     * 添加-r_XXX形式版本号
     * @param url url
     * @param version 版本号，以数字和小写字母组成
     * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
     */
    function join_r_Version(url, version) {
        if (version == null)
            return url;
        // 去掉version中的非法字符
        version = version.replace(/[^0-9a-z]+/ig, "");
        // 插入版本号
        var reg = /([a-zA-Z]+:\/+[^\/\?#]+\/[^\?#]+)\.([^\?]+)(\?.+)?/;
        var result = reg.exec(url);
        if (result != null) {
            url = result[1] + "-r_" + version + "." + result[2] + (result[3] || "");
        }
        return url;
    }
    exports.join_r_Version = join_r_Version;
    /**
     * 移除-r_XXX形式版本号
     * @param url url
     * @returns {string} 移除版本号后的url
     */
    function remove_r_Version(url) {
        // 去掉-r_XXX版本号，如果有
        url = url.replace(/\-r_[a-z0-9]+\./ig, ".");
        return url;
    }
    exports.remove_r_Version = remove_r_Version;
});
define("engine/net/HTTPMethod", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("engine/net/policies/HTTPRequestPolicy", ["require", "exports", "utils/URLUtil", "engine/net/NetManager"], function (require, exports, URLUtil_1, NetManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HTTPRequestPolicy = (function () {
        function HTTPRequestPolicy() {
        }
        /**
         * 发送请求逻辑
         *
         * @param {IHTTPRequestParams} params HTTP请求数据
         * @memberof HTTPRequestPolicy
         */
        HTTPRequestPolicy.prototype.sendRequest = function (request) {
            var params = request.__params;
            var retryTimes = params.retryTimes || 2;
            var timeout = params.timeout || 10000;
            var method = params.method || "GET";
            var timeoutId = 0;
            // 取到url
            var url = URLUtil_1.wrapHost(params.path, params.host, true);
            // 合法化一下protocol
            url = URLUtil_1.validateProtocol(url);
            // 生成并初始化xhr
            var xhr = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
            xhr.onreadystatechange = onReadyStateChange;
            xhr.setRequestHeader("withCredentials", "true");
            // 发送
            send();
            function send() {
                // 根据发送方式组织数据格式
                switch (method) {
                    case "POST":
                        // POST目前规定为JSON格式发送
                        xhr.open(method, url, true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify(params.data));
                        break;
                    case "GET":
                        // 将数据添加到url上
                        url = URLUtil_1.joinQueryParams(url, params.data);
                        xhr.open(method, url, true);
                        xhr.send(null);
                        break;
                    default:
                        throw new Error("暂不支持的HTTP Method：" + method);
                }
            }
            function onReadyStateChange() {
                switch (xhr.readyState) {
                    case 2:// 已经发送，开始计时
                        timeoutId = setTimeout(abortAndRetry, timeout);
                        break;
                    case 4:// 接收完毕
                        // 停止计时
                        timeoutId && clearTimeout(timeoutId);
                        timeoutId = 0;
                        try {
                            if (xhr.status == 200) {
                                // 成功回调
                                var result = JSON.parse(xhr.responseText);
                                NetManager_1.netManager.__onResponse(result, request);
                            }
                            else if (retryTimes > 0) {
                                // 没有超过重试上限则重试
                                abortAndRetry();
                            }
                            else {
                                // 出错回调
                                var err = new Error(xhr.status + " " + xhr.statusText);
                                NetManager_1.netManager.__onError(err, request);
                            }
                        }
                        catch (err) {
                            console.error(err.message);
                        }
                        break;
                }
            }
            function abortAndRetry() {
                // 重试次数递减
                retryTimes--;
                // 中止xhr
                xhr.abort();
                // 重新发送
                send();
            }
        };
        return HTTPRequestPolicy;
    }());
    exports.default = HTTPRequestPolicy;
    /** 再额外导出一个实例 */
    exports.httpRequestPolicy = new HTTPRequestPolicy();
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
define("view/message/ViewMessage", ["require", "exports"], function (require, exports) {
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
define("view/View", ["require", "exports", "core/Core", "view/message/ViewMessage"], function (require, exports, Core_14, ViewMessage_1) {
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
            var type = view.getType();
            if (!this._viewDict[type]) {
                var data = { view: view, inited: false };
                this._viewDict[type] = data;
                // 派发消息
                Core_14.core.dispatch(ViewMessage_1.default.VIEW_BEFORE_INIT, view);
                // 初始化该表现层实例
                var self = this;
                if (view.initView)
                    view.initView(afterInitView);
                else
                    afterInitView();
            }
            function afterInitView() {
                // 派发消息
                Core_14.core.dispatch(ViewMessage_1.default.VIEW_AFTER_INIT, view);
                // 设置初始化完毕属性
                data.inited = true;
                // 测试是否全部初始化完毕
                self.testAllInit();
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
    /** 再额外导出一个单例 */
    exports.view = Core_14.core.getInject(View);
});
//# sourceMappingURL=Olympus.js.map