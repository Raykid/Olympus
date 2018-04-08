import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import none from "./NonePanelPolicy";
import PanelMessage from "./PanelMessage";
import { ButtonType } from "./IPromptPanel";
import { bridgeManager } from "../bridge/BridgeManager";
import { maskManager } from "../mask/MaskManager";
import Dictionary from "../../utils/Dictionary";
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
        this._priorities = new Dictionary();
        this._modalDict = new Dictionary();
        /************************ 下面是通用弹窗的逻辑 ************************/
        this._promptDict = {};
    }
    PanelManager_1 = PanelManager;
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
    PanelManager.prototype.updateModalMask = function (panel) {
        // 首先将传入的panel的模态遮罩去除
        maskManager.hideModalMask(panel);
        // 然后为最上层的模态弹窗添加遮罩
        for (var i = this._panels.length - 1; i >= 0; i--) {
            panel = this._panels[i];
            if (this._modalDict.get(panel)) {
                // 如果已经有遮罩了，先移除之
                if (maskManager.isShowingModalMask(panel))
                    maskManager.hideModalMask(panel);
                // 添加遮罩
                maskManager.showModalMask(panel);
                break;
            }
        }
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
        var _this = this;
        if (isModal === void 0) { isModal = true; }
        if (this._panels.indexOf(panel) < 0) {
            // 数据先行
            this._panels.push(panel);
            // 弹窗所在的表现层必须要显示
            panel.bridge.htmlWrapper.style.display = "";
            // 获取策略
            var policy = panel.policy || panel.bridge.defaultPanelPolicy || none;
            // 调用回调
            panel.onBeforePop(data, isModal, from);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_POP, panel, isModal, from);
            // 调用准备接口
            policy.prepare && policy.prepare(panel);
            // 添加显示
            var bridge = panel.bridge;
            bridge.addChild(panel.bridge.panelLayer, panel.skin);
            // 根据优先级进行排序
            this._panels.sort(function (a, b) {
                var priA = _this._priorities.get(a) || 0;
                var priB = _this._priorities.get(b) || 0;
                return priA - priB;
            });
            // 根据排序后的顺序调整显示顺序
            for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
                var temp = _a[_i];
                temp.bridge.addChild(temp.bridge.panelLayer, temp.skin);
            }
            // 调用策略接口
            policy.pop(panel, function () {
                // 调用回调
                panel.onAfterPop(data, isModal, from);
                // 派发消息
                core.dispatch(PanelMessage.PANEL_AFTER_POP, panel, isModal, from);
            }, from);
            // 记录模态数据
            this._modalDict.set(panel, isModal);
            // 更新模态遮罩
            this.updateModalMask(panel);
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
            var policy = panel.policy || panel.bridge.defaultPanelPolicy || none;
            // 调用回调
            panel.onBeforeDrop(data, to);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_DROP, panel, to);
            // 调用策略接口
            policy.drop(panel, function () {
                // 调用回调
                panel.onAfterDrop(data, to);
                // 派发消息
                core.dispatch(PanelMessage.PANEL_AFTER_DROP, panel, to);
                // 移除显示
                var bridge = panel.bridge;
                var parent = bridge.getParent(panel.skin);
                if (parent)
                    bridge.removeChild(parent, panel.skin);
                // 调用接口
                panel.dispose();
            }, to);
            // 移除优先级数据
            this._priorities.delete(panel);
            // 移除模态数据
            this._modalDict.delete(panel);
            // 更新模态遮罩
            this.updateModalMask(panel);
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
        var curBridge = bridgeManager.currentBridge;
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
                handler.buttonType = ButtonType.normal;
        }
        // 实例化
        var prompt = new promptCls();
        // 设置优先级
        this._priorities.set(prompt, PanelManager_1.PRIORITY_PROMPT);
        // 显示弹窗
        prompt.open(params);
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
            { data: "确定", handler: okHandler, buttonType: ButtonType.important }
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
            { data: "取消", handler: cancelHandler, buttonType: ButtonType.normal },
            { data: "确定", handler: okHandler, buttonType: ButtonType.important }
        ];
        return this.prompt(params);
    };
    PanelManager.PRIORITY_NORMAL = 0;
    PanelManager.PRIORITY_PROMPT = 1;
    PanelManager = PanelManager_1 = tslib_1.__decorate([
        Injectable
    ], PanelManager);
    return PanelManager;
    var PanelManager_1;
}());
export default PanelManager;
/** 再额外导出一个单例 */
export var panelManager = core.getInject(PanelManager);
