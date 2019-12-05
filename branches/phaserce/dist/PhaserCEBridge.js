/// <reference types="phaser-ce/typescript/phaser"/>
/// <amd-module name="PhaserCEBridge"/>
import * as tslib_1 from "tslib";
import nonePanelPolicy from 'olympus-r/engine/panel/NonePanelPolicy';
import noneScenePolicy from 'olympus-r/engine/scene/NoneScenePolicy';
import { getObjectHashs } from 'olympus-r/utils/ObjectUtil';
import p2 from 'phaser-ce/build/custom/p2';
import PIXI from 'phaser-ce/build/custom/pixi';
import MaskEntity from './phaserce/MaskEntity';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @date 2019-12-05
 *
 * PhaserCEBridge的表现层桥实现
*/
var PhaserCEBridge = /** @class */ (function () {
    function PhaserCEBridge(params) {
        /**
         * 默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof PhaserCEBridge
         */
        this.defaultPanelPolicy = nonePanelPolicy;
        /**
         * 默认场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof PhaserCEBridge
         */
        this.defaultScenePolicy = noneScenePolicy;
        this._listenerDict = {};
        this._initParams = params;
        if (!this._initParams.gameConfig) {
            this._initParams.gameConfig = {};
        }
    }
    Object.defineProperty(PhaserCEBridge.prototype, "type", {
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return PhaserCEBridge.TYPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "htmlWrapper", {
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._htmlWrapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "root", {
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "stage", {
        /**
         * 获取舞台引用
         *
         * @readonly
         * @type {Phaser.Stage}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "bgLayer", {
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._bgLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "sceneLayer", {
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._sceneLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "frameLayer", {
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._frameLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "panelLayer", {
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._panelLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "maskLayer", {
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._maskLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "topLayer", {
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {PIXI.DisplayObjectContainer}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._topLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "promptClass", {
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return this._initParams.promptClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhaserCEBridge.prototype, "maskEntity", {
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof PhaserCEBridge
         */
        get: function () {
            return new MaskEntity(tslib_1.__assign({}, this._initParams.maskData, { game: this._game }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.init = function (complete) {
        var _this = this;
        // 全局赋值依赖库
        window["PIXI"] = PIXI;
        window["p2"] = p2;
        // 动态加载Phaser分离库
        import("phaser-ce/build/custom/phaser-split").then(function (mod) {
            // 全局赋值
            var Phaser = mod.default;
            window["Phaser"] = Phaser;
            // 获取容器
            if (typeof _this._initParams.gameConfig.parent === "string") {
                _this._htmlWrapper = document.getElementById(_this._initParams.gameConfig.parent);
            }
            else {
                _this._htmlWrapper = _this._initParams.gameConfig.parent;
            }
            if (!_this._htmlWrapper) {
                // 没有就生成一个
                _this._htmlWrapper = document.createElement("div");
                document.body.appendChild(_this._htmlWrapper);
            }
            _this._htmlWrapper.style.position = "absolute";
            _this._htmlWrapper.style.width = "100%";
            _this._htmlWrapper.style.height = "100%";
            _this._initParams.gameConfig.parent = _this._htmlWrapper;
            // 生成Game
            _this._game = new Phaser.Game(tslib_1.__assign({}, _this._initParams.gameConfig, { state: tslib_1.__assign({}, _this._initParams.gameConfig.state, { create: function (game) {
                        // 赋值stage
                        _this._stage = game.stage;
                        // world当做root
                        _this._root = game.world;
                        // 生成背景容器
                        _this._bgLayer = game.add.sprite();
                        _this._root.addChild(_this._bgLayer);
                        // 生成场景容器
                        _this._sceneLayer = game.add.sprite();
                        _this._root.addChild(_this._sceneLayer);
                        // 生成框架容器
                        _this._frameLayer = game.add.sprite();
                        _this._root.addChild(_this._frameLayer);
                        // 生成弹窗容器
                        _this._panelLayer = game.add.sprite();
                        _this._root.addChild(_this._panelLayer);
                        // 生成遮罩容器
                        _this._maskLayer = game.add.sprite();
                        _this._root.addChild(_this._maskLayer);
                        // 生成顶级容器
                        _this._topLayer = game.add.sprite();
                        _this._root.addChild(_this._topLayer);
                        // 调用原始回调
                        _this._initParams.gameConfig.state && _this._initParams.gameConfig.state.create && _this._initParams.gameConfig.state.create(game);
                        // 报告初始化完毕
                        complete(_this);
                    } }) }));
        });
    };
    /**
     * 判断皮肤是否是Egret显示对象
     *
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.isMySkin = function (skin) {
        return skin instanceof PIXI.DisplayObject;
    };
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.wrapSkin = function (mediator, skin) {
        // return wrapSkin(mediator, skin);
        return skin;
    };
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {PIXI.DisplayObject} current 当前皮肤
     * @param {PIXI.DisplayObject} target 要替换的皮肤
     * @returns {PIXI.DisplayObject} 替换完毕的皮肤
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.replaceSkin = function (mediator, current, target) {
        var parent = current.parent;
        parent.addChildAt(target, parent.getChildIndex(current));
        parent.removeChild(current);
        return target;
    };
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {PIXI.DisplayObjectContainer} current 当前皮肤
     * @param {PIXI.DisplayObjectContainer} target 替换的皮肤
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.syncSkin = function (current, target) {
        if (!current || !target)
            return;
        // 设置属性
        var props = [
            "matrix", "alpha", "visible", "worldVisible"
        ];
        // 如果当前宽高不为0则同样设置宽高
        if (current.width > 0)
            props.push("width");
        if (current.height > 0)
            props.push("height");
        // 全部赋值
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            target[prop] = current[prop];
        }
    };
    /**
     * 创建一个空的显示对象
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.createEmptyDisplay = function () {
        return new PIXI.Sprite(PIXI.Texture.emptyTexture);
    };
    /**
     * 创建一个占位符
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.createPlaceHolder = function () {
        return this.createEmptyDisplay();
    };
    /**
     * 添加显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.addChild = function (parent, target) {
        if (parent && target)
            return parent.addChild(target);
        else
            return target;
    };
    /**
     * 按索引添加显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.addChildAt = function (parent, target, index) {
        if (parent && target)
            return parent.addChildAt(target, index);
        else
            return target;
    };
    /**
     * 移除显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 被移除的显示对象
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.removeChild = function (parent, target) {
        if (parent && target && target.parent === parent)
            return parent.removeChild(target);
        else
            return target;
    };
    /**
     * 按索引移除显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.removeChildAt = function (parent, index) {
        if (parent && index >= 0)
            return parent.removeChildAt(index);
        else
            return null;
    };
    /**
     * 移除所有显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.removeChildren = function (parent) {
        if (parent)
            parent.removeChildren();
    };
    /**
     * 获取父容器
     *
     * @param {PIXI.DisplayObject} target 目标对象
     * @returns {PIXI.DisplayObjectContainer} 父容器
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.getParent = function (target) {
        return target.parent;
    };
    /**
     * 获取指定索引处的显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {PIXI.DisplayObject} 索引处的显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.getChildAt = function (parent, index) {
        return parent.getChildAt(index);
    };
    /**
     * 获取显示索引
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.getChildIndex = function (parent, target) {
        return parent.getChildIndex(target);
    };
    /**
     * 通过名称获取显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {PIXI.DisplayObject} 显示对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.getChildByName = function (parent, name) {
        for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child["name"] === name) {
                return child;
            }
        }
        return null;
    };
    /**
     * 获取子显示对象数量
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.getChildCount = function (parent) {
        return parent.children.length;
    };
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.loadAssets = function (assets, mediator, handler) {
        handler();
    };
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {PIXI.DisplayObject&PIXI.Mixin} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.mapListener = function (target, type, handler, thisArg) {
        var hash = getObjectHashs(target, type, handler, thisArg);
        if (!this._listenerDict[hash]) {
            var wrappedHandler = thisArg ? handler.bind(thisArg) : handler;
            this._listenerDict[hash] = wrappedHandler;
            target.on(type, wrappedHandler);
        }
    };
    /**
     * 注销监听事件
     *
     * @param {PIXI.DisplayObject&PIXI.Mixin} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    PhaserCEBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
        var hash = getObjectHashs(target, type, handler, thisArg);
        var wrappedHandler = this._listenerDict[hash];
        if (wrappedHandler) {
            target.off(type, wrappedHandler);
            delete this._listenerDict[hash];
        }
    };
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:PIXI.DisplayObject)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    PhaserCEBridge.prototype.wrapBindFor = function (target, rendererHandler) {
    };
    /**
     * 为列表显示对象赋值
     *
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    PhaserCEBridge.prototype.valuateBindFor = function (target, datas, memento) {
    };
    /** 提供静态类型常量 */
    PhaserCEBridge.TYPE = "PhaserCE";
    return PhaserCEBridge;
}());
export default PhaserCEBridge;
