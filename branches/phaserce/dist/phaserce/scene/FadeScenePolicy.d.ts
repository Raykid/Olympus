import IScene from "olympus-r/engine/scene/IScene";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
/**
 * 淡入淡出场景切换策略
 *
 * @author Raykid
 * @date 2019-12-06
 * @export
 * @class FadeScenePolicy
 * @implements {IScenePolicy}
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
