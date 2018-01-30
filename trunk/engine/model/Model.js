import { core } from "../../core/Core";
import EngineMessage from "../message/EngineMessage";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 *
 * Model的基类，也可以不继承该基类，因为Model是很随意的东西
*/
var Model = /** @class */ (function () {
    function Model() {
        core.listen(EngineMessage.INITIALIZED, this.onInitialized, this);
    }
    Object.defineProperty(Model.prototype, "disposed", {
        /**
         * Model的disposed属性没有任何作用，仅为了实现接口，始终返回false
         *
         * @readonly
         * @type {boolean}
         * @memberof Model
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "observable", {
        /**
         * 转发core.observable
         *
         * @readonly
         * @type {IObservable}
         * @memberof Model
         */
        get: function () {
            return core.observable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "parent", {
        /**
         * 获取到父级IObservable
         *
         * @type {IObservable}
         * @memberof Model
         */
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 在框架初始化完毕时调用
     *
     * @memberof Model
     */
    Model.prototype.onInitialized = function () {
        // 留待子类完善
    };
    Model.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        core.dispatch.apply(core, params);
    };
    /**
     * 监听内核消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Model
     */
    Model.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        core.listen(type, handler, thisArg, once);
    };
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Model
     */
    Model.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        core.unlisten(type, handler, thisArg, once);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Model
     */
    Model.prototype.mapCommand = function (type, cmd) {
        core.mapCommand(type, cmd);
    };
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Model
     */
    Model.prototype.unmapCommand = function (type, cmd) {
        core.unmapCommand(type, cmd);
    };
    /**
     * Model的dispose方法没有任何作用，仅为了实现接口
     *
     * @memberof Model
     */
    Model.prototype.dispose = function () {
    };
    return Model;
}());
export default Model;
