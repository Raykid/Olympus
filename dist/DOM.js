var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("egret/RenderMode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 渲染模式枚举
    */
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["AUTO"] = 0] = "AUTO";
        RenderMode[RenderMode["CANVAS"] = 1] = "CANVAS";
        RenderMode[RenderMode["WEBGL"] = 2] = "WEBGL";
    })(RenderMode || (RenderMode = {}));
    exports.default = RenderMode;
});
define("egret/AssetsLoader", ["require", "exports", "engine/env/Environment", "engine/version/Version", "engine/panel/PanelManager", "engine/platform/PlatformManager"], function (require, exports, Environment_1, Version_1, PanelManager_1, PlatformManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourceVersionController = /** @class */ (function (_super) {
        __extends(ResourceVersionController, _super);
        function ResourceVersionController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResourceVersionController.prototype.getVirtualUrl = function (url) {
            // 添加imgDomain
            url = Environment_1.environment.toCDNHostURL(url);
            // 添加版本号，有哈希值就用哈希值加载，没有就用编译版本号加载
            url = Version_1.version.wrapHashUrl(url);
            // 返回url
            return url;
        };
        return ResourceVersionController;
    }(RES.VersionController));
    exports.ResourceVersionController = ResourceVersionController;
    // 这里直接注册一下
    RES.registerVersionController(new ResourceVersionController());
    var AssetsLoader = /** @class */ (function () {
        function AssetsLoader(handler) {
            this._retryDict = {};
            this._handler = handler;
        }
        AssetsLoader.prototype.loadGroups = function (groups) {
            // 调用回调
            this._handler.start && this._handler.start();
            // 开始加载
            var groupDict = {};
            var pgsDict;
            var len = groups ? groups.length : 0;
            if (len == 0) {
                this._handler.complete && this._handler.complete(groupDict);
            }
            else {
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, onProgress, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, onOneComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, onOneError, this);
                groups = groups.concat();
                pgsDict = {};
                for (var i in groups) {
                    var group = groups[i];
                    if (typeof group == "string") {
                        pgsDict[group] = 0;
                        RES.loadGroup(group);
                    }
                    else {
                        pgsDict[group.name] = 0;
                        RES.loadGroup(group.name, group.priority);
                    }
                }
            }
            function onProgress(evt) {
                // 填充资源字典
                var itemDict = groupDict[evt.groupName];
                if (!itemDict)
                    groupDict[evt.groupName] = itemDict = {};
                itemDict[evt.resItem.name] = evt.resItem;
                // 计算总进度
                pgsDict[evt.groupName] = evt.itemsLoaded / evt.itemsTotal;
                var pgs = 0;
                for (var key in pgsDict) {
                    pgs += pgsDict[key];
                }
                pgs /= len;
                // 回调
                this._handler.progress && this._handler.progress(evt.resItem, pgs);
            }
            function onOneComplete(evt) {
                // 调用单一完毕回调
                this._handler.oneComplete && this._handler.oneComplete(groupDict[evt.groupName]);
                // 测试是否全部完毕
                var index = groups.indexOf(evt.groupName);
                if (index >= 0) {
                    // 移除加载组名
                    groups.splice(index, 1);
                    // 判断是否全部完成
                    if (groups.length == 0) {
                        // 移除事件监听
                        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, onProgress, this);
                        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, onOneComplete, this);
                        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, onOneError, this);
                        // 调用回调
                        this._handler.complete && this._handler.complete(groupDict);
                    }
                }
            }
            function onOneError(evt) {
                var groupName = evt.groupName;
                var retryTimes = this._retryDict[groupName];
                if (retryTimes == null)
                    retryTimes = 0;
                if (retryTimes < 3) {
                    this._retryDict[groupName] = ++retryTimes;
                    // 打印日志
                    console.warn("加载失败，重试第" + retryTimes + "次: " + groupName);
                    // 没到最大重试次数，将为url添加一个随机时间戳重新加回加载队列
                    RES.loadGroup(evt.groupName);
                }
                else {
                    // 打印日志
                    console.warn("加载失败3次，正在尝试切换CDN...");
                    // 尝试切换CDN
                    var allDone = Environment_1.environment.nextCDN();
                    if (!allDone) {
                        // 重新加载
                        RES.loadGroup(evt.groupName);
                    }
                    else {
                        // 调用模板方法
                        this._handler.oneError && this._handler.oneError(evt);
                        // 切换CDN失败了，弹出提示，使用户可以手动刷新页面
                        PanelManager_1.panelManager.confirm("资源组加载失败[" + groupName + "]，点击确定刷新页面", function () {
                            PlatformManager_1.platformManager.reload();
                        });
                    }
                }
            }
        };
        return AssetsLoader;
    }());
    exports.default = AssetsLoader;
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * Egret缓动工具集，用来弥补Egret的Tween的不足
*/
define("egret/utils/TweenUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tweenTo(target, props, duration, ease) {
        return egret.Tween.get(target).to(props, duration, ease);
    }
    exports.tweenTo = tweenTo;
    function tweenFrom(target, props, duration, ease) {
        // 对换参数状态
        var toProps = {};
        for (var key in props) {
            toProps[key] = target[key];
            target[key] = props[key];
        }
        // 开始缓动
        return egret.Tween.get(target).to(toProps, duration, ease);
    }
    exports.tweenFrom = tweenFrom;
});
define("egret/panel/BackPanelPolicy", ["require", "exports", "egret/utils/TweenUtil"], function (require, exports, TweenUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * 回弹效果
    */
    var BackPanelPolicy = /** @class */ (function () {
        function BackPanelPolicy() {
        }
        /**
         * 显示时调用
         * @param panel 弹出框对象
         * @param callback 完成回调，必须调用
         * @param from 动画起始点
         */
        BackPanelPolicy.prototype.pop = function (panel, callback, from) {
            // 开始动画弹出
            var entity = panel.skin;
            egret.Tween.removeTweens(entity);
            // 恢复体积
            entity.scaleX = 1;
            entity.scaleY = 1;
            var fromX = 0;
            var fromY = 0;
            if (from != null) {
                fromX = from.x;
                fromY = from.y;
            }
            else {
                fromX = entity.stage.stageWidth * 0.5;
                fromY = entity.stage.stageHeight * 0.5;
            }
            // 更新弹出后位置
            entity.x = fromX - entity.width * 0.5;
            entity.y = fromY - entity.height * 0.5;
            // 开始缓动
            TweenUtil_1.tweenFrom(entity, {
                x: fromX,
                y: fromY,
                scaleX: 0,
                scaleY: 0
            }, 300, egret.Ease.backOut).call(callback);
        };
        /**
         * 关闭时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param to 动画完结点
         */
        BackPanelPolicy.prototype.drop = function (panel, callback, to) {
            // 开始动画关闭
            var entity = panel.skin;
            egret.Tween.removeTweens(entity);
            var toX = 0;
            var toY = 0;
            if (to != null) {
                toX = to.x;
                toY = to.y;
            }
            else {
                toX = entity.x + entity.width * 0.5;
                toY = entity.y + entity.height * 0.5;
            }
            TweenUtil_1.tweenTo(entity, {
                x: toX,
                y: toY,
                scaleX: 0,
                scaleY: 0
            }, 300, egret.Ease.backIn).call(function () {
                // 恢复体积
                entity.scaleX = 1;
                entity.scaleY = 1;
                if (callback != null)
                    callback();
            });
        };
        return BackPanelPolicy;
    }());
    exports.default = BackPanelPolicy;
});
define("egret/scene/FadeScenePolicy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * 淡入淡出场景切换策略
    */
    var FadeScenePolicy = /** @class */ (function () {
        function FadeScenePolicy() {
            this._tempSnapshot = new egret.Bitmap();
        }
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        FadeScenePolicy.prototype.prepareSwitch = function (from, to) {
            if (from != null) {
                var root = from.bridge.root;
                // 截取当前屏幕
                var texture = new egret.RenderTexture();
                texture.drawToTexture(root);
                this._tempSnapshot.texture = texture;
                this._tempSnapshot.alpha = 1;
                root.addChild(this._tempSnapshot);
                // 移除from
                var fromDisplay = from.skin;
                if (fromDisplay.parent != null) {
                    fromDisplay.parent.removeChild(fromDisplay);
                }
            }
        };
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        FadeScenePolicy.prototype.switch = function (from, to, callback) {
            if (from != null) {
                // 开始淡出
                egret.Tween.removeTweens(this._tempSnapshot);
                egret.Tween.get(this._tempSnapshot).to({
                    alpha: 0
                }, 300).call(function () {
                    // 移除截屏
                    if (this._tempSnapshot.parent != null) {
                        this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                    }
                    // 回收资源
                    if (this._tempSnapshot.texture != null) {
                        this._tempSnapshot.texture.dispose();
                        this._tempSnapshot.texture = null;
                    }
                    // 调用回调
                    callback();
                }, this);
            }
            else {
                // 移除截屏
                if (this._tempSnapshot.parent != null) {
                    this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                }
                // 调用回调
                callback();
            }
        };
        return FadeScenePolicy;
    }());
    exports.default = FadeScenePolicy;
});
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-17
 * @modify date 2017-10-17
 *
 * UI工具集
