import Mediator from "../mediator/Mediator";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
import { panelManager } from "./PanelManager";
import MediatorMessage from "../mediator/MediatorMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 实现了IPanel接口的弹窗中介者基类
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
        this.policy = policy;
    }

    public __afterOnOpen(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        panelManager.pop(this, data, isModel, from)
    }

    public __afterOnClose(data?:any, to?:{x:number, y:number}):void
    {
        // 篡改onAfterDrop，等待关闭动画结束后再执行
        var oriOnAfterDrop:(data?:any, to?:{x:number, y:number})=>void = this.onAfterDrop;
        this.onAfterDrop = (data?:any, to?:{x:number, y:number})=>{
            oriOnAfterDrop.call(this, data, to);
            // 派发关闭事件
            this.dispatch(MediatorMessage.MEDIATOR_CLOSED, this);
        };
        panelManager.drop(this, data, to);
    }
    
    /** 在弹出前调用的方法 */
    public onBeforePop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在弹出后调用的方法 */
    public onAfterPop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭前调用的方法 */
    public onBeforeDrop(data?:any, to?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭后调用的方法 */
    public onAfterDrop(data?:any, to?:{x:number, y:number}):void
    {
        // 可重写
    }
}