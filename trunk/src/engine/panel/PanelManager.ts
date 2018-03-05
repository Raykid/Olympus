import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"
import IConstructor from "../../core/interfaces/IConstructor";
import IBridge from "../bridge/IBridge";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
import none from "./NonePanelPolicy";
import PanelMessage from "./PanelMessage";
import IPromptPanel, { IPromptParams, IPromptHandler, ButtonType, IPromptPanelConstructor } from "./IPromptPanel";
import { system } from "../system/System";
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
@Injectable
export default class PanelManager
{
    private static PRIORITY_NORMAL:number = 0;
    private static PRIORITY_PROMPT:number = 1;

    private _panels:IPanel[] = [];
    private _priorities:Dictionary<IPanel, number> = new Dictionary();
    private _modalDict:Dictionary<IPanel, boolean> = new Dictionary();

    /**
     * 获取当前显示的弹窗数组（副本）
     * 
     * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
     * @returns {IPanel[]} 已打开弹窗数组
     * @memberof PanelManager
     */
    public getOpened(cls?:IConstructor):IPanel[]
    {
        if(!cls) return this._panels.concat();
        else return this._panels.filter(panel=>panel.constructor==cls);
    }

    /**
     * 获取弹窗是否已开启
     * 
     * @param {IPanel} panel 弹窗对象
     * @returns {boolean} 是否已经开启
     * @memberof PanelManager
     */
    public isOpened(panel:IPanel):boolean
    {
        return (this._panels.indexOf(panel) >= 0);
    }

