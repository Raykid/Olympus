/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景相关的消息
*/
export default class SceneMessage {
    /**
     * 切换场景前的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    static SCENE_BEFORE_CHANGE: string;
    /**
     * 切换场景后的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    static SCENE_AFTER_CHANGE: string;
    /**
     * 场景栈数据变化消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    static SCENE_STACK_CHANGE: string;
}
