define("dom/mask/MaskEntity", ["require", "exports", "engine/bridge/BridgeManager", "DOMBridge"], function (require, exports, BridgeManager_1, DOMBridge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * DOM遮罩实现
    */
    var MaskEntityImpl = /** @class */ (function () {
        function MaskEntityImpl(params) {
            this._showing = false;
            if (params) {
                if (typeof params.loadingSkin == "string") {
                    var temp = document.createElement("div");
                    temp.innerHTML = params.loadingSkin;
                    params.loadingSkin = temp;
                }
                this.loadingSkin = params.loadingSkin;
            }
            this.maskData = params || {};
        }
        /**
         * 显示遮罩
         */
        MaskEntityImpl.prototype.showMask = function (alpha) {
            // DOM框架不需要遮罩，全部依赖CSS实现
        };
        /**
         * 隐藏遮罩
         */
        MaskEntityImpl.prototype.hideMask = function () {
            // DOM框架不需要遮罩，全部依赖CSS实现
        };
        /**当前是否在显示遮罩*/
        MaskEntityImpl.prototype.isShowingMask = function () {
            // DOM框架不需要遮罩，全部依赖CSS实现
            return false;
        };
        /**
         * 显示加载图
         */
        MaskEntityImpl.prototype.showLoading = function (alpha) {
            if (this.loadingSkin == null || this._showing)
                return;
            this._showing = true;
            // 显示
            var bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE);
            bridge.addChild(bridge.maskLayer, this.loadingSkin);
        };
        /**
         * 隐藏加载图
         */
        MaskEntityImpl.prototype.hideLoading = function () {
            if (this.loadingSkin == null || !this._showing)
                return;
            this._showing = false;
            // 隐藏
            var bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE);
            bridge.removeChild(bridge.maskLayer, this.loadingSkin);
        };
        /**当前是否在显示loading*/
        MaskEntityImpl.prototype.isShowingLoading = function () {
            return this._showing;
        };
        /** 显示模态窗口遮罩 */
        MaskEntityImpl.prototype.showModalMask = function (panel, alpha) {
            // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
        };
        /** 隐藏模态窗口遮罩 */
        MaskEntityImpl.prototype.hideModalMask = function (panel) {
            // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
        };
        /** 当前是否在显示模态窗口遮罩 */
        MaskEntityImpl.prototype.isShowingModalMask = function (panel) {
            // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
            return false;
        };
        return MaskEntityImpl;
    }());
    exports.default = MaskEntityImpl;
});
define("dom/utils/SkinUtil", ["require", "exports", "engine/assets/AssetsManager"], function (require, exports, AssetsManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-26
     * @modify date 2017-10-26
     *
     * 为DOM提供皮肤转换的工具集
    */
    /**
     * 为中介者包装皮肤
     *
     * @export
     * @param {IMediator} mediator 中介者
     * @param {(HTMLElement|string|string[])} skin 皮肤，可以是HTMLElement，也可以是皮肤字符串，也可以是皮肤模板地址或地址数组
     * @returns {HTMLElement} 皮肤的HTMLElement形式，可能会稍后再填充内容，如果想在皮肤加载完毕后再拿到皮肤请使用complete参数
     */
    function wrapSkin(mediator, skin) {
        var result;
        if (skin instanceof HTMLElement) {
            result = skin;
        }
        else {
            // 生成一个临时的div
            result = document.createElement("div");
            // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
            var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
            mediator.onOpen = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (skin instanceof Array) {
                    // 是数组，将所有内容连接起来再一起赋值
                    skin = skin.map(getContent).join("");
                }
                // 赋值皮肤内容
                result.innerHTML = skin;
                // 拷贝引用
                doCopyRef(result, skin, mediator);
                // 恢复原始方法
                if (oriFunc)
                    mediator.onOpen = oriFunc;
                else
                    delete mediator.onOpen;
                // 调用原始方法
                mediator.onOpen.apply(this, args);
            };
        }
        // 赋值皮肤
        mediator.skin = result;
        // 同步返回皮肤
        return result;
    }
    exports.wrapSkin = wrapSkin;
    /**
     * 将from中的所有拥有id属性的节点引用复制到to对象上
     *
     * @export
     * @param {HTMLElement} from 复制源DOM节点
     * @param {*} to 复制目标对象
     */
    function copyRef(from, to) {
        doCopyRef(from, from.innerHTML, to);
    }
    exports.copyRef = copyRef;
    function doCopyRef(fromEle, fromStr, to) {
        // 使用正则表达式将拥有id的节点赋值给mediator
        var reg = /id=("([^"]+)"|'([^']+)')/g;
        var res;
        while (res = reg.exec(fromStr)) {
            var id = res[2] || res[3];
            to[id] = fromEle.querySelector("#" + id);
        }
    }
    function getContent(skin) {
        if (skin.indexOf("<") >= 0 && skin.indexOf(">") >= 0) {
            // 是皮肤字符串，直接返回
            return skin;
        }
        else {
            // 是皮肤路径或路径短名称，获取后返回
            return AssetsManager_1.assetsManager.getAssets(skin);
        }
    }
});
define("dom/injector/Injector", ["require", "exports", "utils/ConstructUtil", "engine/injector/Injector", "engine/bridge/BridgeManager", "dom/utils/SkinUtil", "DOMBridge"], function (require, exports, ConstructUtil_1, Injector_1, BridgeManager_2, SkinUtil_1, DOMBridge_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DOMMediatorClass() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof Function) {
            // 调用MediatorClass方法
            var cls = Injector_1.MediatorClass(args[0]);
            // 监听类型实例化，赋值表现层桥
            ConstructUtil_1.listenConstruct(cls, function (mediator) { return mediator.bridge = BridgeManager_2.bridgeManager.getBridge(DOMBridge_2.default.TYPE); });
            // 返回结果类型
            return cls;
        }
        else {
            return function (cls) {
                // 调用MediatorClass方法
                cls = Injector_1.MediatorClass(cls);
                // 监听类型实例化，转换皮肤格式
                ConstructUtil_1.listenConstruct(cls, function (mediator) { return SkinUtil_1.wrapSkin(mediator, args); });
                // 返回结果类型
                return cls;
            };
        }
    }
    exports.DOMMediatorClass = DOMMediatorClass;
});
/// <amd-module name="DOMBridge"/>
/// <reference path="../../../trunk/dist/Olympus.d.ts"/>
define("DOMBridge", ["require", "exports", "utils/ObjectUtil", "engine/assets/AssetsManager", "dom/mask/MaskEntity", "dom/utils/SkinUtil"], function (require, exports, ObjectUtil_1, AssetsManager_2, MaskEntity_1, SkinUtil_2) {
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
    var DOMBridge = /** @class */ (function () {
        function DOMBridge(params) {
            /**
             * 获取默认弹窗策略
             *
             * @type {IPanelPolicy}
             * @memberof EgretBridge
             */
            this.defaultPanelPolicy = null;
            /**
             * 获取默认场景切换策略
             *
             * @type {IScenePolicy}
             * @memberof EgretBridge
             */
            this.defaultScenePolicy = null;
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
        Object.defineProperty(DOMBridge.prototype, "htmlWrapper", {
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
        Object.defineProperty(DOMBridge.prototype, "stage", {
            /**
             * 获取舞台引用，DOM的舞台指向root所在的Document对象
             *
             * @readonly
             * @type {Document}
             * @memberof DOMBridge
             */
            get: function () {
                return this.root.ownerDocument;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DOMBridge.prototype, "bgLayer", {
            /**
             * 获取背景容器
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
        Object.defineProperty(DOMBridge.prototype, "sceneLayer", {
            /**
             * 获取场景容器
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
        Object.defineProperty(DOMBridge.prototype, "frameLayer", {
            /**
             * 获取框架容器
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
        Object.defineProperty(DOMBridge.prototype, "panelLayer", {
            /**
             * 获取弹窗容器
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
        Object.defineProperty(DOMBridge.prototype, "maskLayer", {
            /**
             * 获取遮罩容器
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
        Object.defineProperty(DOMBridge.prototype, "topLayer", {
            /**
             * 获取顶级容器
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
        Object.defineProperty(DOMBridge.prototype, "promptClass", {
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
        Object.defineProperty(DOMBridge.prototype, "maskEntity", {
            /**
             * 获取遮罩实体
             *
             * @readonly
             * @type {IMaskEntity}
             * @memberof DOMBridge
             */
            get: function () {
                return new MaskEntity_1.default(this._initParams.maskData);
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
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是DOM显示节点
         * @memberof DOMBridge
         */
        DOMBridge.prototype.isMySkin = function (skin) {
            return (skin instanceof HTMLElement);
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
            return parent.removeChild(target);
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
            return parent.removeChild(this.getChildAt(parent, index));
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
         * 加载资源
         *
         * @param {string[]} assets 资源数组
         * @param {IMediator} mediator 资源列表
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof DOMBridge
         */
        DOMBridge.prototype.loadAssets = function (assets, mediator, handler) {
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
                    AssetsManager_2.assetsManager.loadAssets(skin, function (result) {
                        if (result instanceof Error)
                            handler(result);
                        else
                            loadNext();
                    });
                }
            }
        };
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof DOMBridge
         */
        DOMBridge.prototype.mapListener = function (target, type, handler, thisArg) {
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
         * @memberof DOMBridge
         */
        DOMBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
            var key = ObjectUtil_1.getObjectHashs(target, type, handler, thisArg);
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
                SkinUtil_2.copyRef(newElement, newElement);
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
    exports.default = DOMBridge;
});
//# sourceMappingURL=DOM.js.map