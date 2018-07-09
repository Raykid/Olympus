import * as tslib_1 from "tslib";
import { getBridge, getBridgeBySkin, getBridges, registerBridge } from '../../kernel/bridge/BridgeUtil';
import { core } from '../core/Core';
import { Injectable } from '../injector/InjectorExt';
import { maskManager } from "../mask/MaskManager";
import Mediator from "../mediator/Mediator";
import { moduleManager } from "../module/ModuleManager";
import { panelManager } from "../panel/PanelManager";
import { sceneManager } from "../scene/SceneManager";
import BridgeMessage from "./BridgeMessageType";
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
    }
    Object.defineProperty(BridgeManager.prototype, "currentBridge", {
        /**
         * 获取当前的表现层桥实例（规则是取当前模块的第一个拥有bridge属性的Mediator的bridge）
         *
         * @readonly
         * @type {IBridgeExt}
         * @memberof BridgeManager
         */
        get: function () {
            // 找出当前的场景或模块
            var curHasBridge = sceneManager.currentScene || moduleManager.currentModuleInstance;
            // 先用当前首个IHasBridge的bridge
            if (curHasBridge) {
                var hasBridges = this.getAllHasBridges(curHasBridge);
                for (var _i = 0, hasBridges_1 = hasBridges; _i < hasBridges_1.length; _i++) {
                    var hasBridge = hasBridges_1[_i];
                    if (hasBridge.bridge)
                        return hasBridge.bridge;
                }
            }
            // 没找到，再用第一个桥代替
            return this.bridges[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BridgeManager.prototype, "bridges", {
        /**
         * 获取所有表现层桥
         *
         * @readonly
         * @type {IBridgeExt[]}
         * @memberof BridgeManager
         */
        get: function () {
            var bridgeList = getBridges();
            return bridgeList.map(function (bridgeData) { return bridgeData[0]; });
        },
        enumerable: true,
        configurable: true
    });
    BridgeManager.prototype.getAllHasBridges = function (hasBridge) {
        var result = [hasBridge];
        // 如果是中介者，则额外提供子中介者
        if (hasBridge instanceof Mediator) {
            for (var _i = 0, _a = hasBridge.children; _i < _a.length; _i++) {
                var temp = _a[_i];
                result = result.concat(this.getAllHasBridges(temp));
            }
        }
        return result;
    };
    /**
     * 获取表现层桥实例
     *
     * @param {string} type 表现层类型
     * @returns {IBridgeExt} 表现层桥实例
     * @memberof BridgeManager
     */
    BridgeManager.prototype.getBridge = function (type) {
        var bridge = getBridge(type);
        return bridge && bridge[0];
    };
    /**
     * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
     *
     * @param {*} skin 皮肤实例
     * @returns {IBridgeExt|null} 皮肤所属表现层桥实例
     * @memberof BridgeManager
     */
    BridgeManager.prototype.getBridgeBySkin = function (skin) {
        return getBridgeBySkin(skin);
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
            var onLoad = function () {
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
            registerBridge.apply(void 0, bridges);
            // 开始初始化
            for (var _a = 0, bridges_1 = bridges; _a < bridges_1.length; _a++) {
                var bridge = bridges_1[_a];
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
            var data = getBridge(bridge.type);
            data[1] = true;
            // 先隐藏表现层桥的wrapper
            bridge.wrapper.style.display = "none";
            // 测试是否全部初始化完毕
            self.testAllInit();
        }
    };
    BridgeManager.prototype.testAllInit = function () {
        var allInited = true;
        for (var _i = 0, _a = getBridges(); _i < _a.length; _i++) {
            var data = _a[_i];
            allInited = allInited && data[1];
        }
        if (allInited)
            core.dispatch(BridgeMessage.BRIDGE_ALL_INIT);
    };
    BridgeManager = tslib_1.__decorate([
        Injectable
    ], BridgeManager);
    return BridgeManager;
}());
export default BridgeManager;
/** 再额外导出一个单例 */
export var bridgeManager = core.getInject(BridgeManager);
