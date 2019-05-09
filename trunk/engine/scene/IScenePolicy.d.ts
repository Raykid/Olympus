import IScene from "./IScene";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景动画策略，负责将场景动画与场景实体解耦
*/
export default interface IScenePolicy<S = any> {
    /**
     * 准备切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     */
    prepareSwitch?(from?: IScene<S>, to?: IScene<S>): void;
    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    switch(from?: IScene<S>, to?: IScene<S>): Promise<void>;
    /**
     * 准备Push场景时调度，如果没有定义该方法则套用PrepareSwitch
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     */
    preparePush?(from?: IScene<S>, to?: IScene<S>): void;
    /**
     * Push场景时调度，如果没有定义该方法则套用switch
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    push?(from?: IScene<S>, to?: IScene<S>): Promise<void>;
    /**
     * 准备Pop场景时调度，如果没有定义该方法则套用PrepareSwitch
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     */
    preparePop?(from?: IScene<S>, to?: IScene<S>): void;
    /**
     * Pop场景时调度，如果没有定义该方法则套用switch
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    pop?(from?: IScene<S>, to?: IScene<S>): Promise<void>;
}
