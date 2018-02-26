import Dictionary from "../utils/Dictionary";
import Observable from "./observable/Observable";
import "reflect-metadata";
import * as Patch from "./global/Patch";
Patch;
/**
 * 核心上下文对象，负责内核消息转发、对象注入等核心功能的实现
 *
 * @export
 * @class Core
 */
var Core = /** @class */ (function () {
    function Core() {
        /*********************** 下面是内核消息系统 ***********************/
        this._observable = new Observable();
        /*********************** 下面是依赖注入系统 ***********************/
        /**
         * 记录已经注入过的对象单例
         *
         * @private
         * @type {Dictionary<Function, any>}
         * @memberof Core
         */
        this._injectDict = new Dictionary();
        /**
         * 注入字符串类型字典，记录注入字符串和类型构造函数的映射
         *
         * @private
         * @type {Dictionary<any, IConstructor>}
         * @memberof Core
         */
        this._injectStrDict = new Dictionary();
        // 进行单例判断
        if (Core._instance)
            throw new Error("已生成过Core实例，不允许多次生成");
        // 赋值单例
        Core._instance = this;
        // 注入自身
        this.mapInjectValue(this);
    }
    Object.defineProperty(Core.prototype, "disposed", {
        /**
         * Core的disposed属性没有任何作用，仅为了实现接口，始终会返回false
         *
         * @readonly
         * @type {boolean}
         * @memberof Core
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "observable", {
        /**
         * 将IObservable暴露出来
         *
         * @readonly
         * @type {IObservable}
         * @memberof Core
         */
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "parent", {
        /**
         * 获取到父级IObservable
         *
         * @type {IObservable}
         * @memberof Core
         */
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /** dispatch方法实现 */
    Core.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this._observable.dispatch.apply(this._observable, params);
    };
    /**
     * 监听内核消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Core
     */
    Core.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.listen(type, handler, thisArg, once);
    };
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Core
     */
    Core.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.unlisten(type, handler, thisArg, once);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Core
     */
    Core.prototype.mapCommand = function (type, cmd) {
        this._observable.mapCommand(type, cmd);
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
        this._observable.unmapCommand(type, cmd);
    };
    /**
     * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
     *
     * @param {IConstructor} target 要注入的类型（注意不是实例）
     * @param {*} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
     * @memberof Core
     */
    Core.prototype.mapInject = function (target, type) {
        // 如果已经注入过了，则使用已经注入的单例再次注入
        var oriTarget = target["__ori_constructor__"] || target;
        var value = this._injectDict.get(oriTarget) || new target();
        this.mapInjectValue(value, type);
    };
    /**
     * 注入一个对象实例
     *
     * @param {*} value 要注入的对象实例
     * @param {*} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
     * @memberof Core
     */
    Core.prototype.mapInjectValue = function (value, type) {
        // 如果是字符串则记录类型构造函数映射
        if (!(type instanceof Function) || !type.prototype) {
            this._injectStrDict.set(type, value.constructor);
            type = value.constructor;
        }
        // 记录已注入的单例
        this._injectDict.set(value.constructor, value);
        // 开始注入
        Reflect.defineMetadata("design:type", value, type["__ori_constructor__"] || type);
    };
    /**
     * 移除类型注入
     *
     * @param {*} type 要移除注入的类型
     * @memberof Core
     */
    Core.prototype.unmapInject = function (type) {
        // 如果是字符串则记录类型构造函数映射
        if (!(type instanceof Function) || !type.prototype)
            type = this._injectStrDict.get(type);
        Reflect.deleteMetadata("design:type", type["__ori_constructor__"] || type);
    };
    /**
     * 获取注入的对象实例
     *
     * @param {*} type 注入对象的类型
     * @returns {*} 注入的对象实例
     * @memberof Core
     */
    Core.prototype.getInject = function (type) {
        if (!(type instanceof Function) || !type.prototype)
            type = this._injectStrDict.get(type);
        if (type) {
            // 需要用原始的构造函数取
            type = type["__ori_constructor__"] || type;
            return Reflect.getMetadata("design:type", type);
        }
    };
    /**
     * Core的dispose方法没有任何作用，仅为了实现接口
     *
     * @memberof Core
     */
    Core.prototype.dispose = function () {
    };
    return Core;
}());
export default Core;
/** 再额外导出一个单例 */
export var core = new Core();
