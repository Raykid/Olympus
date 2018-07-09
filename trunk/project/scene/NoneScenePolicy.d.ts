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
export declare class NoneScenePolicy implements IScenePolicy {
    /**
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    prepareSwitch(from: IScene, to: IScene): void;
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    switch(from: IScene, to: IScene, callback: () => void): void;
}
declare const _default: NoneScenePolicy;
export default _default;
