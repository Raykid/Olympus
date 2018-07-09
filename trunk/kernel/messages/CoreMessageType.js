/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 *
 * 核心事件类型
*/
var CoreMessageType = /** @class */ (function () {
    function CoreMessageType() {
    }
    /**
     * 任何消息派发到框架后都会派发这个消息
     *
     * @static
     * @type {string}
     * @memberof CoreMessageType
     */
    CoreMessageType.MESSAGE_DISPATCHED = "messageDispatched";
    return CoreMessageType;
}());
export default CoreMessageType;
