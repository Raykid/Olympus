import { core } from "../../core/Core";
import { mutate } from "../bind/Mutator";
import { bindManager } from "../bind/BindManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 *
 * 组件界面中介者基类
*/
var Mediator = /** @class */ (function () {
    function Mediator(skin) {
        /**
         * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
         *
         * @type {Dictionary<any, any>[]}
         * @memberof Mediator
         */
        this.bindTargets = [];
        this._disposed = false;
        this._listeners = [];
        if (skin)
            this.skin = skin;
        // 初始化绑定
        bindManager.bind(this);
    }
    Object.defineProperty(Mediator.prototype, "viewModel", {
        /**
         * 获取或设置ViewModel
         *
         * @type {*}
         * @memberof Mediator
         */
        get: function () {
            return this._viewModel;
        },
        set: function (value) {
            // 设置的时候进行一次变异
            this._viewModel = mutate(value);
            // 更新绑定
            bindManager.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "disposed", {
        /**
         * 获取中介者是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Mediator
         */
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "dependModuleInstance", {
        /**
         * 所属的模块引用，需要配合@DelegateMediator使用
         *
         * @readonly
         * @type {IModule}
         * @memberof IMediator
         */
        get: function () {
            return this._dependModuleInstance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "dependModule", {
        /**
         * 所属的模块类型，需要配合@DelegateMediator使用
         *
         * @readonly
         * @type {IModuleConstructor}
         * @memberof IMediator
         */
        get: function () {
            return this._dependModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "initResponses", {
        /**
         * 便捷获取被托管到的模块的初始化消息数组
         *
         * @type {ResponseData[]}
         * @memberof IModuleMediator
         */
        get: function () {
            return (this._dependModuleInstance ? this._dependModuleInstance.responses : []);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "data", {
        /**
         * 打开时传递的data对象
         *
         * @readonly
         * @type {*}
         * @memberof Mediator
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 列出中介者所需的资源数组，可重写
     * 但如果Mediator没有被托管在Module中则该方法不应该被重写，否则可能会有问题
     *
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    Mediator.prototype.listAssets = function () {
        return null;
    };
    /**
     * 加载从listAssets中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @returns {void}
     * @memberof Mediator
     */
    Mediator.prototype.loadAssets = function (handler) {
        var self = this;
        this.bridge.loadAssets(this.listAssets(), this, function (err) {
            // 调用onLoadAssets接口
            self.onLoadAssets(err);
            // 调用回调
            handler(err);
        });
    };
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    Mediator.prototype.onLoadAssets = function (err) {
    };
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data]
     * @returns {*}
     * @memberof Mediator
     */
    Mediator.prototype.open = function (data) {
        this._data = data;
        this.onOpen(data);
        // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
        if (!this._viewModel)
            this.viewModel = {};
        return this;
    };
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {*} [data]
     * @returns {*}
     * @memberof Mediator
     */
    Mediator.prototype.close = function (data) {
        this.onClose(data);
        this.dispose();
        return this;
    };
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @memberof Mediator
     */
    Mediator.prototype.onOpen = function (data) {
        // 可重写
    };
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @memberof Mediator
     */
    Mediator.prototype.onClose = function (data) {
        // 可重写
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
        this.bridge.mapListener(target, type, handler, thisArg);
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
                this.bridge.unmapListener(target, type, handler, thisArg);
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
            var data = this._listeners.pop();
            // 调用桥接口
            this.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
        }
    };
    Object.defineProperty(Mediator.prototype, "observable", {
        /*********************** 下面是模块消息系统 ***********************/
        /**
         * 暴露IObservable
         *
         * @readonly
         * @type {IObservable}
         * @memberof Mediator
         */
        get: function () {
            return (this._dependModuleInstance || core).observable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "parent", {
        /**
         * 获取到父级IObservable
         *
         * @type {IObservable}
         * @memberof Mediator
         */
        get: function () {
            return this.observable.parent;
        },
        enumerable: true,
        configurable: true
    });
    /** dispatch方法实现 */
    Mediator.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var observable = this.observable;
        observable.dispatch.apply(observable, params);
    };
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof IModuleObservable
     */
    Mediator.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this.observable.listen(type, handler, thisArg, once);
    };
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof IModuleObservable
     */
    Mediator.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this.observable.unlisten(type, handler, thisArg, once);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IModuleObservable
     */
    Mediator.prototype.mapCommand = function (type, cmd) {
        this.observable.mapCommand(type, cmd);
    };
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof IModuleObservable
     */
    Mediator.prototype.unmapCommand = function (type, cmd) {
        this.observable.unmapCommand(type, cmd);
    };
    /**
     * 销毁中介者
     *
     * @memberof Mediator
     */
    Mediator.prototype.dispose = function () {
        if (this._disposed)
            return;
        // 移除绑定
        bindManager.unbind(this);
        // 注销事件监听
        this.unmapAllListeners();
        // 调用模板方法
        this.onDispose();
        // 移除显示
        if (this.skin && this.bridge) {
            var parent = this.bridge.getParent(this.skin);
            if (parent)
                this.bridge.removeChild(parent, this.skin);
        }
        // 移除表现层桥
        this.bridge = null;
        // 移除ViewModel
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除皮肤
        this.skin = null;
        // 设置已被销毁
        this._disposed = true;
    };
    /**
     * 当销毁时调用
     *
     * @memberof Mediator
     */
    Mediator.prototype.onDispose = function () {
        // 可重写
    };
    return Mediator;
}());
export default Mediator;
