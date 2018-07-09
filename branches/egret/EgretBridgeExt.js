/// <amd-module name="EgretBridgeExt"/>
import * as tslib_1 from "tslib";
import { core } from "olympus-r/project/core/Core";
import { environment } from 'olympus-r/project/env/Environment';
import ModuleMessageType from "olympus-r/project/module/ModuleMessageType";
import SceneMessageType from "olympus-r/project/scene/SceneMessageType";
import { version } from 'olympus-r/project/version/Version';
import { load } from 'olympus-r/utils/HTTPUtil';
import { wrapAbsolutePath } from 'olympus-r/utils/URLUtil';
import AssetsLoader from "./egret/AssetsLoader";
import UpdateScreenSizeCommand from "./egret/command/UpdateScreenSizeCommand";
import MaskEntity from "./egret/mask/MaskEntity";
import BackPanelPolicy from "./egret/panel/BackPanelPolicy";
import FadeScenePolicy from "./egret/scene/FadeScenePolicy";
import { wrapSkin } from "./egret/utils/SkinUtil";
import EgretBridge from './EgretBridge';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
var EgretBridgeExt = /** @class */ (function (_super) {
    tslib_1.__extends(EgretBridgeExt, _super);
    function EgretBridgeExt(params) {
        var _this = _super.call(this, params) || this;
        /**
         * 默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof EgretBridge
         */
        _this.defaultPanelPolicy = new BackPanelPolicy();
        /**
         * 默认场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof EgretBridge
         */
        _this.defaultScenePolicy = new FadeScenePolicy();
        return _this;
    }
    Object.defineProperty(EgretBridgeExt.prototype, "stage", {
        /**
         * 获取舞台引用
         *
         * @readonly
         * @type {egret.Stage}
         * @memberof EgretBridge
         */
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "bgLayer", {
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._bgLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "sceneLayer", {
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._sceneLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "frameLayer", {
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._frameLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "panelLayer", {
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._panelLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "maskLayer", {
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._maskLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "topLayer", {
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        get: function () {
            return this._topLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "promptClass", {
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof EgretBridge
         */
        get: function () {
            return this._initParams.promptClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EgretBridgeExt.prototype, "maskEntity", {
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof EgretBridge
         */
        get: function () {
            return new MaskEntity(this._initParams.maskData);
        },
        enumerable: true,
        configurable: true
    });
    EgretBridgeExt.prototype.onRootInitialized = function (root, complete) {
        this._root = root;
        this._stage = root.stage;
        // 创建背景显示层
        this._bgLayer = new eui.UILayer();
        this._bgLayer.touchEnabled = false;
        root.addChild(this._bgLayer);
        // 创建场景显示层
        this._sceneLayer = new eui.UILayer();
        this._sceneLayer.touchEnabled = false;
        root.addChild(this._sceneLayer);
        // 创建框架显示层
        this._frameLayer = new eui.UILayer();
        this._frameLayer.touchEnabled = false;
        root.addChild(this._frameLayer);
        // 创建弹出层
        this._panelLayer = new eui.UILayer();
        this._panelLayer.touchEnabled = false;
        root.addChild(this._panelLayer);
        // 创建遮罩层
        this._maskLayer = new eui.UILayer();
        this._maskLayer.touchEnabled = false;
        root.addChild(this._maskLayer);
        // 创建顶级显示层
        this._topLayer = new eui.UILayer();
        this._topLayer.touchEnabled = false;
        root.addChild(this._topLayer);
        // 插入更新屏幕命令
        core.mapCommand(SceneMessageType.SCENE_BEFORE_CHANGE, UpdateScreenSizeCommand);
        // 设置资源和主题适配器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter(this._initParams));
        // 加载资源配置
        doLoad.call(this);
        function doLoad() {
            var _this = this;
            load({
                url: version.wrapHashUrl(this._initParams.pathPrefix + "resource/default.res.json"),
                useCDN: true,
                responseType: "text",
                onResponse: function (content) {
                    var data = JSON.parse(content);
                    RES.parseConfig(data, _this._initParams.pathPrefix + "resource/");
                    // 加载主题配置
                    var url = wrapAbsolutePath(_this._initParams.pathPrefix + "resource/default.thm.json", environment.curCDNHost);
                    var theme = new eui.Theme(url, _this._root.stage);
                    theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, _this);
                },
                onError: function (err) {
                    alert(err.message + "\nPlease try again later.");
                    doLoad.call(_this);
                }
            });
        }
        function onThemeLoadComplete(evt) {
            var _this = this;
            evt.target.removeEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);
            // 加载预加载资源组
            var preloadGroups = this._initParams.preloadGroups;
            this.loadAssets(preloadGroups, null, function (err) { return complete(_this); });
        }
    };
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof EgretBridge
     */
    EgretBridgeExt.prototype.wrapSkin = function (mediator, skin) {
        return wrapSkin(mediator, skin);
    };
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof EgretBridge
     */
    EgretBridgeExt.prototype.replaceSkin = function (mediator, current, target) {
        // Egret皮肤需要判断类型，进行不同处理
        if (current instanceof eui.Component) {
            if (target instanceof eui.Component) {
                // 两边都是eui组件，直接将右手皮肤赋值给左手
                current.skinName = target.skin;
            }
            else if (target instanceof egret.DisplayObject) {
                // 右手是普通显示对象，移除左手皮肤，添加右手显示到其中
                current.skinName = null;
                current.addChild(target);
            }
            else {
                // 其他情况都认为右手是皮肤数据
                current.skinName = target;
            }
            // 返回左手
            return current;
        }
        else {
            if (!(target instanceof egret.DisplayObject)) {
                // 右手不是显示对象，认为是皮肤数据，生成一个eui.Component包裹它
                var temp = new eui.Component();
                temp.skinName = target;
                target = temp;
            }
            // 右手替换左手位置
            var parent = current.parent;
            parent.addChildAt(target, parent.getChildIndex(current));
            parent.removeChild(current);
            // 返回右手
            return target;
        }
    };
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof EgretBridge
     */
    EgretBridgeExt.prototype.loadAssets = function (assets, mediator, handler) {
        var loader = new AssetsLoader({
            oneError: function (evt) {
                // 调用回调
                handler(new Error("资源加载失败"));
                // 派发加载错误事件
                core.dispatch(ModuleMessageType.MODULE_LOAD_ASSETS_ERROR, evt);
            },
            complete: function (dict) {
                // 调用回调
                handler();
            }
        });
        loader.loadGroups(assets);
    };
    /** 提供静态类型常量 */
    EgretBridgeExt.TYPE = "Egret";
    return EgretBridgeExt;
}(EgretBridge));
export default EgretBridgeExt;
var AssetAdapter = /** @class */ (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data)
                onGetRes(data);
            else
                RES.getResAsync(source, onGetRes, this);
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
    };
    return AssetAdapter;
}());
var ThemeAdapter = /** @class */ (function () {
    function ThemeAdapter(initParams) {
        this._initParams = initParams;
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
        var _this = this;
        load({
            url: version.wrapHashUrl(url),
            useCDN: true,
            responseType: "text",
            onResponse: function (result) {
                try {
                    // 需要为所有主题资源添加路径前缀
                    var data = JSON.parse(result);
                    for (var key in data.skins)
                        data.skins[key] = _this._initParams.pathPrefix + data.skins[key];
                    for (var key in data.exmls) {
                        // 如果只是URL则直接添加前缀，否则是内容集成方式，需要单独修改path属性
                        var exml = data.exmls[key];
                        if (typeof exml == "string")
                            data.exmls[key] = _this._initParams.pathPrefix + exml;
                        else
                            exml.path = _this._initParams.pathPrefix + exml.path;
                    }
                    result = JSON.stringify(data);
                }
                catch (err) { }
                compFunc.call(thisObject, result);
            },
            onError: function () {
                errorFunc.call(thisObject);
            }
        });
    };
    return ThemeAdapter;
}());