    private updateModalMask(panel:IPanel):void
    {
        // 首先将传入的panel的模态遮罩去除
        maskManager.hideModalMask(panel);
        // 然后为最上层的模态弹窗添加遮罩
        for(var i:number = this._panels.length - 1; i >= 0; i--)
        {
            panel = this._panels[i];
            if(this._modalDict.get(panel))
            {
                // 如果已经有遮罩了，先移除之
                if(maskManager.isShowingModalMask(panel))
                    maskManager.hideModalMask(panel);
                // 添加遮罩
                maskManager.showModalMask(panel);
                break;
            }
        }
    }

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
    public pop(panel:IPanel, data?:any, isModal:boolean=true, from?:{x:number, y:number}):IPanel
    {
        if(this._panels.indexOf(panel) < 0)
        {
            // 数据先行
            this._panels.push(panel);
            // 弹窗所在的表现层必须要显示
            panel.bridge.htmlWrapper.style.display = "";
            // 获取策略
            var policy:IPanelPolicy = panel.policy || panel.bridge.defaultPanelPolicy || none;
            // 调用回调
            panel.onBeforePop(data, isModal, from);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_POP, panel, isModal, from);
            // 调用准备接口
            policy.prepare && policy.prepare(panel);
            // 添加显示
            var bridge:IBridge = panel.bridge;
            bridge.addChild(panel.bridge.panelLayer, panel.skin);
            // 根据优先级进行排序
            this._panels.sort((a:IPanel, b:IPanel)=>{
                var priA:number = this._priorities.get(a) || 0;
                var priB:number = this._priorities.get(b) || 0;
                return priA - priB;
            });
            // 根据排序后的顺序调整显示顺序
            for(var temp of this._panels)
            {
                temp.bridge.addChild(temp.bridge.panelLayer, temp.skin);
            }
            // 调用策略接口
            policy.pop(panel, ()=>{
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
    }

    /**
     * 关闭一个弹窗
     * 
     * @param {IPanel} panel 要关闭的弹窗
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭终点位置
     * @returns {IPanel} 返回弹窗对象
     * @memberof PanelManager
     */
    public drop(panel:IPanel, data?:any, to?:{x:number, y:number}):IPanel
    {
        var index:number = this._panels.indexOf(panel);
        if(index >= 0)
        {
            // 数据先行
            this._panels.splice(index, 1);
            // 获取策略
            var policy:IPanelPolicy = panel.policy || panel.bridge.defaultPanelPolicy || none;
            // 调用回调
            panel.onBeforeDrop(data, to);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_DROP, panel, to);
            // 调用策略接口
            policy.drop(panel, ()=>{
                // 调用回调
                panel.onAfterDrop(data, to);
                // 派发消息
                core.dispatch(PanelMessage.PANEL_AFTER_DROP, panel, to);
                // 移除显示
                var bridge:IBridge = panel.bridge;
                var parent:any = bridge.getParent(panel.skin);
                if(parent) bridge.removeChild(parent, panel.skin);
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
    }

    /************************ 下面是通用弹窗的逻辑 ************************/

    private _promptDict:{[type:string]:IPromptPanelConstructor} = {};
    /**
     * 注册通用弹窗
     * 
     * @param {string} type 通用弹窗要注册到的表现层类型
     * @param {IPromptPanelConstructor} prompt 通用弹窗类型
     * @memberof PanelManager
     */
    public registerPrompt(type:string, prompt:IPromptPanelConstructor):void
    {
        this._promptDict[type] = prompt;
    }
    /**
     * 取消注册通用弹窗
     * 
     * @param {string} type 要取消注册通用弹窗的表现层类型
     * @memberof PanelManager
     */
    public unregisterPrompt(type:string):void
    {
        delete this._promptDict[type];
    }

    /**
     * 显示提示窗口
     * 
     * @param {string} msg 要显示的文本
     * @param {...IPromptHandler[]} handlers 按钮回调数组
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    public prompt(msg:string, ...handlers:IPromptHandler[]):IPromptPanel;
    /**
     * 显示提示窗口
     * 
     * @param {IPromptParams} params 弹窗数据
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    public prompt(params:IPromptParams):IPromptPanel;
    /**
     * @private
     */
    public prompt(msgOrParams:string|IPromptParams, ...handlers:IPromptHandler[]):IPromptPanel
    {
        var params:IPromptParams;
        if(typeof msgOrParams == "string")
        {
            params = {
                msg: msgOrParams as string,
                handlers: handlers
            };
        }
        else
        {
            params = msgOrParams;
        }
        // 取到当前场景的类型
        var curBridge:IBridge = bridgeManager.currentBridge;
        var type:string = curBridge && curBridge.type;
        // 用场景类型取到弹窗对象
        var promptCls:IPromptPanelConstructor = this._promptDict[type];
        if(promptCls == null)
        {
            // 没有找到当前模块类型关联的通用弹窗类型，改用系统弹窗凑合一下
            alert(params.msg);
            return;
        }
        // 增加默认值
        for(var i in params.handlers)
        {
            var handler:IPromptHandler = params.handlers[i];
            if(handler.text == null) handler.text = handler.data;
            if(handler.buttonType == null) handler.buttonType = ButtonType.normal;
        }
        // 实例化
        var prompt:IPromptPanel = new promptCls();
        // 设置优先级
        this._priorities.set(prompt, PanelManager.PRIORITY_PROMPT);
        // 显示弹窗
        prompt.open(params);
        // 更新弹窗
        prompt.update(params);
        // 返回弹窗
        return prompt;
    }

    /**
     * 显示警告窗口（只有一个确定按钮）
     * 
     * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
     * @param {()=>void} [okHandler] 确定按钮点击回调
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    public alert(msgOrParams:string|IPromptParams, okHandler?:()=>void):IPromptPanel
    {
        var params:IPromptParams;
        if(typeof msgOrParams == "string")
        {
            params = {msg: msgOrParams};
        }
        else
        {
            params = msgOrParams;
        }
        params.handlers = [
            {data:"确定", handler:okHandler, buttonType:ButtonType.important}
        ];
        return this.prompt(params);
    }

    /**
     * 显示确认窗口（有一个确定按钮和一个取消按钮）
     * 
     * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
     * @param {()=>void} [okHandler] 确定按钮点击回调
     * @param {()=>void} [cancelHandler] 取消按钮点击回调
     * @returns {IPromptPanel} 返回弹窗实体
     * @memberof PanelManager
     */
    public confirm(msgOrParams:string|IPromptParams, okHandler?:()=>void, cancelHandler? :()=>void):IPromptPanel
    {
        var params:IPromptParams;
        if(typeof msgOrParams == "string")
        {
            params = {msg: msgOrParams};
        }
        else
        {
            params = msgOrParams;
        }
        params.handlers = [
            {data:"取消", handler:cancelHandler, buttonType:ButtonType.normal},
            {data:"确定", handler:okHandler, buttonType:ButtonType.important}
        ];
        return this.prompt(params);
    }
}
/** 再额外导出一个单例 */
export const panelManager:PanelManager = core.getInject(PanelManager)