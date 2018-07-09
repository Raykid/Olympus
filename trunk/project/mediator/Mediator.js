import * as tslib_1 from "tslib";
import Component from '../../kernel/Component';
import ComponentStatus from '../../kernel/enums/ComponentStatus';
import ComponentMessageType from '../../kernel/messages/ComponentMessageType';
import { unique } from "../../utils/ArrayUtil";
import { getConstructor } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { assetsManager } from "../assets/AssetsManager";
import { bridgeManager } from '../bridge/BridgeManager';
import { core } from '../core/Core';
import ObservableExt from '../core/observable/ObservableExt';
import { maskManager } from "../mask/MaskManager";
import { netManager } from "../net/NetManager";
import { ModuleOpenStatus } from "./IMediatorModulePart";
var moduleDict = {};
var moduleNameDict = new Dictionary();
/**
 * 注册模块
 *
 * @export
 * @param {string} moduleName 模块名
 * @param {IComponentConstructor} cls 模块类型
 */
export function registerModule(moduleName, cls) {
    moduleDict[moduleName] = cls;
    moduleNameDict.set(cls, moduleName);
}
/**
 * 获取模块类型
 *
 * @export
 * @param {string} moduleName 模块名
 * @returns {IComponentConstructor}
 */
export function getModule(moduleName) {
    return moduleDict[moduleName];
}
/**
 * 获取模块名
 *
 * @export
 * @param {ModuleType} type 模块实例或模块类型
 * @returns {string} 模块名
 */
