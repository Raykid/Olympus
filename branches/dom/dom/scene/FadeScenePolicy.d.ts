import IScene from "olympus-r/engine/scene/IScene";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 淡入淡出场景切换策略
*/
export default class FadeScenePolicy implements IScenePolicy {
    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    switch(from?: IScene, to?: IScene): Promise<void>;
}
