/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 表现层消息
*/
export default class BridgeMessage
{
    /**
     * 初始化表现层实例前的消息
     * 
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    public static BRIDGE_BEFORE_INIT:string = "bridgeBeforeInit";
    /**
     * 初始化表现层实例后的消息
     * 
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    public static BRIDGE_AFTER_INIT:string = "bridgeAfterInit";
    /**
     * 所有表现层实例都初始化完毕的消息
     * 
     * @static
     * @type {string}
     * @memberof ViewMessage
     */
    public static BRIDGE_ALL_INIT:string = "bridgeAllInit";
}