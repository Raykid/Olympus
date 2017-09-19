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