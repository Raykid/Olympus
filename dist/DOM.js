define("trunk/view/bridge/IBridge", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 对象工具集
*/
define("trunk/utils/ObjectUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    function extendObject(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) {
            if (!source)
                return;
            for (var propName in source) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            }
        });
        return target;
    }
    exports.extendObject = extendObject;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    function cloneObject(target, deep) {
        if (deep === void 0) { deep = false; }
        if (target == null)
            return null;
        var newObject = {};
        for (var key in target) {
            var value = target[key];
            if (deep && typeof value == "object") {
                // 如果是深表复制，则需要递归复制子对象
                value = cloneObject(value, true);
            }
            newObject[key] = value;
        }
        return newObject;
    }
    exports.cloneObject = cloneObject;
    /**
     * 生成一个随机ID
     */
    function getGUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }
    exports.getGUID = getGUID;
    var _getAutoIncIdMap = {};
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    function getAutoIncId(type) {
        var index = _getAutoIncIdMap[type] || 0;
        _getAutoIncIdMap[type] = index++;
        return type + "-" + index;
    }
    exports.getAutoIncId = getAutoIncId;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    function isEmpty(obj) {
        var result = true;
        for (var key in obj) {
            result = false;
            break;
        }
        return result;
    }
    exports.isEmpty = isEmpty;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    function trimData(data) {
        for (var key in data) {
            if (data[key] == null) {
                delete data[key];
            }
        }
        return data;
    }
    exports.trimData = trimData;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    exports.extendsClass = (function () {
        var extendStatics = Object["setPrototypeOf"] ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var hash = 0;
    var hashTypes = ["object", "function"];
    /**
     * 获取一个对象的对象哈希字符串
     *
     * @export
     * @param {*} target 任意对象，可以是基础类型或null
     * @returns {string} 哈希值
     */
    function getObjectHash(target) {
        if (target == null)
            return "__object_hash_0__";
        var key = "__object_hash__";
        var value = target[key];
        // 如果已经有哈希值则直接返回
        if (value)
            return value;
        // 如果是基础类型则直接返回对应字符串
        var type = typeof target;
        if (hashTypes.indexOf(type) < 0)
            return type + ":" + target;
        // 如果是复杂类型则返回计算的哈希值并打上标签
        return (target[key] = "__object_hash_" + (++hash) + "__");
    }
    exports.getObjectHash = getObjectHash;
    /**
     * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
     *
     * @export
     * @param {...any[]} targets 希望获取哈希值的对象列表
     * @returns {string} 多个对象共同作用下的哈希值
     */
    function getObjectHashs() {
        var targets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targets[_i] = arguments[_i];
        }
        var values = targets.map(function (target) { return getObjectHash(target); });
        return values.join("|");
    }
    exports.getObjectHashs = getObjectHashs;
});
define("branches/dom/Bridge", ["require", "exports", "trunk/utils/ObjectUtil"], function (require, exports, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 基于DOM的表现层桥实现
    */
    var Bridge = /** @class */ (function () {
        function Bridge(root) {
            this._listenerDict = {};
            this._root = root;
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
                return "DOM";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bridge.prototype, "root", {
            /**
             * 获取根显示节点
             *
             * @readonly
             * @type {HTMLElement}
             * @memberof Bridge
             */
            get: function () {
                return this._root;
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
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof Bridge
         */
        Bridge.prototype.init = function (complete) {
            // 如果是名称，则转变成引用
            if (typeof this._root == "string") {
                this._root = document.getElementById(this._root);
            }
            // 如果是空，则生成一个
            if (!this._root) {
                this._root = document.createElement("div");
                document.body.appendChild(this._root);
            }
            // 调用回调
            complete(this);
        };
        /**
         * 判断皮肤是否是DOM显示节点
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是DOM显示节点
         * @memberof Bridge
         */
        Bridge.prototype.isMySkin = function (skin) {
            return (skin instanceof HTMLElement);
        };
        /**
         * 添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @return {Element} 返回被添加的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.addChild = function (parent, target) {
            return parent.appendChild(target);
        };
        /**
         * 按索引添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {Element} 返回被添加的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.addChildAt = function (parent, target, index) {
            return parent.insertBefore(target, this.getChildAt(parent, index));
        };
        /**
         * 移除显示对象
         *
         * @param {Element} parent 父容器
         * @param {Element} target 被移除的显示对象
         * @return {Element} 返回被移除的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.removeChild = function (parent, target) {
            return parent.removeChild(target);
        };
        /**
         * 按索引移除显示
         *
         * @param {Element} parent 父容器
         * @param {number} index 索引
         * @return {Element} 返回被移除的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.removeChildAt = function (parent, index) {
            return parent.removeChild(this.getChildAt(parent, index));
        };
        /**
         * 移除所有显示对象
         *
         * @param {Element} parent 父容器
         * @memberof Bridge
         */
        Bridge.prototype.removeChildren = function (parent) {
            for (var i = 0, len = parent.children.length; i < len; i++) {
                parent.removeChild(parent.children.item(i));
            }
        };
        /**
         * 获取指定索引处的显示对象
         *
         * @param {Element} parent 父容器
         * @param {number} index 指定父级索引
         * @return {Element} 索引处的显示对象
         * @memberof Bridge
         */
        Bridge.prototype.getChildAt = function (parent, index) {
            return parent.children.item(index);
        };
        /**
         * 获取显示索引
         *
         * @param {Element} parent 父容器
         * @param {Element} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof Bridge
         */
        Bridge.prototype.getChildIndex = function (parent, target) {
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
         * @memberof Bridge
         */
        Bridge.prototype.getChildByName = function (parent, name) {
            return parent.children.namedItem(name);
        };
        /**
         * 获取子显示对象数量
         *
         * @param {Element} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof Bridge
         */
        Bridge.prototype.getChildCount = function (parent) {
            return parent.childElementCount;
        };
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        Bridge.prototype.mapListener = function (target, type, handler, thisArg) {
            var key = ObjectUtil_1.getObjectHashs(target, type, handler, thisArg);
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
         * @memberof Bridge
         */
        Bridge.prototype.unmapListener = function (target, type, handler, thisArg) {
            var key = ObjectUtil_1.getObjectHashs(target, type, handler, thisArg);
            // 判断是否已经存在该监听，如果存在则移除监听
            var listener = this._listenerDict[key];
            if (listener) {
                target.removeEventListener(type, listener);
                // 移除记录
                delete this._listenerDict[key];
            }
        };
        return Bridge;
    }());
    exports.default = Bridge;
});
//# sourceMappingURL=DOM.js.map