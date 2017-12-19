import IScene from "./IScene";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景动画策略，负责将场景动画与场景实体解耦
*/
export default interface IScenePolicy {
    /**
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    prepareSwitch?(from: IScene, to: IScene): void;
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    switch(from: IScene, to: IScene, callback: () => void): void;
    /**
     * 准备Push场景时调度，如果没有定义该方法则套用PrepareSwitch
     * @param from 切出的场景
     * @param to 切入的场景
     */
    preparePush?(from: IScene, to: IScene): void;
    /**
     * Push场景时调度，如果没有定义该方法则套用switch
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    push?(from: IScene, to: IScene, callback: () => void): void;
    /**
     * 准备Pop场景时调度，如果没有定义该方法则套用PrepareSwitch
     * @param from 切出的场景
     * @param to 切入的场景
     */
    preparePop?(from: IScene, to: IScene): void;
    /**
     * Pop场景时调度，如果没有定义该方法则套用switch
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    pop?(from: IScene, to: IScene, callback: () => void): void;
}
