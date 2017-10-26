import RequestData from "./RequestData";

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
     * 发送请求逻辑
     * 
     * @param {RequestData} request 请求
     * @memberof IRequestPolicy
     */
    sendRequest(request:RequestData):void;
}