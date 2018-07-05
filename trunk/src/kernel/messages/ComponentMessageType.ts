/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-05
 * @modify date 2018-03-05
 * 
 * 组件消息类型
*/
export default class ComponentMessageType
{
    /**
     * 组件开启完毕事件
     * 
     * @static
     * @type {string}
     * @memberof ComponentMessageType
     */
    public static COMPONENT_OPENED:string = "componentOpened";
    /**
     * 组件关闭完毕事件
     * 
     * @static
     * @type {string}
     * @memberof ComponentMessageType
     */
    public static COMPONENT_CLOSED:string = "componentClosed";
}