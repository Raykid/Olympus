import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import Observable from "../../core/observable/Observable";
import { unique } from "../../utils/ArrayUtil";
import { getConstructor } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { assetsManager } from "../assets/AssetsManager";
import { bindManager } from "../bind/BindManager";
import { mutate, unmutate } from "../bind/Mutator";
import { bridgeManager } from '../bridge/BridgeManager';
import { maskManager } from "../mask/MaskManager";
import { netManager } from "../net/NetManager";
import { system } from "../system/System";
import { ModuleOpenStatus } from "./IMediatorModulePart";
import MediatorMessage from "./MediatorMessage";
import MediatorStatus from "./MediatorStatus";
var moduleDict = {};
var moduleNameDict = new Dictionary();
/**
 * 注册模块
 *
 * @export
 * @param {string} moduleName 模块名
 * @param {IMediatorConstructor} cls 模块类型
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
 * @returns {IMediatorConstructor}
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
export function isMediator(target) {
    return (target.delegateMediator instanceof Function && target.undelegateMediator instanceof Function);
}
/**
 * 中介者基类
 *
 * @author Raykid
 * @date 2019-03-04
 * @export
 * @class Mediator
 * @implements {IMediator<S, OD, CD>}
 * @template S 皮肤类型
 * @template OD 开启参数类型
 * @template CD 关闭参数类型
 */
