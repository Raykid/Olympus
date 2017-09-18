/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 核心事件类型
*/
export default class CoreMessage
{
    /**
     * 任何消息派发到框架后都会派发这个消息
     * 
     * @static
     * @type {string}
     * @memberof CoreMessage
     */
    public static MESSAGE_DISPATCHED:string = "messageDispatched";
}