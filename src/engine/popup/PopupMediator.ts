import Mediator from "../component/Mediator"
import IBridge from "../../view/bridge/IBridge"
import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"

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
}