var Mediator = /** @class */ (function () {
    function Mediator(skin) {
        this._status = MediatorStatus.UNOPEN;
        /**
         * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
         *
         * @type {Dictionary<S, S>[]}
         * @memberof Mediator
         */
        this.bindTargets = [];
        this._openMask = true;
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
        // 赋值模块名称
        this._moduleName = getModuleName(this);
        // 赋值皮肤
        if (skin) {
            this.skin = skin;
            // 赋值桥
            this.bridge = bridgeManager.getBridgeBySkin(skin);
        }
        this.oriSkin = skin;
        // 初始化绑定
        bindManager.bind(this);
        // 生成开启Promise数据
        var openResolve;
        var openReject;
        var openPromise = new Promise(function (resolve, reject) {
            openResolve = resolve;
            openReject = reject;
        });
        this._openPromiseData = [openPromise, openResolve, openReject];
        // 生成关闭Promise数据
        var closeResolve;
        var closeReject;
        var closePromise = new Promise(function (resolve, reject) {
            closeResolve = resolve;
            closeReject = reject;
        });
        this._closePromiseData = [closePromise, closeResolve, closeReject];
    }
    Object.defineProperty(Mediator.prototype, "status", {
        /**
         * 获取中介者状态
         *
         * @readonly
         * @type {MediatorStatus}
         * @memberof Mediator
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
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
            return (this._status === MediatorStatus.DISPOSED);
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
                var mediator = _a[_i];
                mediator.responses = value;
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
        var mediators = this._children.concat();
        var temp = function (err) {
            if (err || mediators.length <= 0) {
                // 调用onLoadAssets接口
                _this.onLoadAssets(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的资源
                var mediator = mediators.shift();
                mediator.loadAssets(temp);
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
        var mediators = this._children.concat();
        var temp = function (err) {
            if (err || mediators.length <= 0) {
                // 调用onLoadStyleFiles接口
                _this.onLoadStyleFiles(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的资源
                var mediator = mediators.shift();
                mediator.loadStyleFiles(temp);
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
        var mediators = this._children.concat();
        var temp = function (err) {
            if (err || mediators.length <= 0) {
                // 调用onLoadJsFiles接口
                _this.onLoadJsFiles(err);
                // 调用回调
                handler(err);
            }
            else {
                // 加载一个子中介者的js
                var mediator = mediators.shift();
                mediator.loadJsFiles(temp);
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
        var mediators = this._children.concat();
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
                if (mediators.length <= 0) {
                    // 调用onSendInitRequests接口
                    _this.onSendInitRequests();
                    // 调用回调
                    handler();
                }
                else {
                    // 发送一个子中介者的初始化消息
                    var mediator = mediators.shift();
                    mediator.sendInitRequests(temp);
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
    ;
    Object.defineProperty(Mediator.prototype, "openData", {
        /**
         * 异步获取开启数据
         *
         * @readonly
         * @type {Promise<OD>}
         * @memberof Mediator
         */
        get: function () {
            return this._openPromiseData[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {OD} [data] 开启数据
     * @param {...any[]} args 其他数据
     * @returns {Promise<any>} 异步返回onOpen时返回的参数
     * @memberof Mediator
     */
    Mediator.prototype.open = function (data) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            // 判断状态
            if (_this._status === MediatorStatus.UNOPEN) {
                // 修改状态
                _this._status = MediatorStatus.OPENING;
                // 赋值参数
                _this.data = data;
                // 记一个是否需要遮罩的flag
                var maskFlag = _this.openMask;
                // 发送初始化消息
                _this.sendInitRequests(function (err) {
                    if (err) {
                        // 移除遮罩
                        hideMask();
                        // 调用回调
                        _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                        // 调用reject
                        reject(err);
                        _this._openPromiseData[2](err);
                    }
                    else {
                        // 加载所有已托管中介者的资源
                        _this.loadAssets(function (err) {
                            if (err) {
                                // 移除遮罩
                                hideMask();
                                // 调用回调
                                _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                // 调用reject
                                reject(err);
                                _this._openPromiseData[2](err);
                            }
                            else {
                                // 加载css文件
                                _this.loadStyleFiles(function (err) {
                                    if (err) {
                                        // 移除遮罩
                                        hideMask();
                                        // 调用回调
                                        _this.moduleOpenHandler && _this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                        // 调用reject
                                        reject(err);
                                        _this._openPromiseData[2](err);
                                    }
                                    else {
                                        // 加载js文件
                                        _this.loadJsFiles(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var result, subCount, _i, _a, mediator, err_1;
                                            return tslib_1.__generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        // 移除遮罩
                                                        hideMask();
                                                        if (!err) return [3 /*break*/, 1];
                                                        // 调用回调
                                                        this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                                        // 调用reject
                                                        reject(err);
                                                        this._openPromiseData[2](err);
                                                        return [3 /*break*/, 6];
                                                    case 1:
                                                        _b.trys.push([1, 5, , 6]);
                                                        // 要先开启自身，再开启子中介者
                                                        // 调用回调
                                                        this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.BeforeOpen);
                                                        // 调用模板方法
                                                        return [4 /*yield*/, this.__beforeOnOpen.apply(this, [data].concat(args))];
                                                    case 2:
                                                        // 调用模板方法
                                                        _b.sent();
                                                        return [4 /*yield*/, this.onOpen.apply(this, [data].concat(args))];
                                                    case 3:
                                                        result = _b.sent();
                                                        if (result !== undefined)
                                                            this.data = data = result;
                                                        // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
                                                        if (!this._viewModel)
                                                            this.viewModel = {};
                                                        subCount = this._children.length;
                                                        if (subCount > 0) {
                                                            // 调用所有已托管中介者的open方法
                                                            for (_i = 0, _a = this._children; _i < _a.length; _i++) {
                                                                mediator = _a[_i];
                                                                mediator.open(data);
                                                            }
                                                        }
                                                        // 修改状态
                                                        this._status = MediatorStatus.OPENED;
                                                        // 调用模板方法
                                                        return [4 /*yield*/, this.__afterOnOpen.apply(this, [data].concat(args))];
                                                    case 4:
                                                        // 调用模板方法
                                                        _b.sent();
                                                        // 调用回调
                                                        this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.AfterOpen);
                                                        // 派发事件
                                                        this.dispatch(MediatorMessage.MEDIATOR_OPENED, this);
                                                        // 调用resolve
                                                        resolve(this.data);
                                                        this._openPromiseData[1](this.data);
                                                        return [3 /*break*/, 6];
                                                    case 5:
                                                        err_1 = _b.sent();
                                                        reject(err_1);
                                                        this._openPromiseData[2](err_1);
                                                        return [3 /*break*/, 6];
                                                    case 6: return [2 /*return*/];
                                                }
                                            });
                                        }); });
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
            function hideMask() {
                // 隐藏Loading
                if (!maskFlag)
                    maskManager.hideLoading("mediatorOpen");
                maskFlag = false;
            }
        });
    };
    Mediator.prototype.__beforeOnOpen = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 给子类用的模板方法
    };
    Mediator.prototype.__afterOnOpen = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 给子类用的模板方法
    };
    Object.defineProperty(Mediator.prototype, "closeData", {
        /**
         * 异步获取关闭参数
         *
         * @readonly
         * @type {Promise<CD>}
         * @memberof Mediator
         */
        get: function () {
            return this._closePromiseData[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {CD} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {Promise<any>} 异步返回onClose时返回的参数
     * @memberof Mediator
     */
    Mediator.prototype.close = function (data) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var children, result, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._status === MediatorStatus.OPENED)) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        this._closeData = data;
                        children = this._children.concat();
                        return [4 /*yield*/, Promise.all(children.map(function (child) { return child.close(); }))];
                    case 2:
                        _a.sent();
                        // 关闭自身
                        // 调用模板方法
                        this.__beforeOnClose.apply(this, [data].concat(args));
                        // 修改状态
                        this._status = MediatorStatus.CLOSING;
                        return [4 /*yield*/, this.onClose.apply(this, [data].concat(args))];
                    case 3:
                        result = _a.sent();
                        if (result) {
                            this._closeData = result;
                        }
                        // 修改状态
                        this._status = MediatorStatus.CLOSED;
                        // 调用模板方法
                        this.__afterOnClose.apply(this, [data].concat(args));
                        // 调用resolve
                        resolve(this._closeData);
                        // 调用cache中的resolve
                        this._closePromiseData[1](this._closeData);
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        reject(err_2);
                        // 调用cache中的reject
                        this._closePromiseData[2](err_2);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        if (this._status < MediatorStatus.CLOSED) {
                            // 还没开启呢，等待Promise
                            this._closePromiseData[0].then(resolve).catch(reject);
                        }
                        else {
                            // 已经关闭过了，直接resolve
                            resolve(this._closeData);
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    Mediator.prototype.__beforeOnClose = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 给子类用的模板方法
    };
    Mediator.prototype.__afterOnClose = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 派发关闭事件
        this.dispatch(MediatorMessage.MEDIATOR_CLOSED, this);
    };
    /**
     * 当打开时调用
     *
     * @param {OD} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {any|Promise<any>} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    Mediator.prototype.onOpen = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 可重写
    };
    /**
     * 当关闭时调用
     *
     * @param {CD} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @returns {any|Promise<any>} 若返回对象则使用该对象当做close操作的返回值
     * @memberof Mediator
     */
    Mediator.prototype.onClose = function (data) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 可重写
    };
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {S} target 事件目标对象
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
     * @param {S} target 事件目标对象
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
    Object.defineProperty(Mediator.prototype, "root", {
        /**
         * 获取根级中介者（当做模块直接被打开的中介者）
         *
         * @type {IMediator}
         * @memberof IMediator
         */
        get: function () {
            return (this.parent ? this.parent.root : this);
        },
        enumerable: true,
        configurable: true
    });
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
     * 判断指定中介者是否包含在该中介者里（判断范围包括当前中介者和子孙级中介者）
     *
     * @param {IMediator} mediator 要判断的中介者
     * @returns {boolean}
     * @memberof Mediator
     */
    Mediator.prototype.containsMediator = function (mediator) {
        // 首先判断自身
        if (mediator === this)
            return true;
        // 判断子中介者
        var contains = false;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.containsMediator(mediator)) {
                contains = true;
                break;
            }
        }
        return contains;
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
     * @returns {JSFile[]}
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
        var _this = this;
        // 判断状态
        if (this.status >= MediatorStatus.DISPOSING)
            return;
        // 修改状态
        this._status = MediatorStatus.DISPOSING;
        // 移除绑定
        bindManager.unbind(this);
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
        unmutate(this._viewModel);
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除数据
        this.data = null;
        // 移除皮肤
        this.skin = null;
        this.oriSkin = null;
        // 移除父引用
        this.parent = null;
        // 移除其他无用对象
        this.moduleOpenHandler = null;
        this._openPromiseData = null;
        this._closePromiseData = null;
        // 将所有子中介者销毁
        var children = this._children.concat();
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            child.dispose();
        }
        // 将observable的销毁拖延到下一帧，因为虽然执行了销毁，但有可能这之后还会使用observable发送消息
        system.nextFrame(function () {
            // 移除observable
            _this._observable.dispose();
            _this._observable = null;
            // 修改状态
            _this._status = MediatorStatus.DISPOSED;
        });
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
