import Mediator from "../mediator/Mediator";
import MediatorMessage from "../mediator/MediatorMessage";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
import { panelManager } from "./PanelManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * @export
 * @class PanelMediator
 * @extends {Mediator<S, OD, CD>}
 * @implements {IPanel<S, OD, CD>}
 * @template S 皮肤类型
 * @template OD 开启参数类型
 * @template CD 关闭参数类型
 * 
 * 实现了IPanel接口的弹窗中介者基类
*/
export default class PanelMediator<S = any, OD = any, CD = any> extends Mediator<S, OD, CD> implements IPanel<S, OD, CD>
{
    /**
     * 弹出策略
     * 
     * @type {IPanelPolicy<S>}
     * @memberof PanelMediator
     */
    public policy:IPanelPolicy<S>;
    
    public constructor(skin?:S, policy?:IPanelPolicy<S>)
    {
        super(skin);
        this.policy = policy;
    }

    public __afterOnOpen(data?:OD, isModel?:boolean, from?:{x:number, y:number}):void
    {
        panelManager.pop(this, data, isModel, from);
    }

    public __afterOnClose(data?:CD, to?:{x:number, y:number}):void
    {
        // 篡改onAfterDrop，等待关闭动画结束后再执行
        var oriOnAfterDrop:(data?:CD, to?:{x:number, y:number})=>void = this.onAfterDrop;
        this.onAfterDrop = (data?:CD, to?:{x:number, y:number})=>{
            oriOnAfterDrop.call(this, data, to);
            // 派发关闭事件
            this.dispatch(MediatorMessage.MEDIATOR_CLOSED, this);
            // 调用销毁
            this.dispose();
        };
        panelManager.drop(this, data, to);
    }
    
    /** 在弹出前调用的方法 */
    public onBeforePop(data?:OD, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在弹出后调用的方法 */
    public onAfterPop(data?:OD, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭前调用的方法 */
    public onBeforeDrop(data?:CD, to?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭后调用的方法 */
    public onAfterDrop(data?:CD, to?:{x:number, y:number}):void
    {
        // 可重写
    }
}