/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-05
 * @modify date 2018-03-05
 *
 * 组件消息类型
*/
var ComponentMessageType = /** @class */ (function () {
    function ComponentMessageType() {
    }
    /**
     * 组件开启完毕事件
     *
     * @static
     * @type {string}
     * @memberof ComponentMessageType
     */
    ComponentMessageType.COMPONENT_OPENED = "componentOpened";
    /**
     * 组件关闭完毕事件
     *
     * @static
     * @type {string}
     * @memberof ComponentMessageType
     */
    ComponentMessageType.COMPONENT_CLOSED = "componentClosed";
    return ComponentMessageType;
}());
export default ComponentMessageType;
