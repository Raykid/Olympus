/// <amd-module name="ThreeBridge"/>
/// <reference types="olympus-r"/>
import { Object3D } from "three";
import { NonePanelPolicy } from "olympus-r/engine/panel/NonePanelPolicy";
import { NoneScenePolicy } from "olympus-r/engine/scene/NoneScenePolicy";
import { system } from "olympus-r/engine/system/System";
import { getObjectHashs } from "olympus-r/utils/ObjectUtil";
import MaskEntityImpl from "./three/mask/MaskEntity";
import { core } from "olympus-r/core/Core";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import AssetsLoader from "./three/assets/AssetsLoader";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 *
 * Olympus的Three.js表现层桥
*/
var ThreeBridge = /** @class */ (function () {
    function ThreeBridge(params) {
        this._renderList = [];
        /**
         * 获取或设置默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof ThreeBridge
         */
        this.defaultPanelPolicy = new NonePanelPolicy();
        /**
         * 获取或设置场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof ThreeBridge
         */
        this.defaultScenePolicy = new NoneScenePolicy();
        this._listenerDict = {};
        this._initParams = params;
    }
    Object.defineProperty(ThreeBridge.prototype, "initParams", {
        /**
         * 获取初始化参数
         *
         * @readonly
         * @type {IInitParams}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._initParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "type", {
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof ThreeBridge
         */
        get: function () {
            return ThreeBridge.TYPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "htmlWrapper", {
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._initParams.container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "root", {
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "stage", {
        /**
         * 获取舞台引用
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "bgLayer", {
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "sceneLayer", {
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "frameLayer", {
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "panelLayer", {
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "maskLayer", {
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "topLayer", {
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {Object3D}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._visualContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "promptClass", {
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof ThreeBridge
         */
        get: function () {
            return this._initParams.promptClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThreeBridge.prototype, "maskEntity", {
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof ThreeBridge
         */
        get: function () {
            return new MaskEntityImpl();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     *
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.init = function (complete) {
        var _this = this;
        // 如果是名称，则转变成引用
        if (typeof this._initParams.container == "string") {
            this._initParams.container = document.querySelector(this._initParams.container);
        }
        // 如果是空，则生成一个
        if (!this._initParams.container) {
            this._initParams.container = document.createElement("div");
            document.body.appendChild(this._initParams.container);
        }
        // 初始化容器
        this._initParams.container.style.margin = "auto";
        this._initParams.container.style.width = "100%";
        this._initParams.container.style.height = "100%";
        this._initParams.container.style.position = "fixed";
        this._initParams.container.style.top = "0%";
        this._initParams.container.style.left = "0%";
        // 根据帧频设置决定使用何种渲染驱动方式
        if (this._initParams.frameRate > 0) {
            // 规定了，设置setInterval
            this._renderCancelable = system.setInterval(1000 / this._initParams.frameRate, this.onRender, this);
        }
        else {
            // 没规定，监听enterframe事件
            this._renderCancelable = system.enterFrame(this.onRender, this);
        }
        // 监听页面resize事件
        window.addEventListener("resize", function () { return _this.onResize(); });
        // 调用回调
        complete(this);
    };
    ThreeBridge.prototype.onRender = function () {
        // 进行渲染
        for (var _i = 0, _a = this._renderList; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.render();
        }
    };
    ThreeBridge.prototype.onResize = function (handler) {
        // 计算宽高
        var coe = window.innerWidth / window.innerHeight;
        var coeDesign = this._initParams.width / this._initParams.height;
        var w, h;
        if (coe > coeDesign) {
            // 比设计宽，保持高度，扩展宽度
            w = this._initParams.height * coe;
            h = this._initParams.height;
        }
        else {
            // 比设计高，保持宽度，扩展高度
            w = this._initParams.width;
            h = this._initParams.width / coe;
        }
        // 调用回调
        if (handler) {
            handler.resize(w, h);
        }
        else {
            for (var _i = 0, _a = this._renderList; _i < _a.length; _i++) {
                var handler_1 = _a[_i];
                handler_1.resize(w, h);
            }
        }
    };
    /**
     * 判断传入的skin是否是属于该表现层桥的
     *
     * @param {IThreeSkin} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.isMySkin = function (skin) {
        return (skin.renderer &&
            skin.scene &&
            skin.scene.isObject3D &&
            skin.camera &&
            skin.camera.isObject3D);
    };
    /**
     * 创建一个空的显示对象
     *
     * @returns {Object3D}
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.createEmptyDisplay = function () {
        return new Object3D();
    };
    /**
     * 添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.addChild = function (parent, target) {
        if (parent && target) {
            parent.add(target);
            return target;
        }
        else {
            return target;
        }
    };
    /**
     * 按索引添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.addChildAt = function (parent, target, index) {
        var result = this.addChild(parent, target);
        // 要调整索引到指定位置
        var temp = this.getChildIndex(parent, target);
        if (temp >= 0) {
            parent.children.splice(temp, 1);
            parent.children.splice(index, 0, target);
        }
        return result;
    };
    /**
     * 移除显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 被移除的显示对象
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.removeChild = function (parent, target) {
        if (parent && target && target.parent === parent) {
            parent.remove(target);
            return target;
        }
        else {
            return target;
        }
    };
    /**
     * 按索引移除显示
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 索引
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.removeChildAt = function (parent, index) {
        var target = this.getChildAt(parent, index);
        return this.removeChild(parent, target);
    };
    /**
     * 移除所有显示对象
     *
     * @param {Object3D} parent 父容器
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.removeChildren = function (parent) {
        for (var i = parent.children.length - 1; i >= 0; i--) {
            this.removeChildAt(parent, 0);
        }
    };
    /**
     * 获取父容器
     *
     * @param {Object3D} target 指定显示对象
     * @return {Object3D} 父容器
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.getParent = function (target) {
        return target.parent;
    };
    /**
     * 获取指定索引处的显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Object3D} 索引处的显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.getChildAt = function (parent, index) {
        return parent.children[index];
    };
    /**
     * 获取显示索引
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.getChildIndex = function (parent, target) {
        return parent.children.indexOf(target);
    };
    /**
     * 通过名称获取显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {string} name 对象名称
     * @return {Object3D} 显示对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.getChildByName = function (parent, name) {
        return parent.getObjectByName(name);
    };
    /**
     * 获取子显示对象数量
     *
     * @param {Object3D} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.getChildCount = function (parent) {
        return parent.children.length;
    };
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.loadAssets = function (assets, mediator, handler) {
        new AssetsLoader({
            oneError: function (error) {
                // 调用回调
                handler(error);
                // 派发加载错误事件
                core.dispatch(ModuleMessage.MODULE_LOAD_ASSETS_ERROR, error);
            },
            complete: function () {
                // 调用回调
                handler();
            }
        }).load(assets);
    };
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.mapListener = function (target, type, handler, thisArg) {
        var key = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则不再监听
        if (this._listenerDict[key])
            return;
        // 监听
        var listener = function (evt) {
            // 调用回调
            handler.call(thisArg || this, evt);
        };
        target.addEventListener(type, listener);
        // 记录监听
        this._listenerDict[key] = listener;
    };
    /**
     * 注销监听事件
     *
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
        var key = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则移除监听
        var listener = this._listenerDict[key];
        if (listener) {
            target.removeEventListener(type, listener);
            // 移除记录
            delete this._listenerDict[key];
        }
    };
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} handler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.wrapBindFor = function (target, handler) {
        var parent = target.parent;
        var index = this.getChildIndex(parent, target);
        // 生成一个from节点和一个to节点，用来占位
        var from = this.createEmptyDisplay();
        this.addChildAt(parent, from, index);
        var to = this.createEmptyDisplay();
        this.addChildAt(parent, to, index + 1);
        // 移除显示
        this.removeChild(parent, target);
        // 返回备忘录
        return { parent: parent, from: from, to: to, handler: handler };
    };
    /**
     * 为列表显示对象赋值
     *
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.valuateBindFor = function (target, datas, memento) {
        // 移除已有的列表项显示
        var parent = memento.parent;
        if (parent) {
            var fromIndex = this.getChildIndex(parent, memento.from);
            var toIndex = this.getChildIndex(parent, memento.to);
            for (var i = fromIndex + 1; i < toIndex; i++) {
                this.removeChildAt(parent, fromIndex + 1);
            }
        }
        // 添加新的渲染器
        for (var key in datas) {
            var newObject = target.clone(true);
            // 添加显示
            var index = this.getChildIndex(parent, memento.to);
            this.addChildAt(parent, newObject, index++);
            // 调用回调
            memento.handler(key, datas[key], newObject);
        }
    };
    /**
     * 添加渲染回调
     *
     * @param {IRenderHandler} handler
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.addRenderHandler = function (handler) {
        if (this._renderList.indexOf(handler) < 0) {
            this._renderList.push(handler);
            // 添加成功后先触发一次resize
            this.onResize(handler);
        }
    };
    /**
     * 移除渲染回调
     *
     * @param {IRenderHandler} handler
     * @memberof ThreeBridge
     */
    ThreeBridge.prototype.removeRenderHandler = function (handler) {
        var index = this._renderList.indexOf(handler);
        if (index >= 0)
            this._renderList.splice(index, 1);
    };
    /** 提供静态类型常量 */
    ThreeBridge.TYPE = "Three.js";
    return ThreeBridge;
}());
export default ThreeBridge;
