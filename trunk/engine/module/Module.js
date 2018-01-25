import { core } from "../../core/Core";
import Observable from "../../core/observable/Observable";
import Dictionary from "../../utils/Dictionary";
import { moduleManager } from "./ModuleManager";
import { getConstructor } from "../../utils/ConstructUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 *
 * 模块基类
*/
var Module = /** @class */ (function () {
    function Module() {
        this._disposed = false;
        this._mediators = [];
        this._disposeDict = new Dictionary();
        /*********************** 下面是模块消息系统 ***********************/
        this._observable = new Observable(core);
    }
    Object.defineProperty(Module.prototype, "disposed", {
        /**
         * 获取是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Module
         */
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "dependModuleInstance", {
        /**
         * 所属的模块引用
         *
         * @readonly
         * @type {IModule}
         * @memberof IMediator
         */
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "dependModule", {
        /**
         * 所属的模块类型
         *
         * @readonly
         * @type {IModuleConstructor}
         * @memberof IMediator
         */
        get: function () {
            return getConstructor(this.constructor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "delegatedMediators", {
        /**
         * 获取所有已托管的中介者
         *
         * @returns {IModuleMediator[]} 已托管的中介者
         * @memberof Module
         */
        get: function () {
            return this._mediators;
        },
        enumerable: true,
        configurable: true
    });
    Module.prototype.disposeMediator = function (mediator) {
        // 取消托管
        this.undelegateMediator(mediator);
        // 调用原始销毁方法
        mediator.dispose();
        // 如果所有已托管的中介者都已经被销毁，则销毁当前模块
        if (this._mediators.length <= 0)
            this.dispose();
    };
    ;
    /**
     * 托管中介者
     *
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    Module.prototype.delegateMediator = function (mediator) {
        if (this._mediators.indexOf(mediator) < 0) {
            // 托管新的中介者
            this._mediators.push(mediator);
            // 篡改dispose方法，以监听其dispose
            if (mediator.hasOwnProperty("dispose"))
                this._disposeDict.set(mediator, mediator.dispose);
            mediator.dispose = this.disposeMediator.bind(this, mediator);
        }
    };
    /**
     * 取消托管中介者
     *
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    Module.prototype.undelegateMediator = function (mediator) {
        var index = this._mediators.indexOf(mediator);
        if (index >= 0) {
            // 取消托管中介者
            this._mediators.splice(index, 1);
            // 恢复dispose方法，取消监听dispose
            var oriDispose = this._disposeDict.get(mediator);
            if (oriDispose)
                mediator.dispose = oriDispose;
            else
                delete mediator.dispose;
            this._disposeDict.delete(mediator);
        }
    };
    /**
     * 判断指定中介者是否包含在该模块里
     *
     * @param {IModuleMediator} mediator 要判断的中介者
     * @returns {boolean} 是否包含在该模块里
     * @memberof Module
     */
    Module.prototype.constainsMediator = function (mediator) {
        return (this._mediators.indexOf(mediator) >= 0);
    };
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
     * 当模块资源加载完毕后调用
     *
     * @param {Error} [err] 任何一个Mediator资源加载出错会给出该错误对象，没错则不给
     * @memberof Module
     */
    Module.prototype.onLoadAssets = function (err) {
    };
    /**
     * 模块打开方法，通常由ModuleManager调用
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    Module.prototype.open = function (data) {
        // 如果没有传递data则用一个空的Object代替
        if (data === undefined)
            data = {};
        // 调用自身onOpen方法
        this.onOpen(data);
        // 调用所有已托管中介者的open方法
        for (var _i = 0, _a = this._mediators; _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.open(data);
        }
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
     * 模块关闭方法，通常由ModuleManager调用
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    Module.prototype.close = function (data) {
        // 调用自身onClose方法
        this.onClose(data);
        // 调用所有已托管中介者的close方法
        for (var _i = 0, _a = this._mediators.concat(); _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.close(data);
        }
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
     * 其他模块被关闭时调用，可以重写
     *
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    Module.prototype.onWakeUp = function (from, data) {
    };
    /**
     * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
     *
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    Module.prototype.onActivate = function (from, data) {
    };
    /**
     * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
     *
     * @param {IModuleConstructor|undefined} to 要切换到哪个模块
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    Module.prototype.onDeactivate = function (to, data) {
    };
    Object.defineProperty(Module.prototype, "observable", {
        /**
         * 暴露IObservable接口
         *
         * @readonly
         * @type {IObservable}
         * @memberof Module
         */
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "parent", {
        /**
         * 获取到父级IObservable
         *
         * @type {IObservable}
         * @memberof Module
         */
        get: function () {
            return this._observable.parent;
        },
        enumerable: true,
        configurable: true
    });
    /** dispatchModule方法实现 */
    Module.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this._observable.dispatch.apply(this._observable, params);
    };
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Module
     */
    Module.prototype.listen = function (type, handler, thisArg) {
        this._observable.listen(type, handler, thisArg);
    };
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Module
     */
    Module.prototype.unlisten = function (type, handler, thisArg) {
        this._observable.unlisten(type, handler, thisArg);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Module
     */
    Module.prototype.mapCommand = function (type, cmd) {
        this._observable.mapCommand(type, cmd);
    };
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Module
     */
    Module.prototype.unmapCommand = function (type, cmd) {
        this._observable.unmapCommand(type, cmd);
    };
    /**
     * 销毁模块，可以重写
     *
     * @memberof Module
     */
    Module.prototype.dispose = function () {
        if (this._disposed)
            return;
        // 调用模板方法
        this.onDispose();
        // 关闭自身
        var cls = getConstructor(this.constructor);
        moduleManager.close(cls);
        // 如果没关上则不销毁
        if (moduleManager.isOpened(cls))
            return;
        // 将所有已托管的中介者销毁
        for (var i = 0, len = this._mediators.length; i < len; i++) {
            var mediator = this._mediators.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 销毁Observable实例
        this._observable.dispose();
        this._observable = null;
        // 记录
        this._disposed = true;
    };
    /**
     * 当销毁时调用
     *
     * @memberof Mediator
     */
    Module.prototype.onDispose = function () {
        // 可重写
    };
    return Module;
}());
export default Module;
