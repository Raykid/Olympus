import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 无任何动画的弹出策略，可应用于任何显示层实现
*/
export class NonePopupPolicy implements IPopupPolicy
{
    public open(popup:IPopup, callback:()=>void, from?:{x:number, y:number}):void
    {
        setTimeout(callback, 0);
    }

    public close(popup:IPopup, callback:()=>void, from?:{x:number, y:number}):void
    {
        setTimeout(callback, 0);
    }
}
/** 默认导出实例 */
export default new NonePopupPolicy()