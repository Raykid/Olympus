/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 通讯相关的消息
*/
export default class NetMessage
{
    /**
     * 发送网络请求消息
     * 
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    public static NET_REQUEST:string = "netRequest";
    /**
     * 接受网络返回消息
     * 
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    public static NET_RESPONSE:string = "netResponse";
    /**
     * 网络请求错误消息
     * 
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    public static NET_ERROR:string = "netError";
}