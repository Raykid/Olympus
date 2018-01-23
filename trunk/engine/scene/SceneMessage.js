/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景相关的消息
*/
var SceneMessage = /** @class */ (function () {
    function SceneMessage() {
    }
    /**
     * 切换场景前的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessage.SCENE_BEFORE_CHANGE = "sceneBeforeChange";
    /**
     * 切换场景后的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessage.SCENE_AFTER_CHANGE = "sceneAfterChange";
    /**
     * 场景栈数据变化消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessage.SCENE_STACK_CHANGE = "sceneStackChange";
    return SceneMessage;
}());
export default SceneMessage;