export function getModuleName(type) {
    var cls = getConstructor(type instanceof Function ? type : type.constructor);
    return moduleNameDict.get(cls);
}
var Mediator = /** @class */ (function (_super) {
    tslib_1.__extends(Mediator, _super);
    function Mediator(skin) {
        var _this = _super.call(this, skin) || this;
        _this._openMask = true;
        /*********************** 下面是命令功能实现 ***********************/
        _this._observable = new ObservableExt(core);
        // 赋值模块名称
        _this._moduleName = getModuleName(_this);
        // 自动判断皮肤类型以赋值桥
        if (skin)
            _this.bridge = bridgeManager.getBridgeBySkin(skin);
        return _this;
    }
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
    Object.defineProperty(Mediator.prototype, "openMask", {
        /**
         * 开启时是否触发全屏遮罩，防止用户操作，设置操作会影响所有子孙中介者。默认是true
         *
         * @type {boolean}
         * @memberof Mediator
         */
        get: function () {
            return this._openMask;
        },
        set: function (value) {
            this._openMask = value;
            // 递归设置所有子中介者的openMask
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.openMask = value;
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
                var child = _a[_i];
                child.responses = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mediator.prototype, "moduleName", {
        /**
         * 获取模块名
         *
         * @readonly
         * @type {string}
         * @memberof Mediator
         */
        get: function () {
            return this._moduleName;
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
        var children = this._children.concat();
        var temp = function (err) {
            if (err || children.length <= 0) {
                // 调用onLoadAssets接口
                _this.onLoadAssets(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的资源
                var child = children.shift();
                child.loadAssets(temp);
            }
        };
        // 加载自身资源
        var assets = this.listAssets();
        if (assets && assets.length > 0) {
            // 去重
            assets = unique(assets);
            // 开始加载
            this.bridge.loadAssets(assets, this, temp);
        }
        else {
            // 没有资源，直接调用回调
            handler();
        }
    };
    /**
     * 加载从listStyleFiles中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    Mediator.prototype.loadStyleFiles = function (handler) {
        var _this = this;
        var children = this._children.concat();
        var temp = function (err) {
            if (err || children.length <= 0) {
                // 调用onLoadStyleFiles接口
                _this.onLoadStyleFiles(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的资源
                var child = children.shift();
                child.loadStyleFiles(temp);
            }
        };
        // 开始加载css文件
        var cssFiles = this.listStyleFiles();
        // 去重
        cssFiles = unique(cssFiles);
        // 加载
        assetsManager.loadStyleFiles(cssFiles, temp);
    };
    /**
     * 加载从listJsFiles中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    Mediator.prototype.loadJsFiles = function (handler) {
        var _this = this;
        var children = this._children.concat();
        var temp = function (err) {
            if (err || children.length <= 0) {
                // 调用onLoadJsFiles接口
                _this.onLoadJsFiles(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的js
                var child = children.shift();
                child.loadJsFiles(temp);
            }
        };
        // 开始加载js文件
        var jsFiles = this.listJsFiles();
        // 去重
        jsFiles = unique(jsFiles);
        // 加载
        assetsManager.loadJsFiles(jsFiles, temp);
    };
    /**
     * 发送从listInitRequests中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    Mediator.prototype.sendInitRequests = function (handler) {
        var _this = this;
        var children = this._children.concat();
        var temp = function (responses) {
            if (responses instanceof Error) {
                var err = responses instanceof Error ? responses : undefined;
                // 调用onSendInitRequests接口
                _this.onSendInitRequests(err);
                // 调用回调
                handler(err);
            }
            else {
                if (isMine) {
                    isMine = false;
                    // 赋值返回值
                    _this.responses = responses;
                    // 调用回调
                    var stop = _this.onGetResponses(responses);
                    if (stop) {
                        var err = new Error("用户中止打开模块操作");
                        // 调用onSendInitRequests接口
                        _this.onSendInitRequests(err);
                        // 调用回调
                        handler(err);
                        return;
                    }
                }
                if (children.length <= 0) {
                    // 调用onSendInitRequests接口
                    _this.onSendInitRequests();
                    // 调用回调
                    handler();
                }
                else {
                    // 发送一个子中介者的初始化消息
                    var child = children.shift();
                    child.sendInitRequests(temp);
                }
            }
        };
        // 发送所有模块消息，模块消息默认发送全局内核
        var isMine = true;
        netManager.sendMultiRequests(this.listInitRequests(), temp, this, this.observable);
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
     * 当所需CSS加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    Mediator.prototype.onLoadStyleFiles = function (err) {
    };
    /**
     * 当所需js加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    Mediator.prototype.onLoadJsFiles = function (err) {
    };
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    Mediator.prototype.onSendInitRequests = function (err) {
    };
    /**
     * 当获取到所有初始化请求返回时调用，可以通过返回一个true来阻止模块的打开
     *
     * @param {ResponseData[]} responses 返回结构数组
     * @returns {boolean} 返回true则表示停止模块打开
     * @memberof Mediator
     */
    Mediator.prototype.onGetResponses = function (responses) {
        return false;
    };
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data] 开启数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    Mediator.prototype.open = function (data) {
        var _this = this;
        // 判断状态
        if (this._status === ComponentStatus.UNOPEN) {
            // 修改状态
            this._status = ComponentStatus.OPENING;
            // 赋值参数
            this.data = data;
            // 记一个是否需要遮罩的flag
            var maskFlag = this.openMask;
            // 发送初始化消息
            this.sendInitRequests(function (err) {
                if (err) {
                    // 移除遮罩
                    hideMask();
                    // 调用回调
                    _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                }
                else {
                    // 加载所有已托管中介者的资源
                    _this.loadAssets(function (err) {
                        if (err) {
                            // 移除遮罩
                            hideMask();
                            // 调用回调
                            _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                        }
                        else {
                            // 加载css文件
                            _this.loadStyleFiles(function (err) {
                                if (err) {
                                    // 移除遮罩
                                    hideMask();
                                    // 调用回调
                                    _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                }
                                else {
                                    // 加载js文件
                                    _this.loadJsFiles(function (err) {
                                        // 移除遮罩
                                        hideMask();
                                        // 判断错误
                                        if (err) {
                                            // 调用回调
                                            _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                        }
                                        else {
                                            // 要先开启自身，再开启子中介者
                                            // 调用回调
                                            _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.BeforeOpen);
                                            // 调用模板方法
                                            _this.__beforeOnOpen(data);
                                            // 调用自身onOpen方法
                                            var result = _this.onOpen(data);
                                            if (result !== undefined)
                                                _this.data = data = result;
                                            // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
                                            if (!_this._viewModel)
                                                _this.viewModel = {};
                                            // 记录子中介者数量，并监听其开启完毕事件
                                            var subCount = _this._children.length;
                                            if (subCount > 0) {
                                                // 调用所有已托管中介者的open方法
                                                for (var _i = 0, _a = _this._children; _i < _a.length; _i++) {
                                                    var child = _a[_i];
                                                    child.open(data);
                                                }
                                            }
                                            // 修改状态
                                            _this._status = ComponentStatus.OPENED;
                                            // 调用模板方法
                                            _this.__afterOnOpen(data);
                                            // 调用回调
                                            _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.AfterOpen);
                                            // 派发事件
                                            _this.dispatch(ComponentMessageType.COMPONENT_OPENED, _this);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            // 显示Loading
            if (maskFlag) {
                maskManager.showLoading(null, "mediatorOpen");
                maskFlag = false;
            }
        }
        // 返回自身引用
        return this;
        function hideMask() {
            // 隐藏Loading
            if (!maskFlag)
                maskManager.hideLoading("mediatorOpen");
            maskFlag = false;
        }
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
            var child = _a[_i];
            child.onWakeUp(from, data);
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
            var child = _a[_i];
            child.onActivate(from, data);
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
            var child = _a[_i];
            child.onDeactivate(to, data);
        }
    };
    /**
     * 列出中介者所需的资源数组，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listAssets = function () {
        return null;
    };
    /**
     * 列出所需CSS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listStyleFiles = function () {
        return null;
    };
    /**
     * 列出所需JS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    Mediator.prototype.listJsFiles = function () {
        return null;
    };
    /**
     * 列出模块初始化请求，可重写
     *
     * @returns {RequestData[]}
     * @memberof Mediator
     */
    Mediator.prototype.listInitRequests = function () {
        return null;
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
    return Mediator;
}(Component));
export default Mediator;
