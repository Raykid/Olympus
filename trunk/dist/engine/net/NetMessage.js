/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 通讯相关的消息
*/
var NetMessage = /** @class */ (function () {
    function NetMessage() {
    }
    /**
     * 发送网络请求消息
     *
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    NetMessage.NET_REQUEST = "netRequest";
    /**
     * 接受网络返回消息
     *
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    NetMessage.NET_RESPONSE = "netResponse";
    /**
     * 网络请求错误消息
     *
     * @static
     * @type {string}
     * @memberof NetMessage
     */
    NetMessage.NET_ERROR = "netError";
    return NetMessage;
}());
export default NetMessage;
