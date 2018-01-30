import { core } from "../../core/Core";
import { mutate } from "../bind/Mutator";
import Dictionary from "../../utils/Dictionary";
import { bindManager } from "../bind/BindManager";
import Observable from "../../core/observable/Observable";
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
        this._disposeDict = new Dictionary();
        /**
         * 父中介者
         *
         * @type {IMediator}
         * @memberof Mediator
         */
        this.parent = null;
        this._children = [];
        /*********************** 下面是模块消息系统 ***********************/
        this._observable = new Observable(core);
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
    Object.defineProperty(Mediator.prototype, "data", {
        /**
         * 打开时传递的data对象
         *
         * @type {*}
         * @memberof Mediator
         */
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            // 递归设置子中介者的data
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var mediator = _a[_i];
                mediator.data = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "responses", {
        /**
         * 模块初始消息的返回数据
         *
         * @type {ResponseData[]}
         * @memberof Mediator
         */
        get: function () {
            return this._responses;
        },
        set: function (value) {
            this._responses = value;
            // 递归设置子中介者的data
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var mediator = _a[_i];
                mediator.responses = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 加载从listAssets中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @returns {void}
     * @memberof Mediator
     */
    Mediator.prototype.loadAssets = function (handler) {
        var _this = this;
        this.bridge.loadAssets(this.listAssets(), this, function (err) {
            // 调用onLoadAssets接口
            _this.onLoadAssets(err);
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
        this.data = data;
        // 调用自身onOpen方法
        this.onOpen(data);
        // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
        if (!this._viewModel)
            this.viewModel = {};
        // 调用所有已托管中介者的open方法
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.open(data);
        }
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
        // 调用所有已托管中介者的close方法
        for (var _i = 0, _a = this._children.concat(); _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.close(data);
        }
        // 调用自身onClose方法
        this.onClose(data);
        // 销毁自身
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
    Mediator.prototype.disposeChild = function (mediator, oriDispose) {
        // 调用原始销毁方法
        oriDispose.call(mediator);
        // 取消托管
        this.undelegateMediator(mediator);
    };
    ;
    Object.defineProperty(Mediator.prototype, "children", {
        /**
         * 获取所有子中介者
         *
         * @type {IMediator[]}
         * @memberof Mediator
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 托管子中介者
     *
     * @param {IMediator} mediator 要托管的中介者
     * @memberof Mediator
     */
    Mediator.prototype.delegateMediator = function (mediator) {
        if (this._children.indexOf(mediator) < 0) {
            // 托管新的中介者
            this._children.push(mediator);
            // 设置关系
            mediator.parent = this;
            // 设置observable关系
            mediator.observable.parent = this._observable;
            // 篡改dispose方法，以监听其dispose
            if (mediator.hasOwnProperty("dispose"))
                this._disposeDict.set(mediator, mediator.dispose);
            mediator.dispose = this.disposeChild.bind(this, mediator, mediator.dispose);
        }
    };
    /**
     * 取消托管子中介者
     *
     * @param {IMediator} mediator 要取消托管的中介者
     * @memberof Mediator
     */
    Mediator.prototype.undelegateMediator = function (mediator) {
        var index = this._children.indexOf(mediator);
        if (index >= 0) {
            // 取消托管中介者
            this._children.splice(index, 1);
            // 移除关系
            mediator.parent = null;
            // 移除observable关系
            if (mediator.observable)
                mediator.observable.parent = null;
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
     * 判断指定中介者是否包含在该中介者里
     *
     * @param {IMediator} mediator 要判断的中介者
     * @returns {boolean}
     * @memberof Mediator
     */
    Mediator.prototype.constainsMediator = function (mediator) {
        return (this._children.indexOf(mediator) >= 0);
    };
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.wakeUp = function (from, data) {
        // 调用自身方法
        this.onWakeUp(from, data);
        // 递归调用子中介者方法
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.onWakeUp(from, data);
        }
    };
    /**
     * 模块切换到前台时调用（与wakeUp的区别是open时activate会触发，但wakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.activate = function (from, data) {
        // 调用自身方法
        this.onActivate(from, data);
        // 递归调用子中介者方法
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.onActivate(from, data);
        }
    };
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.deactivate = function (to, data) {
        // 调用自身方法
        this.onDeactivate(to, data);
        // 递归调用子中介者方法
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            mediator.onDeactivate(to, data);
        }
    };
    /**
     * 列出中介者所需的资源数组，不要手动调用或重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listAssets = function () {
        // 获取自身所需资源
        var assets = this.onListAssets() || [];
        // 获取所有子中介者所需资源
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            assets.push.apply(assets, mediator.listAssets());
        }
        return assets;
    };
    /**
     * 列出模块初始化请求，不要手动调用或重写
     *
     * @returns {RequestData[]}
     * @memberof Mediator
     */
    Mediator.prototype.listInitRequests = function () {
        // 获取自身初始化请求
        var requests = this.onListInitRequests() || [];
        // 获取所有子中介者所需资源
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            requests.push.apply(requests, mediator.listInitRequests());
        }
        return requests;
    };
    /**
     * 列出所需CSS资源URL，不要手动调用或重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listStyleFiles = function () {
        // 获取自身URL
        var files = this.onListStyleFiles() || [];
        // 获取所有子中介者所需资源
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            files.push.apply(files, mediator.listStyleFiles());
        }
        return files;
    };
    /**
     * 列出所需JS资源URL，不要手动调用或重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listJsFiles = function () {
        // 获取自身URL
        var files = this.onListJsFiles() || [];
        // 获取所有子中介者所需资源
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var mediator = _a[_i];
            files.push.apply(files, mediator.listJsFiles());
        }
        return files;
    };
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.onWakeUp = function (from, data) {
        // 可重写
    };
    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.onActivate = function (from, data) {
        // 可重写
    };
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    Mediator.prototype.onDeactivate = function (to, data) {
        // 可重写
    };
    /**
     * 列出中介者所需的资源数组，可重写
     *
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    Mediator.prototype.onListAssets = function () {
        return null;
    };
    /**
     * 列出模块初始化请求，可重写
     *
     * @returns {RequestData[]}
     * @memberof Mediator
     */
    Mediator.prototype.onListInitRequests = function () {
        return null;
    };
    /**
     * 列出所需CSS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.onListStyleFiles = function () {
        return null;
    };
    /**
     * 列出所需JS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.onListJsFiles = function () {
        return null;
    };
    Object.defineProperty(Mediator.prototype, "observable", {
        /**
         * 暴露IObservable
         *
         * @readonly
         * @type {IObservable}
         * @memberof Mediator
         */
        get: function () {
            return this._observable;
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
        this._observable.dispatch.apply(this._observable, params);
    };
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    Mediator.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.listen(type, handler, thisArg, once);
    };
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    Mediator.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.unlisten(type, handler, thisArg, once);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Mediator
     */
    Mediator.prototype.mapCommand = function (type, cmd) {
        this._observable.mapCommand(type, cmd);
    };
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Mediator
     */
    Mediator.prototype.unmapCommand = function (type, cmd) {
        this._observable.unmapCommand(type, cmd);
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
        // 将所有子中介者销毁
        for (var i = 0, len = this._children.length; i < len; i++) {
            var mediator = this._children.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 移除observable
        this._observable.dispose();
        this._observable = null;
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
