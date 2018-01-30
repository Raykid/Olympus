var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import BridgeMessage from "./BridgeMessage";
import { panelManager } from "../panel/PanelManager";
import { moduleManager } from "../module/ModuleManager";
import { maskManager } from "../mask/MaskManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 用来管理所有表现层对象
*/
var BridgeManager = /** @class */ (function () {
    function BridgeManager() {
        this._bridgeDict = {};
        this._bridgeList = [];
    }
    Object.defineProperty(BridgeManager.prototype, "currentBridge", {
        /**
         * 获取当前的表现层桥实例（规则是取当前模块的第一个拥有bridge属性的Mediator的bridge）
         *
         * @readonly
         * @type {IBridge}
         * @memberof BridgeManager
         */
        get: function () {
            // 先用当前模块的首个拥有bridge的Mediator的bridge
            var curModule = moduleManager.currentModuleInstance;
            if (curModule) {
                var bridge;
                var mediators = curModule.children;
                for (var _i = 0, mediators_1 = mediators; _i < mediators_1.length; _i++) {
                    var mediator = mediators_1[_i];
                    if (mediator.bridge)
                        return mediator.bridge;
                }
            }
            // 没找到，再用第一个桥代替
            return (this._bridgeList[0] && this._bridgeList[0][0]);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取表现层桥实例
     *
     * @param {string} type 表现层类型
     * @returns {IBridge} 表现层桥实例
     * @memberof BridgeManager
     */
    BridgeManager.prototype.getBridge = function (type) {
        var data = this._bridgeDict[type];
        return (data && data[0]);
    };
    /**
     * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
     *
     * @param {*} skin 皮肤实例
     * @returns {IBridge|null} 皮肤所属表现层桥实例
     * @memberof BridgeManager
     */
    BridgeManager.prototype.getBridgeBySkin = function (skin) {
        if (skin) {
            // 遍历所有已注册的表现层桥进行判断
            for (var _i = 0, _a = this._bridgeList; _i < _a.length; _i++) {
                var data = _a[_i];
                var bridge = data[0];
                if (bridge.isMySkin(skin))
                    return bridge;
            }
        }
        return null;
    };
    /**
     * 注册一个表现层桥实例到框架中
     *
     * @param {...IBridge[]} bridges 要注册的所有表现层桥
     * @memberof BridgeManager
     */
    BridgeManager.prototype.registerBridge = function () {
        var _this = this;
        var bridges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bridges[_i] = arguments[_i];
        }
        // 进行DOM初始化判断
        if (!document.body) {
            var onLoad = function (evt) {
                window.removeEventListener("load", onLoad);
                // 重新调用注册方法
                _this.registerBridge.apply(_this, bridges);
            };
            window.addEventListener("load", onLoad);
            return;
        }
        // 进行初始化
        if (bridges.length > 0) {
            var self = this;
            // 记录
            for (var _a = 0, bridges_1 = bridges; _a < bridges_1.length; _a++) {
                var bridge = bridges_1[_a];
                var type = bridge.type;
                if (!this._bridgeDict[type]) {
                    var data = [bridge, false];
                    this._bridgeDict[type] = data;
                    this._bridgeList.push(data);
                }
            }
            // 开始初始化
            for (var _b = 0, bridges_2 = bridges; _b < bridges_2.length; _b++) {
                var bridge = bridges_2[_b];
                // 派发消息
                core.dispatch(BridgeMessage.BRIDGE_BEFORE_INIT, bridge);
                // 初始化Mask
                maskManager.registerMask(bridge.type, bridge.maskEntity);
                // 注册通用提示框
                panelManager.registerPrompt(bridge.type, bridge.promptClass);
                // 初始化该表现层实例
                if (bridge.init)
                    bridge.init(afterInitBridge);
                else
                    afterInitBridge(bridge);
            }
        }
        else {
            this.testAllInit();
        }
        function afterInitBridge(bridge) {
            // 派发消息
            core.dispatch(BridgeMessage.BRIDGE_AFTER_INIT, bridge);
            // 设置初始化完毕属性
            var data = self._bridgeDict[bridge.type];
            data[1] = true;
            // 先隐藏表现层桥的htmlWrapper
            bridge.htmlWrapper.style.display = "none";
            // 测试是否全部初始化完毕
            self.testAllInit();
        }
    };
    BridgeManager.prototype.testAllInit = function () {
        var allInited = true;
        for (var _i = 0, _a = this._bridgeList; _i < _a.length; _i++) {
            var data = _a[_i];
            allInited = allInited && data[1];
        }
        if (allInited)
            core.dispatch(BridgeMessage.BRIDGE_ALL_INIT);
    };
    BridgeManager = __decorate([
        Injectable
    ], BridgeManager);
    return BridgeManager;
}());
export default BridgeManager;
/** 再额外导出一个单例 */
export var bridgeManager = core.getInject(BridgeManager);
