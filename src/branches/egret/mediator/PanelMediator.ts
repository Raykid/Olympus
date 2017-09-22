import Mediator from "./Mediator";
import IPanel from "engine/panel/IPanel";
import MediatorProxy from "engine/panel/PanelMediator";
import IPanelPolicy from "engine/panel/IPanelPolicy";
import { bridgeManager } from "engine/bridge/BridgeManager";
import { panelManager } from "engine/panel/PanelManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * Egret的弹窗中介者
*/
export default class PanelMediator extends Mediator implements IPanel
{
    /**
     * 弹出策略
     * 
     * @type {IPanelPolicy}
     * @memberof PanelMediator
     */
    public policy:IPanelPolicy;

    public constructor(skin?:any, policy?:IPanelPolicy)
    {
        super(skin);
        MediatorProxy.call(this, this, policy);
    }

    /**
     * 弹出当前弹窗（等同于调用PanelManager.pop方法）
     * 
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    public pop(data?:any, isModel?:boolean, from?:{x:number, y:number}):IPanel
    {
        return MediatorProxy.prototype.pop.call(this, data, isModel, from);
    }

    /**
     * 关闭当前弹窗（等同于调用PanelManager.drop方法）
     * 
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    public drop(data?:any, to?:{x:number, y:number}):IPanel
    {
        return MediatorProxy.prototype.drop.call(this, data, to);
    }
    
    /** 在弹出前调用的方法 */
    public onBeforePop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        MediatorProxy.prototype.onBeforePop.call(this, data, isModel, from);
    }

    /** 在弹出后调用的方法 */
    public onAfterPop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        MediatorProxy.prototype.onAfterPop.call(this, data, isModel, from);
    }

    /** 在关闭前调用的方法 */
    public onBeforeDrop(data?:any, to?:{x:number, y:number}):void
    {
        MediatorProxy.prototype.onBeforeDrop.call(this, data, to);
    }

    /** 在关闭后调用的方法 */
    public onAfterDrop(data?:any, to?:{x:number, y:number}):void
    {
        MediatorProxy.prototype.onAfterDrop.call(this, data, to);
    }
}