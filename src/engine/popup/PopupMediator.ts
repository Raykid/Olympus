import Mediator from "../../view/mediator/Mediator"
import IBridge from "../../view/bridge/IBridge"
import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 实现了IPopup接口的弹窗中介者基类，也可以不继承该基类而自行实现IPopup接口以替代该基类
*/
export default class PopupMediator extends Mediator implements IPopup
{
    public constructor(bridge:IBridge, skin?:any, policy?:IPopupPolicy)
    {
        super(bridge, skin);
        this.setPolicy(policy);
    }

    private _policy:IPopupPolicy;
    /** 获取弹出策略 */
    public getPolicy():IPopupPolicy
    {
        return this._policy;
    }
    /** 设置弹出策略 */
    public setPolicy(policy:IPopupPolicy):void
    {
        this._policy = policy;
    }

    /** 在弹出前调用的方法 */
    public onBeforeOpen():void
    {
        // 留待子类完善
    }

    /** 在弹出后调用的方法 */
    public onAfterOpen():void
    {
        // 留待子类完善
    }

    /** 在关闭前调用的方法 */
    public onBeforeClose():void
    {
        // 留待子类完善
    }

    /** 在关闭后调用的方法 */
    public onAfterClose():void
    {
        // 留待子类完善
    }
}