import IHasBridge from "../../view/bridge/IHasBridge"
import IPopupPolicy from "./IPopupPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗接口
*/
export default interface IPopup extends IHasBridge
{
    /** 获取弹出策略 */
    getPolicy():IPopupPolicy;
    /** 设置切换策略 */
    setPolicy(policy:IPopupPolicy):void;
    /** 在弹出前调用的方法 */
    onBeforeOpen(isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在弹出后调用的方法 */
    onAfterOpen(isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在关闭前调用的方法 */
    onBeforeClose(to?:{x:number, y:number}):void;
    /** 在关闭后调用的方法 */
    onAfterClose(to?:{x:number, y:number}):void;
}