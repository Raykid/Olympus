/// <amd-module name="DOMBridgeExt"/>
import * as tslib_1 from "tslib";
import { assetsManager } from "olympus-r/project/assets/AssetsManager";
import MaskEntity from "./dom/mask/MaskEntity";
import BackPanelPolicy from "./dom/panel/BackPanelPolicy";
import FadeScenePolicy from "./dom/scene/FadeScenePolicy";
import { toHTMLElement, wrapSkin } from './dom/utils/SkinUtilExt';
import DOMBridge from './DOMBridge';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 基于DOM的表现层桥实现
*/
var DOMBridgeExt = /** @class */ (function (_super) {
    tslib_1.__extends(DOMBridgeExt, _super);
    function DOMBridgeExt(params) {
        var _this = _super.call(this, params) || this;
        /**
         * 获取默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof DOMBridge
         */
        _this.defaultPanelPolicy = new BackPanelPolicy();
        /**
         * 获取默认场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof DOMBridge
         */
        _this.defaultScenePolicy = new FadeScenePolicy();
        return _this;
    }
    Object.defineProperty(DOMBridgeExt.prototype, "stage", {
        /**
         * 获取舞台引用，DOM的舞台指向根节点
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._initParams.container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "bgLayer", {
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._bgLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "sceneLayer", {
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._sceneLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "frameLayer", {
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._frameLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "panelLayer", {
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._panelLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "maskLayer", {
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._maskLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "topLayer", {
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        get: function () {
            return this._topLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "promptClass", {
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof DOMBridge
         */
        get: function () {
            return this._initParams.promptClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridgeExt.prototype, "maskEntity", {
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof DOMBridge
         */
        get: function () {
            return new MaskEntity(this._initParams.maskData);
        },
        enumerable: true,
        configurable: true
    });
    DOMBridgeExt.prototype.createLayer = function () {
        // 生成一个父容器，不响应点击事件，但会撑起全屏幕范围
        var layer = document.createElement("div");
        layer.style.position = "fixed";
        layer.style.top = "0%";
        layer.style.left = "0%";
        layer.style.width = "100%";
        layer.style.height = "100%";
        layer.style.pointerEvents = "none";
        this.root.appendChild(layer);
        // 生成一个子容器，实际用来放置子对象，目的是响应点击事件
        var subLayer = document.createElement("div");
        subLayer.style.pointerEvents = "auto";
        layer.appendChild(subLayer);
        // 返回子容器
        return subLayer;
    };
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof DOMBridge
     */
    DOMBridgeExt.prototype.init = function (complete) {
        var _this = this;
        _super.prototype.init.call(this, function (bridge) {
            // 创建背景显示层
            _this._bgLayer = _this.createLayer();
            // 创建场景显示层
            _this._sceneLayer = _this.createLayer();
            // 创建框架显示层
            _this._frameLayer = _this.createLayer();
            // 创建弹出层
            _this._panelLayer = _this.createLayer();
            // 创建遮罩层
            _this._maskLayer = _this.createLayer();
            // 创建顶级显示层
            _this._topLayer = _this.createLayer();
            // 调用回调
            complete(bridge);
        });
    };
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {HTMLElement|string|string[]} skin 原始HTMLElement节点
     * @returns {HTMLElement} 包装后的HTMLElement节点
     * @memberof DOMBridge
     */
    DOMBridgeExt.prototype.wrapSkin = function (mediator, skin) {
        return wrapSkin(mediator, skin);
    };
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {HTMLElement|string|string[]} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof DOMBridge
     */
    DOMBridgeExt.prototype.replaceSkin = function (mediator, current, target) {
        target = toHTMLElement(target);
        // 如果有父节点，则用目标节点替换当前节点位置
        var parent = current.parentElement;
        if (parent) {
            parent.insertBefore(target, current);
            parent.removeChild(current);
        }
        // 重新包装节点
        this.wrapSkin(mediator, target);
        // 返回皮肤
        return target;
    };
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof DOMBridge
     */
    DOMBridgeExt.prototype.loadAssets = function (assets, mediator, handler) {
        // 开始加载皮肤列表
        if (assets)
            assets = assets.concat();
        loadNext();
        function loadNext() {
            if (!assets || assets.length <= 0) {
                // 调用回调
                handler();
            }
            else {
                var skin = assets.shift();
                assetsManager.loadAssets(skin, function (result) {
                    if (result instanceof Error)
                        handler(result);
                    else
                        loadNext();
                });
            }
        }
    };
    /** 提供静态类型常量 */
    DOMBridgeExt.TYPE = "DOM";
    return DOMBridgeExt;
}(DOMBridge));
export default DOMBridgeExt;
