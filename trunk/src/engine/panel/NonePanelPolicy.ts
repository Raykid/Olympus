import { system } from '../system/System';
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
    public pop(panel:IPanel, from?:{x:number, y:number}):Promise<void>
    {
        return new Promise(resolve=>system.nextFrame(resolve));
    }

    public drop(panel:IPanel, from?:{x:number, y:number}):Promise<void>
    {
        return new Promise(resolve=>system.nextFrame(resolve));
    }
}
/** 默认导出实例 */
export default new NonePanelPolicy()