import { system } from '../system/System';
import IScene from "./IScene";
import IScenePolicy from "./IScenePolicy";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 无任何动画的场景策略，可应用于任何显示层实现
*/
export class NoneScenePolicy implements IScenePolicy
{
    /**
     * 准备切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     */
    public prepareSwitch(from?:IScene, to?:IScene):void
    {
        // 这个策略里啥也不用准备
    }

    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    public switch(from?:IScene, to?:IScene):Promise<void>
    {
        // 直接延迟到下一帧回调（不能同步回调，否则可能会出问题）
        return new Promise(resolve=>system.nextFrame(resolve));
    }
}
/** 默认导出实例 */
export default new NoneScenePolicy();