import Dictionary from '../utils/Dictionary';
import { system } from '../utils/System';
import { mutate } from './bind/Mutator';
import { bind, unbind } from './bind/Utils';
import ComponentStatus from './enums/ComponentStatus';
import * as Patch from "./global/Patch";
import ComponentMessageType from './messages/ComponentMessageType';
import Observable from './observable/Observable';
/* 打补丁 */
Patch;
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-05
 * @modify date 2018-07-05
 *
 * Olympus组件，具有MVVM绑定功能
*/
var Component = /** @class */ (function () {
    function Component(skin) {
        this._listeners = [];
        /**
         * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
         *
         * @type {Dictionary<any, any>[]}
         * @memberof Mediator
         */
        this.bindTargets = [];
        /******************** 下面是组件的组件树接口 ********************/
        this._disposeDict = new Dictionary();
        /**
         * 父组件
         *
         * @type {IComponent}
         * @memberof Component
         */
        this.parent = null;
        this._children = [];
        /******************** 下面是组件的消息功能实现 ********************/
        this._observable = new Observable();
        /******************** 下面是组件的打开关闭功能实现 ********************/
        this._status = ComponentStatus.UNOPEN;
        // 赋值皮肤
        this.skin = skin;
        // 记录原始皮肤
        this.oriSkin = skin;
        // 初始化绑定
        bind(this);
    }
    Object.defineProperty(Component.prototype, "data", {
        /**
         * 打开时传递的data对象
         *
         * @type {*}
         * @memberof Component
         */
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            // 递归设置子组件的data
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.data = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
     *
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Mediator
     */
    Component.prototype.mapListener = function (target, type, handler, thisArg) {
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
    Component.prototype.unmapListener = function (target, type, handler, thisArg) {
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
     * 注销所有注册在当前组件上的事件监听
     *
     * @memberof Mediator
     */
    Component.prototype.unmapAllListeners = function () {
        for (var i = 0, len = this._listeners.length; i < len; i++) {
            var data = this._listeners.pop();
            // 调用桥接口
            this.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
        }
    };
    Object.defineProperty(Component.prototype, "viewModel", {
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
            bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.disposeChild = function (comp, oriDispose) {
        // 调用原始销毁方法
        oriDispose.call(comp);
        // 取消托管
        this.undelegate(comp);
    };
    ;
    Object.defineProperty(Component.prototype, "root", {
        /**
         * 获取根级组件（当做模块直接被打开的组件）
         *
         * @type {IComponent}
         * @memberof Component
         */
        get: function () {
            return (this.parent ? this.parent.root : this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "children", {
        /**
         * 获取所有子组件
         *
         * @type {IComponent[]}
         * @memberof Component
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 托管子组件
     *
     * @param {IComponent} comp 要托管的组件
     * @memberof Component
     */
    Component.prototype.delegate = function (comp) {
        if (this._children.indexOf(comp) < 0) {
            // 托管新的组件
            this._children.push(comp);
            // 设置关系
            comp.parent = this;
            // 设置observable关系
            comp.observable.parent = this._observable;
            // 篡改dispose方法，以监听其dispose
            this._disposeDict.set(comp, comp.dispose);
            comp.dispose = this.disposeChild.bind(this, comp, comp.dispose);
        }
    };
    /**
     * 取消托管子组件
     *
     * @param {IComponent} comp 要取消托管的组件
     * @memberof Component
     */
    Component.prototype.undelegate = function (comp) {
        var index = this._children.indexOf(comp);
        if (index >= 0) {
            // 取消托管组件
            this._children.splice(index, 1);
            // 移除关系
            comp.parent = null;
            // 移除observable关系
            if (comp.observable)
                comp.observable.parent = null;
            // 恢复dispose方法，取消监听dispose
            comp.dispose = this._disposeDict.get(comp);
            this._disposeDict.delete(comp);
        }
    };
    /**
     * 判断指定组件是否包含在该组件里（判断范围包括当前组件和子孙级组件）
     *
     * @param {IComponent} comp 要判断的组件
     * @returns {boolean}
     * @memberof Component
     */
    Component.prototype.contains = function (comp) {
        // 首先判断自身
        if (comp === this)
            return true;
        // 判断子组件
        var contains = false;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.contains(comp)) {
                contains = true;
                break;
            }
        }
        return contains;
    };
    Object.defineProperty(Component.prototype, "observable", {
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
    Component.prototype.dispatch = function () {
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
    Component.prototype.listen = function (type, handler, thisArg, once) {
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
    Component.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.unlisten(type, handler, thisArg, once);
    };
    Object.defineProperty(Component.prototype, "status", {
        /**
         * 获取组件状态
         *
         * @readonly
         * @type {ComponentStatus}
         * @memberof Mediator
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data] 开启数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    Component.prototype.open = function (data) {
        // 判断状态
        if (this._status === ComponentStatus.UNOPEN) {
            // 修改状态
            this._status = ComponentStatus.OPENING;
            // 赋值参数
            this.data = data;
            // 调用模板方法
            this.__beforeOnOpen(data);
            // 调用自身onOpen方法
            var result = this.onOpen(data);
            if (result !== undefined)
                this.data = data = result;
            // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
            if (!this._viewModel)
                this.viewModel = {};
            // 记录子组件数量，并监听其开启完毕事件
            var subCount = this._children.length;
            if (subCount > 0) {
                // 调用所有已托管组件的open方法
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.open(data);
                }
            }
            // 修改状态
            this._status = ComponentStatus.OPENED;
            // 调用模板方法
            this.__afterOnOpen(data);
            // 派发事件
            this.dispatch(ComponentMessageType.COMPONENT_OPENED, this);
        }
        // 返回自身引用
        return this;
    };
    Component.prototype.__beforeOnOpen = function (data) {
        // 给子类用的模板方法
    };
    Component.prototype.__afterOnOpen = function (data) {
        // 给子类用的模板方法
    };
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {*} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    Component.prototype.close = function (data) {
        var _this = this;
        if (this._status === ComponentStatus.OPENED) {
            var doClose = function () {
                // 调用模板方法
                _this.__beforeOnClose(data);
                // 修改状态
                _this._status = ComponentStatus.CLOSING;
                // 调用自身onClose方法
                _this.onClose(data);
                // 修改状态
                _this._status = ComponentStatus.CLOSED;
                // 调用模板方法
                _this.__afterOnClose(data);
            };
            var subCount = this._children.length;
            if (subCount > 0) {
                var handler = function (comp) {
                    if (_this._children.indexOf(comp) >= 0 && --subCount === 0) {
                        // 取消监听
                        _this.unlisten(ComponentMessageType.COMPONENT_CLOSED, handler);
                        // 执行关闭
                        doClose();
                    }
                };
                this.listen(ComponentMessageType.COMPONENT_CLOSED, handler);
                // 调用所有已托管组件的close方法
                for (var _i = 0, _a = this._children.concat(); _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.close(data);
                }
            }
            else {
                // 没有子组件，直接执行
                doClose();
            }
        }
        // 返回自身引用
        return this;
    };
    Component.prototype.__beforeOnClose = function (data) {
        // 给子类用的模板方法
    };
    Component.prototype.__afterOnClose = function (data) {
        // 派发关闭事件
        this.dispatch(ComponentMessageType.COMPONENT_CLOSED, this);
        // 给子类用的模板方法
        this.dispose();
    };
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    Component.prototype.onOpen = function (data) {
        // 可重写
    };
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof Mediator
     */
    Component.prototype.onClose = function (data) {
        // 可重写
    };
    Object.defineProperty(Component.prototype, "disposed", {
        /******************** 下面是组件的销毁功能实现 ********************/
        /**
         * 获取组件是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Mediator
         */
        get: function () {
            return (this._status === ComponentStatus.DISPOSED);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 销毁组件
     *
     * @memberof Mediator
     */
    Component.prototype.dispose = function () {
        var _this = this;
        // 判断状态
        if (this.status >= ComponentStatus.DISPOSING)
            return;
        // 修改状态
        this._status = ComponentStatus.DISPOSING;
        // 移除绑定
        unbind(this);
        // 注销事件监听
        this.unmapAllListeners();
        // 调用模板方法
        this.onDispose();
        // 移除显示，只移除没有原始皮肤的，因为如果有原始皮肤，其原始parent可能不希望子节点被移除
        if (!this.oriSkin) {
            if (this.skin && this.bridge) {
                var parent = this.bridge.getParent(this.skin);
                if (parent)
                    this.bridge.removeChild(parent, this.skin);
            }
        }
        // 移除表现层桥
        this.bridge = null;
        // 移除ViewModel
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除皮肤
        this.skin = null;
        this.oriSkin = null;
        // 将所有子组件销毁
        for (var i = 0, len = this._children.length; i < len; i++) {
            var child = this._children.pop();
            this.undelegate(child);
            child.dispose();
        }
        // 将observable的销毁拖延到下一帧，因为虽然执行了销毁，但有可能这之后还会使用observable发送消息
        system.nextFrame(function () {
            // 移除observable
            _this._observable.dispose();
            _this._observable = null;
            // 修改状态
            _this._status = ComponentStatus.DISPOSED;
        });
    };
    /**
     * 当销毁时调用
     *
     * @memberof Mediator
     */
    Component.prototype.onDispose = function () {
        // 可重写
    };
    return Component;
}());
export default Component;
