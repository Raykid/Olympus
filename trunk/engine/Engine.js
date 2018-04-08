import * as tslib_1 from "tslib";
import { core } from "../core/Core";
import { Injectable } from "../core/injector/Injector";
import { bridgeManager } from "./bridge/BridgeManager";
import BridgeMessage from "./bridge/BridgeMessage";
import { moduleManager } from "./module/ModuleManager";
import { assetsManager } from "./assets/AssetsManager";
import { environment } from "./env/Environment";
import { hash } from "./env/Hash";
import { version } from "./version/Version";
import ModuleMessage from "./module/ModuleMessage";
import EngineMessage from "./message/EngineMessage";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
var Engine = /** @class */ (function () {
    function Engine() {
    }
    /**
     * 初始化Engine
     *
     * @param {IInitParams} params 初始化参数
     * @memberof Engine
     */
    Engine.prototype.initialize = function (params) {
        var self = this;
        // 调用进度回调，初始化为0%
        params.onInitProgress && params.onInitProgress(0, InitStep.ReadyToInit);
        // 执行初始化
        if (document.readyState == "loading")
            document.addEventListener("readystatechange", doInitialize);
        else
            doInitialize();
        function doInitialize() {
            // 调用进度回调，开始初始化为10%
            params.onInitProgress && params.onInitProgress(0.1, InitStep.StartInit);
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
            version.initialize(function () {
                // 调用进度回调，版本号初始化完毕为20%
                params.onInitProgress && params.onInitProgress(0.2, InitStep.VersionInited);
                // 监听Bridge初始化完毕事件，显示第一个模块
                core.listen(BridgeMessage.BRIDGE_ALL_INIT, self.onAllBridgesInit, self);
                // 注册并初始化表现层桥实例
                bridgeManager.registerBridge.apply(bridgeManager, params.bridges);
            }, params.version);
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
        var _this = this;
        // 调用进度回调，表现层桥初始化完毕为30%
        this._initParams.onInitProgress && this._initParams.onInitProgress(0.3, InitStep.BridgesInited);
        // 注销监听
        core.unlisten(BridgeMessage.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
        // 初始化插件
        if (this._initParams.plugins) {
            for (var _i = 0, _a = this._initParams.plugins; _i < _a.length; _i++) {
                var plugin = _a[_i];
                plugin.initPlugin();
            }
        }
        // 注册短名称
        assetsManager.configPath(this._initParams.pathDict);
        // 开始预加载过程
        var preloads = this._initParams.preloads;
        if (preloads) {
            // 去加载
            var curIndex = 0;
            var totalCount = preloads.length;
            assetsManager.loadAssets(preloads, this.onPreloadOK.bind(this), null, function (key, value) {
                curIndex++;
                // 调用进度回调，每个预加载文件平分30%-90%的进度
                var progress = 0.3 + 0.6 * curIndex / totalCount;
                // 保留2位小数
                progress = Math.round(progress * 100) * 0.01;
                _this._initParams.onInitProgress && _this._initParams.onInitProgress(progress, InitStep.Preload, key, value);
            });
        }
        else {
            // 没有预加载，直接完成
            this.onPreloadOK();
        }
    };
    Engine.prototype.onPreloadOK = function () {
        // 调用进度回调，打开首个模块为90%
        this._initParams.onInitProgress && this._initParams.onInitProgress(0.9, InitStep.OpenFirstModule);
        // 派发事件
        core.dispatch(EngineMessage.INITIALIZED);
        // 调用初始化完成回调
        this._initParams.onInited && this._initParams.onInited();
        // 监听首个模块开启
        core.listen(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 打开首个模块
        moduleManager.open(this._initParams.firstModule, hash.firstModuleParams);
        // 如果有哈希模块则打开之
        for (var i in hash.moduleDatas) {
            var data = hash.moduleDatas[i];
            // 如果模块没有名字则不进行操作
            if (data.name)
                moduleManager.open(data.name, data.params, data.direct);
        }
    };
    Engine.prototype.onModuleChange = function (from) {
        // 调用进度回调，全部过程完毕，100%
        this._initParams.onInitProgress && this._initParams.onInitProgress(1, InitStep.Inited);
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
export var InitStep;
(function (InitStep) {
    /** 框架已准备好初始化 */
    InitStep[InitStep["ReadyToInit"] = 0] = "ReadyToInit";
    /** 开始执行初始化 */
    InitStep[InitStep["StartInit"] = 1] = "StartInit";
    /** 版本号系统初始化完毕 */
    InitStep[InitStep["VersionInited"] = 2] = "VersionInited";
    /** 表现层桥初始化完毕 */
    InitStep[InitStep["BridgesInited"] = 3] = "BridgesInited";
    /** 预加载，可能会触发多次，每次传递两个参数：预加载文件名或路径、预加载文件内容 */
    InitStep[InitStep["Preload"] = 4] = "Preload";
    /** 开始打开首个模块 */
    InitStep[InitStep["OpenFirstModule"] = 5] = "OpenFirstModule";
    /** 首个模块打开完毕，初始化流程完毕 */
    InitStep[InitStep["Inited"] = 6] = "Inited";
})(InitStep || (InitStep = {}));
