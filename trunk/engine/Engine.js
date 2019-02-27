import * as tslib_1 from "tslib";
import { core } from "../core/Core";
import { Injectable } from "../core/injector/Injector";
import { assetsManager } from "./assets/AssetsManager";
import { bridgeManager } from "./bridge/BridgeManager";
import BridgeMessage from "./bridge/BridgeMessage";
import { environment } from "./env/Environment";
import { hash } from "./env/Hash";
import EngineMessage from "./message/EngineMessage";
import { moduleManager } from "./module/ModuleManager";
import ModuleMessage from "./module/ModuleMessage";
import { version } from "./version/Version";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
export var InitStep;
(function (InitStep) {
    /** 框架尚未开始初始化 */
    InitStep[InitStep["Uninit"] = 0] = "Uninit";
    /** 框架已准备好初始化 */
    InitStep[InitStep["ReadyToInit"] = 1] = "ReadyToInit";
    /** 开始执行初始化 */
    InitStep[InitStep["StartInit"] = 2] = "StartInit";
    /** 版本号系统初始化完毕 */
    InitStep[InitStep["VersionInited"] = 3] = "VersionInited";
    /** 表现层桥初始化完毕 */
    InitStep[InitStep["BridgesInited"] = 4] = "BridgesInited";
    /** 预加载，可能会触发多次，每次传递两个参数：预加载文件名或路径、预加载文件内容 */
    InitStep[InitStep["Preload"] = 5] = "Preload";
    /** 开始打开首个模块 */
    InitStep[InitStep["OpenFirstModule"] = 6] = "OpenFirstModule";
    /** 首个模块打开完毕，初始化流程完毕 */
    InitStep[InitStep["Inited"] = 7] = "Inited";
})(InitStep || (InitStep = {}));
var Engine = /** @class */ (function () {
    function Engine() {
        this._initStep = InitStep.Uninit;
    }
    Object.defineProperty(Engine.prototype, "initParams", {
        /**
         * 获取初始化参数
         *
         * @readonly
         * @type {IInitParams}
         * @memberof Engine
         */
        get: function () {
            return this._initParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "initStep", {
        /**
         * 获取框架初始化进程
         *
         * @readonly
         * @type {InitStep}
         * @memberof Engine
         */
        get: function () {
            return this._initStep;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化Engine
     *
     * @param {IInitParams} params 初始化参数
     * @memberof Engine
     */
    Engine.prototype.initialize = function (params) {
        var self = this;
        // 调用进度回调，初始化为0%
        this._initStep = InitStep.ReadyToInit;
        params.onInitProgress && params.onInitProgress(0, this._initStep);
        // 执行初始化
        if (document.readyState == "loading")
            document.addEventListener("readystatechange", doInitialize);
        else
            doInitialize();
        function doInitialize() {
            // 调用进度回调，开始初始化为10%
            self._initStep = InitStep.StartInit;
            params.onInitProgress && params.onInitProgress(0.1, self._initStep);
            // 移除事件
            if (this == document)
                document.removeEventListener("readystatechange", doInitialize);
            // 要判断document是否初始化完毕
            self._initParams = params;
            // 加载页
            self._loadElement = (typeof params.loadElement == "string" ? document.querySelector(params.loadElement) : params.loadElement);
            // 监听错误事件
            if (params.onError)
                self.listenError(params.onError);
            // 初始化环境参数
            environment.initialize(params.env, params.hostsDict, params.cdnsDict);
            // 初始化版本号工具
            if (params.hasVersion !== false)
                version.initialize(afterInitVersion, params.version);
            else
                afterInitVersion();
            function afterInitVersion() {
                // 调用进度回调，版本号初始化完毕为20%
                self._initStep = InitStep.VersionInited;
                params.onInitProgress && params.onInitProgress(0.2, self._initStep);
                // 监听Bridge初始化完毕事件，显示第一个模块
                core.listen(BridgeMessage.BRIDGE_ALL_INIT, self.onAllBridgesInit, self);
                // 注册并初始化表现层桥实例
                bridgeManager.registerBridge.apply(bridgeManager, params.bridges);
            }
        }
    };
    /**
     * 添加错误监听函数
     *
     * @param {(evt?:ErrorEvent)=>void} handler 错误监听函数
     * @memberof Engine
     */
    Engine.prototype.listenError = function (handler) {
        if (handler)
            window.addEventListener("error", handler);
    };
    Engine.prototype.onAllBridgesInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin, preloads, curIndex, totalCount;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // 调用进度回调，表现层桥初始化完毕为30%
                        this._initStep = InitStep.BridgesInited;
                        this._initParams.onInitProgress && this._initParams.onInitProgress(0.3, this._initStep);
                        // 注销监听
                        core.unlisten(BridgeMessage.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
                        if (!this._initParams.plugins) return [3 /*break*/, 4];
                        _i = 0, _a = this._initParams.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.initPlugin()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // 注册短名称
                        assetsManager.configPath(this._initParams.pathDict);
                        preloads = this._initParams.preloads;
                        if (preloads) {
                            curIndex = 0;
                            totalCount = preloads.length;
                            assetsManager.loadAssets(preloads, this.onPreloadOK.bind(this), null, function (key, value) {
                                curIndex++;
                                // 调用进度回调，每个预加载文件平分30%-90%的进度
                                var progress = 0.3 + 0.6 * curIndex / totalCount;
                                // 保留2位小数
                                progress = Math.round(progress * 100) * 0.01;
                                _this._initStep = InitStep.Preload;
                                _this._initParams.onInitProgress && _this._initParams.onInitProgress(progress, _this._initStep, key, value);
                            });
                        }
                        else {
                            // 没有预加载，直接完成
                            this.onPreloadOK();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Engine.prototype.onPreloadOK = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, i, data;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // 调用进度回调，打开首个模块为90%
                        this._initStep = InitStep.OpenFirstModule;
                        this._initParams.onInitProgress && this._initParams.onInitProgress(0.9, this._initStep);
                        // 派发事件
                        core.dispatch(EngineMessage.INITIALIZED);
                        // 调用初始化完成回调
                        _a = this._initParams.onInited;
                        if (!_a) 
                        // 调用初始化完成回调
                        return [3 /*break*/, 2];
                        return [4 /*yield*/, this._initParams.onInited()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        // 调用初始化完成回调
                        _a;
                        // 监听首个模块开启
                        core.listen(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
                        // 打开首个模块
                        moduleManager.open(this._initParams.firstModule, hash.firstModuleParams);
                        // 如果有哈希模块则打开之
                        for (i in hash.moduleDatas) {
                            data = hash.moduleDatas[i];
                            // 如果模块没有名字则不进行操作
                            if (data.name)
                                moduleManager.open(data.name, data.params, data.direct);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Engine.prototype.onModuleChange = function (from) {
        // 调用进度回调，全部过程完毕，100%
        this._initStep = InitStep.Inited;
        this._initParams.onInitProgress && this._initParams.onInitProgress(1, this._initStep);
        // 注销监听
        core.unlisten(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 移除loadElement显示
        if (this._loadElement) {
            var parent = this._loadElement.parentElement;
            parent && parent.removeChild(this._loadElement);
        }
    };
    Engine = tslib_1.__decorate([
        Injectable
    ], Engine);
    return Engine;
}());
export default Engine;
/** 再额外导出一个单例 */
export var engine = core.getInject(Engine);
