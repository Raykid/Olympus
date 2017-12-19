import IScene from "./IScene";
export default class SceneManager {
    private _sceneStack;
    /**
     * 获取当前场景
     *
     * @readonly
     * @type {IScene}
     * @memberof SceneManager
     */
    readonly currentScene: IScene;
    /**
     * 获取活动场景个数
     *
     * @readonly
     * @type {number}
     * @memberof SceneManager
     */
    readonly activeCount: number;
    /**
     * 获取场景是否已经开启
     *
     * @param {IScene} scene 场景对象
     * @returns {boolean} 是否已经开启
     * @memberof SceneManager
     */
    isOpened(scene: IScene): boolean;
    /**
     * 切换场景，替换当前场景，当前场景会被销毁
     *
     * @param {IScene} scene 要切换到的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    switch(scene: IScene, data?: any): IScene;
    /**
     * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
     *
     * @param {IScene} scene 要推入的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    push(scene: IScene, data?: any): IScene;
    /**
     * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
     *
     * @param {IScene} scene 要切换出的场景，如果传入的场景不是当前场景则仅移除指定场景，不会进行切换操作
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    pop(scene: IScene, data?: any): IScene;
    private doPop(scene, data);
    private doChange(from, to, data, policy, type, begin?, complete?);
}
/** 再额外导出一个单例 */
export declare const sceneManager: SceneManager;
