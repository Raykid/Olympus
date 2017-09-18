import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 无任何动画的弹出策略，可应用于任何显示层实现
*/
export class NonePanelPolicy implements IPanelPolicy
{
    public pop(panel:IPanel, callback:()=>void, from?:{x:number, y:number}):void
    {
        setTimeout(callback, 0);
    }

    public drop(panel:IPanel, callback:()=>void, from?:{x:number, y:number}):void
    {
        setTimeout(callback, 0);
    }
}
/** 默认导出实例 */
export default new NonePanelPolicy()