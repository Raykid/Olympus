/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-05
 * @modify date 2018-03-05
 *
 * 中介者消息
*/
var MediatorMessage = /** @class */ (function () {
    function MediatorMessage() {
    }
    /**
     * 中介者开启完毕事件
     *
     * @static
     * @type {string}
     * @memberof MediatorMessage
     */
    MediatorMessage.MEDIATOR_OPENED = "mediatorOpened";
    /**
     * 中介者关闭完毕事件
     *
     * @static
     * @type {string}
     * @memberof MediatorMessage
     */
    MediatorMessage.MEDIATOR_CLOSED = "mediatorClosed";
    return MediatorMessage;
}());
export default MediatorMessage;
