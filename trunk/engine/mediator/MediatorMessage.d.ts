/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-05
 * @modify date 2018-03-05
 *
 * 中介者消息
*/
export default class MediatorMessage {
    /**
     * 中介者开启完毕事件
     *
     * @static
     * @type {string}
     * @memberof MediatorMessage
     */
    static MEDIATOR_OPENED: string;
    /**
     * 中介者关闭完毕事件
     *
     * @static
     * @type {string}
     * @memberof MediatorMessage
     */
    static MEDIATOR_CLOSED: string;
}
