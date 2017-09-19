define("trunk/view/bridge/IBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path="./egret-core/build/egret/egret.d.ts"/>
define("branches/egret/Bridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * Egret的表现层桥实现
    */
    var Bridge = /** @class */ (function () {
        function Bridge() {
        }
        Object.defineProperty(Bridge.prototype, "type", {
            /**
             * 获取表现层类型名称
             *
             * @readonly
             * @type {string}
             * @memberof Bridge
             */
            get: function () {
                return "Egret";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bridge.prototype, "htmlWrapper", {
            /**
             * 获取表现层HTML包装器，可以对其样式进行自定义调整
             *
             * @readonly
             * @type {HTMLElement}
             * @memberof Bridge
             */
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bridge.prototype, "root", {
            /**
             * 获取根显示节点
             *
             * @readonly
             * @type {egret.DisplayObjectContainer}
             * @memberof Bridge
             */
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化表现层桥
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof Bridge
         */
        Bridge.prototype.init = function (complete) {
            complete(this);
        };
        /**
         * 判断皮肤是否是Egret显示对象
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是Egret显示对象
         * @memberof Bridge
         */
        Bridge.prototype.isMySkin = function (skin) {
            return (skin instanceof egret.DisplayObject);
        };
        /**
         * 添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.addChild = function (parent, target) {
            return parent.addChild(target);
        };
        /**
         * 按索引添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.addChildAt = function (parent, target, index) {
            return parent.addChildAt(target, index);
        };
        /**
         * 移除显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 被移除的显示对象
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.removeChild = function (parent, target) {
            return parent.removeChild(target);
        };
        /**
         * 按索引移除显示
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 索引
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.removeChildAt = function (parent, index) {
            return parent.removeChildAt(index);
        };
        /**
         * 移除所有显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @memberof Bridge
         */
        Bridge.prototype.removeChildren = function (parent) {
            parent.removeChildren();
        };
        /**
         * 获取指定索引处的显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 指定父级索引
         * @return {egret.DisplayObject} 索引处的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.getChildAt = function (parent, index) {
            return parent.getChildAt(index);
        };
        /**
         * 获取显示索引
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof Bridge
         */
        Bridge.prototype.getChildIndex = function (parent, target) {
            return parent.getChildIndex(target);
        };
        /**
         * 通过名称获取显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {string} name 对象名称
         * @return {egret.DisplayObject} 显示对象
         * @memberof Bridge
         */
        Bridge.prototype.getChildByName = function (parent, name) {
            return parent.getChildByName(name);
        };
        /**
         * 获取子显示对象数量
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof Bridge
         */
        Bridge.prototype.getChildCount = function (parent) {
            return parent.numChildren;
        };
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        Bridge.prototype.mapListener = function (target, type, handler, thisArg) {
            target.addEventListener(type, handler, thisArg);
        };
        /**
         * 注销监听事件
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        Bridge.prototype.unmapListener = function (target, type, handler, thisArg) {
            target.removeEventListener(type, handler, thisArg);
        };
        return Bridge;
    }());
    exports.default = Bridge;
});
//# sourceMappingURL=Egret.js.map