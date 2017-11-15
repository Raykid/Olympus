var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../core/Core", "../core/injector/Injector", "./bridge/BridgeManager", "./bridge/BridgeMessage", "./module/ModuleManager", "./assets/AssetsManager", "./env/Environment", "./env/Hash", "./version/Version", "./module/ModuleMessage"], function (require, exports, Core_1, Injector_1, BridgeManager_1, BridgeMessage_1, ModuleManager_1, AssetsManager_1, Environment_1, Hash_1, Version_1, ModuleMessage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            if (document.readyState == "loading")
                document.addEventListener("readystatechange", doInitialize);
            else
                doInitialize();
            function doInitialize() {
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
                Environment_1.environment.initialize(params.env, params.hostsDict, params.cdnsDict);
                // 初始化版本号工具
                Version_1.version.initialize(function () {
                    // 监听Bridge初始化完毕事件，显示第一个模块
                    Core_1.core.listen(BridgeMessage_1.default.BRIDGE_ALL_INIT, self.onAllBridgesInit, self);
                    // 注册并初始化表现层桥实例
                    BridgeManager_1.bridgeManager.registerBridge.apply(BridgeManager_1.bridgeManager, params.bridges);
                });
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
            // 注销监听
            Core_1.core.unlisten(BridgeMessage_1.default.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
            // 初始化插件
            if (this._initParams.plugins) {
                for (var _i = 0, _a = this._initParams.plugins; _i < _a.length; _i++) {
                    var plugin = _a[_i];
                    plugin.initPlugin();
                }
            }
            // 注册短名称
            AssetsManager_1.assetsManager.configPath(this._initParams.pathDict);
            // 开始预加载过程
            var preloads = this._initParams.preloads;
            if (preloads) {
                // 去加载
                AssetsManager_1.assetsManager.loadAssets(preloads, this.onPreloadOK.bind(this));
            }
            else {
                // 没有预加载，直接完成
                this.onPreloadOK();
            }
        };
        Engine.prototype.onPreloadOK = function () {
            // 调用回调
            this._initParams.onInited && this._initParams.onInited();
            // 监听首个模块开启
            Core_1.core.listen(ModuleMessage_1.default.MODULE_CHANGE, this.onModuleChange, this);
            // 打开首个模块
            ModuleManager_1.moduleManager.open(this._initParams.firstModule);
            // 如果有哈希模块则打开之
            if (Hash_1.hash.moduleName)
                ModuleManager_1.moduleManager.open(Hash_1.hash.moduleName, Hash_1.hash.params, Hash_1.hash.direct);
        };
        Engine.prototype.onModuleChange = function (from) {
            // 注销监听
            Core_1.core.unlisten(ModuleMessage_1.default.MODULE_CHANGE, this.onModuleChange, this);
            // 移除loadElement显示
            if (this._loadElement) {
                var parent = this._loadElement.parentElement;
                parent && parent.removeChild(this._loadElement);
            }
        };
        Engine = __decorate([
            Injector_1.Injectable
        ], Engine);
        return Engine;
    }());
    exports.default = Engine;
    /** 再额外导出一个单例 */
    exports.engine = Core_1.core.getInject(Engine);
});
//# sourceMappingURL=Engine.js.map