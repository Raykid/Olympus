import Mediator from "../component/Mediator"
import IBridge from "../../view/bridge/IBridge"
import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"
import {popupManager} from "./PopupManager"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 实现了IPopup接口的弹窗中介者基类
*/
export default abstract class PopupMediator extends Mediator implements IPopup
{
    public constructor(bridge:IBridge, skin?:any, policy?:IPopupPolicy)
    {
        super(bridge, skin);
        this.setPolicy(policy);
    }

    private _policy:IPopupPolicy;
    /**
     * 获取弹出策略
     * 
     * @returns {IPopupPolicy} 弹出策略
     * @memberof PopupMediator
     */
    public getPolicy():IPopupPolicy
    {
        return this._policy;
    }
    /**
     * 设置弹出策略
     * 
     * @param {IPopupPolicy} policy 设置弹出策略
     * @memberof PopupMediator
     */
    public setPolicy(policy:IPopupPolicy):void
    {
        this._policy = policy;
    }

    
    /**
     * 弹出当前弹窗（等同于调用PopupManager.open方法）
     * 
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @returns {IPopup} 弹窗本体
     * @memberof PopupMediator
     */
    public open(data?:any, isModel?:boolean, from?:{x:number, y:number}):IPopup
    {
        return popupManager.open(this, data, isModel, from);
    }

    /**
     * 关闭当前弹窗（等同于调用PopupManager.close方法）
     * 
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @returns {IPopup} 弹窗本体
     * @memberof PopupMediator
     */
    public close(data?:any, to?:{x:number, y:number}):IPopup
    {
        return popupManager.close(this, data, to);
    }
}