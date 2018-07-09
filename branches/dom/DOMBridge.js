/// <amd-module name="DOMBridge"/>
import { extendObject, getObjectHashs } from "olympus-r/utils/ObjectUtil";
import { copyRef, isDOMPath, isDOMStr } from "./dom/utils/SkinUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 基于DOM的表现层桥实现
*/
var DOMBridge = /** @class */ (function () {
    function DOMBridge(params) {
        this._listenerDict = {};
        this._initParams = params;
    }
    Object.defineProperty(DOMBridge.prototype, "type", {
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof DOMBridge
         */
        get: function () {
            return DOMBridge.TYPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMBridge.prototype, "wrapper", {
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
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
    Object.defineProperty(DOMBridge.prototype, "root", {
        /**
         * 获取根显示节点
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
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof DOMBridge
     */
    DOMBridge.prototype.init = function (complete) {
        // 如果是名称，则转变成引用
        if (typeof this._initParams.container == "string") {
            this._initParams.container = document.querySelector(this._initParams.container);
        }
        // 如果是空，则生成一个
        if (!this._initParams.container) {
            this._initParams.container = document.createElement("div");
            document.body.appendChild(this._initParams.container);
        }
        // 调用回调
        complete(this);
    };
    /**
     * 判断皮肤是否是DOM显示节点
     *
     * @param {HTMLElement|string|string[]} skin 皮肤对象
     * @returns {boolean} 是否是DOM显示节点
     * @memberof DOMBridge
     */
    DOMBridge.prototype.isMySkin = function (skin) {
        if (skin instanceof HTMLElement)
            return true;
        if (typeof skin === "string" && (isDOMPath(skin) || isDOMStr(skin)))
            return true;
        if (skin instanceof Array) {
            // 数组里每一个元素都必须是皮肤
            var result = true;
            for (var _i = 0, skin_1 = skin; _i < skin_1.length; _i++) {
                var temp = skin_1[_i];
                if (!(typeof temp === "string" && (isDOMPath(temp) || isDOMStr(temp)))) {
                    result = false;
                    break;
                }
            }
            return result;
        }
        return false;
    };
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {HTMLElement} current 当前皮肤
     * @param {HTMLElement} target 替换的皮肤
     * @memberof DOMBridge
     */
    DOMBridge.prototype.syncSkin = function (current, target) {
        if (!current || !target)
            return;
        // DOM无需特意同步，因为其样式都可以以css样式方式在外部表示，而仅有当前节点的style属性是需要同步的
        extendObject(target.style, current.style);
    };
    /**
     * 创建一个空的显示对象
     *
     * @returns {HTMLElement}
     * @memberof DOMBridge
     */
    DOMBridge.prototype.createEmptyDisplay = function () {
        return document.createElement("div");
    };
    /**
     * 添加显示
     *
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @return {Element} 返回被添加的显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.addChild = function (parent, target) {
        return parent.appendChild(target);
    };
    /**
     * 按索引添加显示
     *
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Element} 返回被添加的显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.addChildAt = function (parent, target, index) {
        return parent.insertBefore(target, this.getChildAt(parent, index));
    };
    /**
     * 移除显示对象
     *
     * @param {Element} parent 父容器
     * @param {Element} target 被移除的显示对象
     * @return {Element} 返回被移除的显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.removeChild = function (parent, target) {
        if (parent && target && target.parentElement === parent)
            return parent.removeChild(target);
        else
            return target;
    };
    /**
     * 按索引移除显示
     *
     * @param {Element} parent 父容器
     * @param {number} index 索引
     * @return {Element} 返回被移除的显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.removeChildAt = function (parent, index) {
        return this.removeChild(parent, this.getChildAt(parent, index));
    };
    /**
     * 移除所有显示对象
     *
     * @param {Element} parent 父容器
     * @memberof DOMBridge
     */
    DOMBridge.prototype.removeChildren = function (parent) {
        for (var i = 0, len = parent.children.length; i < len; i++) {
            parent.removeChild(parent.children.item(i));
        }
    };
    /**
     * 获取父容器
     *
     * @param {Element} target 目标对象
     * @returns {Element} 父容器
     * @memberof DOMBridge
     */
    DOMBridge.prototype.getParent = function (target) {
        return target.parentElement;
    };
    /**
     * 获取指定索引处的显示对象
     *
     * @param {Element} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Element} 索引处的显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.getChildAt = function (parent, index) {
        return parent.children.item(index);
    };
    /**
     * 获取显示索引
     *
     * @param {Element} parent 父容器
     * @param {Element} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof DOMBridge
     */
    DOMBridge.prototype.getChildIndex = function (parent, target) {
        for (var i = 0, len = parent.children.length; i < len; i++) {
            if (target === parent.children.item(i))
                return i;
        }
        return -1;
    };
    /**
     * 通过名称获取显示对象
     *
     * @param {Element} parent 父容器
     * @param {string} name 对象名称
     * @return {Element} 显示对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.getChildByName = function (parent, name) {
        return parent.children.namedItem(name);
    };
    /**
     * 获取子显示对象数量
     *
     * @param {Element} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof DOMBridge
     */
    DOMBridge.prototype.getChildCount = function (parent) {
        return parent.childElementCount;
    };
    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
     *
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.mapListener = function (target, type, handler, thisArg) {
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
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof DOMBridge
     */
    DOMBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
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
     * @param {HTMLElement} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:HTMLElement)=>void} handler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    DOMBridge.prototype.wrapBindFor = function (target, handler) {
        var parent = target.parentElement;
        // 生成一个from节点和一个to节点，用来占位
        var from = document.createElement("div");
        var to = document.createElement("div");
        parent && parent.insertBefore(from, target);
        parent && parent.insertBefore(to, target);
        // 移除显示
        parent && parent.removeChild(target);
        // 返回备忘录
        return { parent: parent, from: from, to: to, handler: handler };
    };
    /**
     * 为列表显示对象赋值
     *
     * @param {HTMLElement} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    DOMBridge.prototype.valuateBindFor = function (target, datas, memento) {
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
            var newElement = target.cloneNode(true);
            // 拷贝子孙对象引用
            copyRef(newElement, newElement);
            // 添加显示
            parent && parent.insertBefore(newElement, memento.to);
            // 使用cloneNode方法复制渲染器
            memento.handler(key, datas[key], newElement);
        }
    };
    /** 提供静态类型常量 */
    DOMBridge.TYPE = "DOM";
    return DOMBridge;
}());
export default DOMBridge;
