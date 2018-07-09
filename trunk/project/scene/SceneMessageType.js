/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景相关的消息类型
*/
var SceneMessageType = /** @class */ (function () {
    function SceneMessageType() {
    }
    /**
     * 切换场景前的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessageType.SCENE_BEFORE_CHANGE = "sceneBeforeChange";
    /**
     * 切换场景后的消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessageType.SCENE_AFTER_CHANGE = "sceneAfterChange";
    /**
     * 场景栈数据变化消息
     *
     * @static
     * @type {string}
     * @memberof SceneMessage
     */
    SceneMessageType.SCENE_STACK_CHANGE = "sceneStackChange";
    return SceneMessageType;
}());
export default SceneMessageType;
