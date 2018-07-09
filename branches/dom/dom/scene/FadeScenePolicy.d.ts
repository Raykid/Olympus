import IScene from 'olympus-r/project/scene/IScene';
import IScenePolicy from 'olympus-r/project/scene/IScenePolicy';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 淡入淡出场景切换策略
*/
export default class FadeScenePolicy implements IScenePolicy {
    private _stageClone;
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
