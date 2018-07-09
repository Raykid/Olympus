/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 表现层消息类型
*/
var BridgeMessageType = /** @class */ (function () {
    function BridgeMessageType() {
    }
    /**
     * 初始化表现层实例前的消息
     *
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    BridgeMessageType.BRIDGE_BEFORE_INIT = "bridgeBeforeInit";
    /**
     * 初始化表现层实例后的消息
     *
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    BridgeMessageType.BRIDGE_AFTER_INIT = "bridgeAfterInit";
    /**
     * 所有表现层实例都初始化完毕的消息
     *
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    BridgeMessageType.BRIDGE_ALL_INIT = "bridgeAllInit";
    return BridgeMessageType;
}());
export default BridgeMessageType;
