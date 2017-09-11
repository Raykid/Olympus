import RequestMessage from "./RequestMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 请求策略，根据使用的策略不同，请求的行为也会有所不同，例如使用HTTP或者Socket
*/
export default interface IRequestPolicy
{
    /**
     * 消息域名
     * 
     * @type {string}
     * @memberof IRequestPolicy
     */
    readonly host:string;
    /**
     * 消息地址
     * 
     * @type {string}
     * @memberof IRequestPolicy
     */
    readonly path:string;
    /**
     * 协议类型
     * 
     * @type {string}
     * @memberof IRequestPolicy
     */
    readonly protocol:string;
    /**
     * 发送请求逻辑
     * 
     * @param {string} url 目标url
     * @param {*} data 消息数据
     * @memberof IRequestPolicy
     */
    sendRequest(url:string, data?:any):void;
}