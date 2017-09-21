import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"
import IConstructor from "../../core/interfaces/IConstructor";
import IBridge from "../bridge/IBridge";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
import none from "./NonePanelPolicy";
import PanelMessage from "./PanelMessage";

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
    private _panels:IPanel[] = [];

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
     * 打开一个弹窗
     * 
     * @param {IPanel} panel 要打开的弹窗
     * @param {*} [data] 数据
     * @param {boolean} [isModel=true] 是否模态弹出
     * @param {{x:number, y:number}} [from] 弹出起点位置
     * @returns {IPanel} 返回弹窗对象
     * @memberof PanelManager
     */
    public open(panel:IPanel, data?:any, isModel:boolean=true, from?:{x:number, y:number}):IPanel
    {
        if(this._panels.indexOf(panel) < 0)
        {
            var policy:IPanelPolicy = panel.policy;
            if(policy == null) policy = none;
            // 调用回调
            panel.onBeforePop && panel.onBeforePop(data, isModel, from);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_POP, panel, isModel, from);
            // 添加显示
            var bridge:IBridge = panel.bridge;
            bridge.addChild(bridge.panelLayer, panel.skin);
            // 调用策略接口
            policy.pop(panel, ()=>{
                // 调用回调
                panel.onAfterPop && panel.onAfterPop(data, isModel, from);
                // 派发消息
                core.dispatch(PanelMessage.PANEL_AFTER_POP, panel, isModel, from);
            }, from);
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
    public close(panel:IPanel, data?:any, to?:{x:number, y:number}):IPanel
    {
        var index:number = this._panels.indexOf(panel);
        if(index >= 0)
        {
            var policy:IPanelPolicy = panel.policy;
            if(policy == null) policy = none;
            // 调用回调
            panel.onBeforeDrop && panel.onBeforeDrop(data, to);
            // 派发消息
            core.dispatch(PanelMessage.PANEL_BEFORE_DROP, panel, to);
            // 调用策略接口
            policy.drop(panel, ()=>{
                // 调用回调
                panel.onAfterDrop && panel.onAfterDrop(data, to);
                // 派发消息
                core.dispatch(PanelMessage.PANEL_AFTER_DROP, panel, to);
                // 移除显示
                var bridge:IBridge = panel.bridge;
                bridge.removeChild(bridge.panelLayer, panel.skin);
                // 销毁弹窗
                panel.dispose();
            }, to);
        }
        return panel;
    }
}
/** 再额外导出一个单例 */
export const panelManager:PanelManager = core.getInject(PanelManager)