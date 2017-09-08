import IHasBridge from "../../view/bridge/IHasBridge"
import IDisposable from "../../core/interfaces/IDisposable"
import IPopupPolicy from "./IPopupPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗中介者接口
*/
export default interface IPopup extends IHasBridge, IDisposable
{
    /** 获取弹窗的实体显示对象 */
    getSkin():any;
    /** 获取弹出策略 */
    getPolicy():IPopupPolicy;
    /** 在弹出前调用的方法 */
    onBeforeOpen(isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在弹出后调用的方法 */
    onAfterOpen(isModel?:boolean, from?:{x:number, y:number}):void;
    /** 在关闭前调用的方法 */
    onBeforeClose(to?:{x:number, y:number}):void;
    /** 在关闭后调用的方法 */
    onAfterClose(to?:{x:number, y:number}):void;
}