*/
define("egret/utils/UIUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 包装EUI的DataGroup组件，使用传入的处理函数处理每个渲染器更新的逻辑
     *
     * @export
     * @param {eui.DataGroup} group 被包装的DataGroup组件
     * @param {(data?:any, renderer?:any)=>void} rendererHandler 渲染器处理函数，每次数据更新时会被调用
     */
    function wrapEUIList(group, rendererHandler) {
        group.itemRenderer = ItemRenderer.bind(null, group.itemRendererSkinName, rendererHandler);
    }
    exports.wrapEUIList = wrapEUIList;
    var ItemRenderer = /** @class */ (function (_super) {
        __extends(ItemRenderer, _super);
        function ItemRenderer(skinName, rendererHandler) {
            var _this = _super.call(this) || this;
            _this.skinName = skinName;
            _this._rendererHandler = rendererHandler;
            return _this;
        }
        ItemRenderer.prototype.dataChanged = function () {
            _super.prototype.dataChanged.call(this);
            this._rendererHandler(this.data, this);
        };
        return ItemRenderer;
    }(eui.ItemRenderer));
});
define("egret/mask/MaskEntity", ["require", "exports", "engine/bridge/BridgeManager", "DOMBridge", "utils/Dictionary"], function (require, exports, BridgeManager_1, DOMBridge_1, Dictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * Egret遮罩实现
    */
    var MaskEntityImpl = /** @class */ (function () {
        function MaskEntityImpl(params) {
            this._showingMask = false;
            this._showingLoading = false;
            if (params != null) {
                this._maskAlpha = (params.maskAlpha != null ? params.maskAlpha : 0.5);
                this._loadingAlpha = (params.loadingAlpha != null ? params.loadingAlpha : 0.5);
                this._modalPanelAlpha = (params.modalPanelAlpha != null ? params.modalPanelAlpha : 0.5);
                this._skin = params.skin;
            }
            this._mask = new egret.Shape();
            this._mask.touchEnabled = true;
            this._loadingMask = new egret.Shape();
            this._loadingMask.touchEnabled = true;
            this._modalPanelDict = new Dictionary_1.default();
            this._modalPanelList = [];
            this._modalPanelMask = new egret.Shape();
            this._modalPanelMask.touchEnabled = true;
        }
        /**
         * 显示遮罩
         */
        MaskEntityImpl.prototype.showMask = function (alpha) {
            if (this._showingMask)
                return;
            this._showingMask = true;
            // 显示
            var bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE);
            // 绘制遮罩
            if (alpha == null)
                alpha = this._maskAlpha;
            this._mask.graphics.clear();
            this._mask.graphics.beginFill(0, alpha);
            this._mask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
            this._mask.graphics.endFill();
            // 添加显示
            bridge.maskLayer.addChild(this._mask);
        };
        /**
         * 隐藏遮罩
         */
        MaskEntityImpl.prototype.hideMask = function () {
            if (!this._showingMask)
                return;
            this._showingMask = false;
            // 隐藏
            if (this._mask.parent != null)
                this._mask.parent.removeChild(this._mask);
        };
        /**当前是否在显示遮罩*/
        MaskEntityImpl.prototype.isShowingMask = function () {
            return this._showingMask;
        };
        /**
         * 显示加载图
         */
        MaskEntityImpl.prototype.showLoading = function (alpha) {
            if (this._showingLoading)
                return;
            this._showingLoading = true;
            // 显示
            var bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE);
            // 绘制遮罩
            if (alpha == null)
                alpha = this._loadingAlpha;
            this._loadingMask.graphics.clear();
            this._loadingMask.graphics.beginFill(0, alpha);
            this._loadingMask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
            this._loadingMask.graphics.endFill();
            // 添加显示
            bridge.maskLayer.addChild(this._loadingMask);
            if (this._skin != null)
                bridge.maskLayer.addChild(this._skin);
        };
        /**
         * 隐藏加载图
         */
        MaskEntityImpl.prototype.hideLoading = function () {
            if (!this._showingLoading)
                return;
            this._showingLoading = false;
            // 隐藏
            if (this._loadingMask.parent != null)
                this._loadingMask.parent.removeChild(this._loadingMask);
            if (this._skin != null && this._skin.parent != null)
                this._skin.parent.removeChild(this._skin);
        };
        /**当前是否在显示loading*/
        MaskEntityImpl.prototype.isShowingLoading = function () {
            return this._showingLoading;
        };
        /** 显示模态窗口遮罩 */
        MaskEntityImpl.prototype.showModalMask = function (panel, alpha) {
            if (this.isShowingModalMask(panel))
                return;
            this._modalPanelDict.set(panel, panel);
            this._modalPanelList.push(panel);
            // 显示
            var bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE);
            // 绘制遮罩
            if (alpha == null)
                alpha = this._modalPanelAlpha;
            this._modalPanelMask.graphics.clear();
            this._modalPanelMask.graphics.beginFill(0, alpha);
            this._modalPanelMask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
            this._modalPanelMask.graphics.endFill();
            // 添加显示
            var entity = panel.skin;
            var parent = entity.parent;
            if (parent != null) {
                if (this._modalPanelMask.parent) {
                    this._modalPanelMask.parent.removeChild(this._modalPanelMask);
                }
                var index = parent.getChildIndex(entity);
                parent.addChildAt(this._modalPanelMask, index);
            }
        };
        /** 隐藏模态窗口遮罩 */
        MaskEntityImpl.prototype.hideModalMask = function (panel) {
            if (!this.isShowingModalMask(panel))
                return;
            this._modalPanelDict.delete(panel);
            this._modalPanelList.splice(this._modalPanelList.indexOf(panel), 1);
            // 判断是否还需要Mask
            if (this._modalPanelList.length <= 0) {
                // 隐藏
                if (this._modalPanelMask.parent != null)
                    this._modalPanelMask.parent.removeChild(this._modalPanelMask);
            }
            else {
                // 移动Mask
                var entity = this._modalPanelList[this._modalPanelList.length - 1].skin;
                var parent = entity.parent;
                if (parent != null) {
                    if (this._modalPanelMask.parent) {
                        this._modalPanelMask.parent.removeChild(this._modalPanelMask);
                    }
                    var index = parent.getChildIndex(entity);
                    parent.addChildAt(this._modalPanelMask, index);
                }
            }
        };
        /** 当前是否在显示模态窗口遮罩 */
        MaskEntityImpl.prototype.isShowingModalMask = function (panel) {
            return (this._modalPanelDict.get(panel) != null);
        };
        return MaskEntityImpl;
    }());
    exports.default = MaskEntityImpl;
});
/// <reference path="./egret/egret-libs/egret/egret.d.ts"/>
/// <reference path="./egret/egret-libs/eui/eui.d.ts"/>
/// <reference path="./egret/egret-libs/res/res.d.ts"/>
/// <reference path="./egret/egret-libs/tween/tween.d.ts"/>
/// <reference path="../../dist/Olympus.d.ts"/>
define("EgretBridge", ["require", "exports", "core/Core", "engine/module/ModuleMessage", "egret/RenderMode", "egret/AssetsLoader", "egret/panel/BackPanelPolicy", "egret/scene/FadeScenePolicy", "egret/mask/MaskEntity"], function (require, exports, Core_1, ModuleMessage_1, RenderMode_1, AssetsLoader_1, BackPanelPolicy_1, FadeScenePolicy_1, MaskEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * Egret的表现层桥实现，当前Egret版本：5.0.7
    */
    var EgretBridge = /** @class */ (function () {
        function EgretBridge(params) {
            /**
             * 默认弹窗策略
             *
             * @type {IPanelPolicy}
             * @memberof EgretBridge
             */
            this.defaultPanelPolicy = new BackPanelPolicy_1.default();
            /**
             * 默认场景切换策略
             *
             * @type {IScenePolicy}
             * @memberof EgretBridge
             */
            this.defaultScenePolicy = new FadeScenePolicy_1.default();
            this._initParams = params;
        }
        Object.defineProperty(EgretBridge.prototype, "type", {
            /**
             * 获取表现层类型名称
             *
             * @readonly
             * @type {string}
             * @memberof EgretBridge
             */
            get: function () {
                return EgretBridge.TYPE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretBridge.prototype, "htmlWrapper", {
            /**
             * 获取表现层HTML包装器，可以对其样式进行自定义调整
             *
             * @readonly
             * @type {HTMLElement}
             * @memberof EgretBridge
             */
            get: function () {
                return this._initParams.container;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretBridge.prototype, "root", {
            /**
             * 获取根显示节点
             *
             * @readonly
             * @type {egret.DisplayObjectContainer}
             * @memberof EgretBridge
             */
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretBridge.prototype, "bgLayer", {
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
        Object.defineProperty(EgretBridge.prototype, "sceneLayer", {
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
        Object.defineProperty(EgretBridge.prototype, "panelLayer", {
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
        Object.defineProperty(EgretBridge.prototype, "maskLayer", {
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
        Object.defineProperty(EgretBridge.prototype, "topLayer", {
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
        Object.defineProperty(EgretBridge.prototype, "promptClass", {
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
        Object.defineProperty(EgretBridge.prototype, "maskEntity", {
            /**
             * 获取遮罩实体
             *
             * @readonly
             * @type {IMaskEntity}
             * @memberof EgretBridge
             */
            get: function () {
                return new MaskEntity_1.default(this._initParams.maskData);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化表现层桥
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof EgretBridge
         */
        EgretBridge.prototype.init = function (complete) {
            // 生成html和body的样式节点
            var style = document.createElement("style");
            style.textContent = "\n            html, body {\n                -ms-touch-action: none;\n                background: " + egret.toColorString(this._initParams.backgroundColor || 0) + ";\n                padding: 0;\n                border: 0;\n                margin: 0;\n                height: 100%;\n            }\n        ";
            document.head.appendChild(style);
            // 统一容器
            if (typeof this._initParams.container == "string") {
                this._initParams.container = document.querySelector(this._initParams.container);
            }
            if (!this._initParams.container) {
                this._initParams.container = document.createElement("div");
                document.body.appendChild(this._initParams.container);
            }
            var container = this._initParams.container;
            // 构建容器参数
            container.style.margin = "auto";
            container.style.width = "100%";
            container.style.height = "100%";
            container.className = "egret-player";
            container.setAttribute("data-entry-class", "__EgretRoot__");
            container.setAttribute("data-orientation", "auto");
            container.setAttribute("data-scale-mode", this._initParams.scaleMode || egret.StageScaleMode.FIXED_NARROW);
            container.setAttribute("data-frame-rate", (this._initParams.frameRate || 60) + "");
            container.setAttribute("data-content-width", this._initParams.width + "");
            container.setAttribute("data-content-height", this._initParams.height + "");
            container.setAttribute("data-show-paint-rect", (this._initParams.showPaintRect || false) + "");
            container.setAttribute("data-multi-fingered", (this._initParams.multiFingered || 2) + "");
            container.setAttribute("data-show-fps", (this._initParams.showFPS || false) + "");
            container.setAttribute("data-show-fps-style", this._initParams.showFPSStyle || "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9");
            container.setAttribute("data-show-log", (this._initParams.showLog || false) + "");
            // 构建__EgretRoot__类，使得Egret引擎可以通过window寻址的方式找到该类，同时又可以让其将控制权转交给Application
            var self = this;
            window["__EgretRoot__"] = function () {
                egret.Sprite.call(this);
            };
            window["__EgretRoot__"].prototype = new egret.Sprite();
            window["__EgretRoot__"].prototype.$onAddToStage = function (stage, nestLevel) {
                // 调用父类方法
                egret.Sprite.prototype.$onAddToStage.call(this, stage, nestLevel);
                // 移除引用
                delete window["__EgretRoot__"];
                // 将控制权移交给Application对象
                onRootInitialized(this);
            };
            // 根据渲染模式初始化Egret引擎
            switch (this._initParams.renderMode) {
                case RenderMode_1.default.WEBGL:
                    initEgret("webgl");
                    break;
                case RenderMode_1.default.CANVAS:
                default:
                    initEgret("canvas");
                    break;
            }
            function initEgret(renderMode) {
                // 启动Egret引擎
                egret.runEgret({
                    renderMode: renderMode,
                    audioType: 0
                });
            }
            function onRootInitialized(root) {
                self._root = root;
                // 创建背景显示层
                self._bgLayer = new egret.Sprite();
                root.addChild(self._bgLayer);
                // 创建场景显示层
                self._sceneLayer = new egret.Sprite();
                root.addChild(self._sceneLayer);
                // 创建弹出层
                self._panelLayer = new egret.Sprite();
                root.addChild(self._panelLayer);
                // 创建遮罩层
                self._maskLayer = new egret.Sprite();
                root.addChild(self._maskLayer);
                // 创建顶级显示层
                self._topLayer = new egret.Sprite();
                root.addChild(self._topLayer);
                // 设置资源和主题适配器
                egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
                egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter(self._initParams));
                // 加载资源配置
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, self);
                RES.loadConfig(self._initParams.pathPrefix + "resource/default.res.json", self._initParams.pathPrefix + "resource/");
            }
            function onConfigComplete(evt) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, self);
                // 加载主题配置
                var theme = new eui.Theme(this._initParams.pathPrefix + "resource/default.thm.json", self._root.stage);
                theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
            }
            function onThemeLoadComplete(evt) {
                evt.target.removeEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
                // 调用回调
                complete(this);
            }
        };
        /**
         * 判断皮肤是否是Egret显示对象
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是Egret显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.isMySkin = function (skin) {
            return (skin instanceof egret.DisplayObject);
        };
        /**
         * 当皮肤被设置时处理皮肤的方法
         *
         * @param {IMediator} mediator 中介者实例
         * @memberof EgretBridge
         */
        EgretBridge.prototype.handleSkin = function (mediator) {
            // Egret暂不需要对皮肤进行特殊处理
        };
        /**
         * 添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.addChild = function (parent, target) {
            if (parent && target)
                return parent.addChild(target);
            else
                return target;
        };
        /**
         * 按索引添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.addChildAt = function (parent, target, index) {
            if (parent && target)
                return parent.addChildAt(target, index);
            else
                return target;
        };
        /**
         * 移除显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 被移除的显示对象
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.removeChild = function (parent, target) {
            if (parent && target && target.parent == parent)
                return parent.removeChild(target);
            else
                return target;
        };
        /**
         * 按索引移除显示
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 索引
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.removeChildAt = function (parent, index) {
            return parent.removeChildAt(index);
        };
        /**
         * 移除所有显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @memberof EgretBridge
         */
        EgretBridge.prototype.removeChildren = function (parent) {
            parent.removeChildren();
        };
        /**
         * 获取父容器
         *
         * @param {egret.DisplayObject} target 目标对象
         * @returns {egret.DisplayObjectContainer} 父容器
         * @memberof EgretBridge
         */
        EgretBridge.prototype.getParent = function (target) {
            return target.parent;
        };
        /**
         * 获取指定索引处的显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 指定父级索引
         * @return {egret.DisplayObject} 索引处的显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.getChildAt = function (parent, index) {
            return parent.getChildAt(index);
        };
        /**
         * 获取显示索引
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof EgretBridge
         */
        EgretBridge.prototype.getChildIndex = function (parent, target) {
            return parent.getChildIndex(target);
        };
        /**
         * 通过名称获取显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {string} name 对象名称
         * @return {egret.DisplayObject} 显示对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.getChildByName = function (parent, name) {
            return parent.getChildByName(name);
        };
        /**
         * 获取子显示对象数量
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof EgretBridge
         */
        EgretBridge.prototype.getChildCount = function (parent) {
            return parent.numChildren;
        };
        /**
         * 加载资源
         *
         * @param {string[]} assets 资源数组
         * @param {IMediator} mediator 资源列表
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof EgretBridge
         */
        EgretBridge.prototype.loadAssets = function (assets, mediator, handler) {
            var loader = new AssetsLoader_1.default({
                oneError: function (evt) {
                    // 调用回调
                    handler(new Error("资源加载失败"));
                    // 派发加载错误事件
                    Core_1.core.dispatch(ModuleMessage_1.default.MODULE_LOAD_ASSETS_ERROR, evt);
                },
                complete: function (dict) {
                    // 调用回调
                    handler();
                }
            });
            loader.loadGroups(assets);
        };
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.mapListener = function (target, type, handler, thisArg) {
            target.addEventListener(type, handler, thisArg);
        };
        /**
         * 注销监听事件
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof EgretBridge
         */
        EgretBridge.prototype.unmapListener = function (target, type, handler, thisArg) {
            target.removeEventListener(type, handler, thisArg);
        };
        /** 提供静态类型常量 */
        EgretBridge.TYPE = "Egret";
        return EgretBridge;
    }());
    exports.default = EgretBridge;
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
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
            RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
            function onGetRes(e) {
                try {
                    // 需要为所有主题资源添加路径前缀
                    var data = JSON.parse(e);
                    for (var key in data.skins)
                        data.skins[key] = this._initParams.pathPrefix + data.skins[key];
                    for (var key in data.exmls) {
                        // 如果只是URL则直接添加前缀，否则是内容集成方式，需要单独修改path属性
                        var exml = data.exmls[key];
                        if (typeof exml == "string")
                            data.exmls[key] = this._initParams.pathPrefix + exml;
                        else
                            exml.path = this._initParams.pathPrefix + exml.path;
                    }
                    e = JSON.stringify(data);
                }
                catch (err) { }
                compFunc.call(thisObject, e);
            }
            function onError(e) {
                if (e.resItem.url == url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
            }
        };
        return ThemeAdapter;
    }());
});
define("dom/mask/MaskEntity", ["require", "exports", "engine/bridge/BridgeManager", "EgretBridge"], function (require, exports, BridgeManager_2, EgretBridge_1) {
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
        function MaskEntityImpl(skin) {
            this._showing = false;
            if (typeof skin == "string") {
                var temp = document.createElement("div");
                temp.innerHTML = skin;
                skin = temp.children.item(0);
            }
            this._skin = skin;
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
            if (this._skin == null || this._showing)
                return;
            this._showing = true;
            // 显示
            var bridge = BridgeManager_2.bridgeManager.getBridge(EgretBridge_1.default.TYPE);
            bridge.maskLayer.addChild(this._skin);
        };
        /**
         * 隐藏加载图
         */
        MaskEntityImpl.prototype.hideLoading = function () {
            if (this._skin == null || !this._showing)
                return;
            this._showing = false;
            // 隐藏
            var bridge = BridgeManager_2.bridgeManager.getBridge(EgretBridge_1.default.TYPE);
            bridge.removeChild(this._skin.parentElement, this._skin);
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
/// <reference path="../../dist/Olympus.d.ts"/>
define("DOMBridge", ["require", "exports", "utils/ObjectUtil", "utils/HTTPUtil", "dom/mask/MaskEntity"], function (require, exports, ObjectUtil_1, HTTPUtil_1, MaskEntity_2) {
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
                return new MaskEntity_2.default(this._initParams.maskSkin);
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
         * 当皮肤被设置时处理皮肤的方法
         *
         * @param {IMediator} mediator 中介者实例
         * @memberof DOMBridge
         */
        DOMBridge.prototype.handleSkin = function (mediator) {
            // 当皮肤被赋值时将拥有id的节点赋值给mediator
            var skin = mediator.skin;
            if (!skin)
                return;
            // 使用正则表达式从皮肤字符串中查找所有id
            var reg = /id="([^"]+)"/g;
            var skinStr = skin.innerHTML;
            var result;
            while (result = reg.exec(skinStr)) {
                var id = result[1];
                mediator[id] = skin.querySelector("#" + id);
            }
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
            // 声明一个皮肤文本，用于记录所有皮肤模板后一次性生成显示
            var skinStr = "";
            // 开始加载皮肤列表
            if (assets)
                assets = assets.concat();
            loadNext();
            function loadNext() {
                if (!assets || assets.length <= 0) {
                    // 设置一个外壳容器
                    var div = document.createElement("div");
                    div.innerHTML = skinStr;
                    mediator.skin = div;
                    // 调用回调
                    handler();
                }
                else {
                    var skin = assets.shift();
                    if (skin.indexOf("<") >= 0 && skin.indexOf(">") >= 0) {
                        // 是皮肤字符串
                        skinStr += skin;
                        loadNext();
                    }
                    else {
                        // 是皮肤地址
                        HTTPUtil_1.load({
                            url: skin,
                            useCDN: true,
                            onResponse: function (result) {
                                skinStr += result;
                                loadNext();
                            },
                            onError: function (err) { return handler(err); }
                        });
                    }
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
        /** 提供静态类型常量 */
        DOMBridge.TYPE = "DOM";
        return DOMBridge;
    }());
    exports.default = DOMBridge;
});
define("dom/injector/Injector", ["require", "exports", "utils/ConstructUtil", "engine/injector/Injector", "engine/bridge/BridgeManager", "DOMBridge"], function (require, exports, ConstructUtil_1, Injector_1, BridgeManager_3, DOMBridge_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-09
     * @modify date 2017-10-09
     *
     * 负责注入的模块
    */
    function DOMMediatorClass(cls) {
        // 调用MediatorClass方法
        cls = Injector_1.MediatorClass(cls);
        // 监听类型实例化，赋值表现层桥
        ConstructUtil_1.listenConstruct(cls, function (mediator) { return mediator.bridge = BridgeManager_3.bridgeManager.getBridge(DOMBridge_2.default.TYPE); });
        // 返回结果类型
        return cls;
    }
    exports.DOMMediatorClass = DOMMediatorClass;
});
//# sourceMappingURL=DOM.js.map