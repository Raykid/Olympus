var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/Core", "../../core/injector/Injector", "./NonePanelPolicy", "./PanelMessage", "./IPromptPanel", "../bridge/BridgeManager", "../mask/MaskManager"], function (require, exports, Core_1, Injector_1, NonePanelPolicy_1, PanelMessage_1, IPromptPanel_1, BridgeManager_1, MaskManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
    */
    var PanelManager = /** @class */ (function () {
        function PanelManager() {
            this._panels = [];
            /************************ 下面是通用弹窗的逻辑 ************************/
            this._promptDict = {};
        }
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPanel[]} 已打开弹窗数组
         * @memberof PanelManager
         */
        PanelManager.prototype.getOpened = function (cls) {
            if (!cls)
                return this._panels.concat();
            else
                return this._panels.filter(function (panel) { return panel.constructor == cls; });
        };
        /**
         * 获取弹窗是否已开启
         *
         * @param {IPanel} panel 弹窗对象
         * @returns {boolean} 是否已经开启
         * @memberof PanelManager
         */
        PanelManager.prototype.isOpened = function (panel) {
            return (this._panels.indexOf(panel) >= 0);
        };
        /**
         * 打开一个弹窗
         *
         * @param {IPanel} panel 要打开的弹窗
         * @param {*} [data] 数据
         * @param {boolean} [isModal=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        PanelManager.prototype.pop = function (panel, data, isModal, from) {
            if (isModal === void 0) { isModal = true; }
            if (this._panels.indexOf(panel) < 0) {
                // 数据先行
                this._panels.push(panel);
                // 弹窗所在的表现层必须要显示
                panel.bridge.htmlWrapper.style.display = "";
                // 调用接口
                panel.__open(data, isModal, from);
                // 获取策略
                var policy = panel.policy || panel.bridge.defaultPanelPolicy || NonePanelPolicy_1.default;
                // 调用回调
                panel.onBeforePop(data, isModal, from);
                // 派发消息
                Core_1.core.dispatch(PanelMessage_1.default.PANEL_BEFORE_POP, panel, isModal, from);
                // 调用准备接口
                policy.prepare && policy.prepare(panel);
                // 添加显示
                var bridge = panel.bridge;
                bridge.addChild(bridge.panelLayer, panel.skin);
                // 调用策略接口
                policy.pop(panel, function () {
                    // 调用回调
                    panel.onAfterPop(data, isModal, from);
                    // 派发消息
                    Core_1.core.dispatch(PanelMessage_1.default.PANEL_AFTER_POP, panel, isModal, from);
                }, from);
                // 如果是模态弹出，则需要遮罩层
                if (isModal)
                    MaskManager_1.maskManager.showModalMask(panel);
            }
            return panel;
        };
        /**
         * 关闭一个弹窗
         *
         * @param {IPanel} panel 要关闭的弹窗
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        PanelManager.prototype.drop = function (panel, data, to) {
            var index = this._panels.indexOf(panel);
            if (index >= 0) {
                // 数据先行
                this._panels.splice(index, 1);
                // 获取策略
                var policy = panel.policy || panel.bridge.defaultPanelPolicy || NonePanelPolicy_1.default;
                // 调用回调
                panel.onBeforeDrop(data, to);
                // 派发消息
                Core_1.core.dispatch(PanelMessage_1.default.PANEL_BEFORE_DROP, panel, to);
                // 调用策略接口
                policy.drop(panel, function () {
                    // 调用回调
                    panel.onAfterDrop(data, to);
                    // 派发消息
                    Core_1.core.dispatch(PanelMessage_1.default.PANEL_AFTER_DROP, panel, to);
                    // 移除显示
                    var bridge = panel.bridge;
                    bridge.removeChild(bridge.panelLayer, panel.skin);
                    // 调用接口
                    panel.__close(data, to);
                }, to);
                // 移除遮罩
                MaskManager_1.maskManager.hideModalMask(panel);
            }
            return panel;
        };
        /**
         * 注册通用弹窗
         *
         * @param {string} type 通用弹窗要注册到的表现层类型
         * @param {IPromptPanelConstructor} prompt 通用弹窗类型
         * @memberof PanelManager
         */
        PanelManager.prototype.registerPrompt = function (type, prompt) {
            this._promptDict[type] = prompt;
        };
        /**
         * 取消注册通用弹窗
         *
         * @param {string} type 要取消注册通用弹窗的表现层类型
         * @memberof PanelManager
         */
        PanelManager.prototype.unregisterPrompt = function (type) {
            delete this._promptDict[type];
        };
        /**
         * @private
         */
        PanelManager.prototype.prompt = function (msgOrParams) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            var params;
            if (typeof msgOrParams == "string") {
                params = {
                    msg: msgOrParams,
                    handlers: handlers
                };
            }
            else {
                params = msgOrParams;
            }
            // 取到当前场景的类型
            var curBridge = BridgeManager_1.bridgeManager.currentBridge;
            var type = curBridge && curBridge.type;
            // 用场景类型取到弹窗对象
            var promptCls = this._promptDict[type];
            if (promptCls == null) {
                // 没有找到当前模块类型关联的通用弹窗类型，改用系统弹窗凑合一下
                alert(params.msg);
                return;
            }
            // 增加默认值
            for (var i in params.handlers) {
                var handler = params.handlers[i];
                if (handler.text == null)
                    handler.text = handler.data;
                if (handler.buttonType == null)
                    handler.buttonType = IPromptPanel_1.ButtonType.normal;
            }
            // 实例化
            var prompt = new promptCls();
            // 显示弹窗
            this.pop(prompt);
            // 更新弹窗
            prompt.update(params);
            // 返回弹窗
            return prompt;
        };
        /**
         * 显示警告窗口（只有一个确定按钮）
         *
         * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
         * @param {()=>void} [okHandler] 确定按钮点击回调
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        PanelManager.prototype.alert = function (msgOrParams, okHandler) {
            var params;
            if (typeof msgOrParams == "string") {
                params = { msg: msgOrParams };
            }
            else {
                params = msgOrParams;
            }
            params.handlers = [
                { data: "确定", handler: okHandler, buttonType: IPromptPanel_1.ButtonType.important }
            ];
            return this.prompt(params);
        };
        /**
         * 显示确认窗口（有一个确定按钮和一个取消按钮）
         *
         * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
         * @param {()=>void} [okHandler] 确定按钮点击回调
         * @param {()=>void} [cancelHandler] 取消按钮点击回调
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        PanelManager.prototype.confirm = function (msgOrParams, okHandler, cancelHandler) {
            var params;
            if (typeof msgOrParams == "string") {
                params = { msg: msgOrParams };
            }
            else {
                params = msgOrParams;
            }
            params.handlers = [
                { data: "取消", handler: cancelHandler, buttonType: IPromptPanel_1.ButtonType.normal },
                { data: "确定", handler: okHandler, buttonType: IPromptPanel_1.ButtonType.important }
            ];
            return this.prompt(params);
        };
        PanelManager = __decorate([
            Injector_1.Injectable
        ], PanelManager);
        return PanelManager;
    }());
    exports.default = PanelManager;
    /** 再额外导出一个单例 */
    exports.panelManager = Core_1.core.getInject(PanelManager);
});
//# sourceMappingURL=PanelManager.js.map