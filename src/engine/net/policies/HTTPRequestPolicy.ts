import IRequestPolicy from "../IRequestPolicy"
import RequestMessage from "../RequestMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * HTTP请求策略
*/
export default class HTTPRequestPolicy implements IRequestPolicy
{
    /**
     * 消息域名
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    public host:string;
    /**
     * 消息地址
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    public path:string;
    /**
     * 协议类型
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    public protocol:string = "http"
    /**
     * HTTP请求方法
     * 
     * @type {HTTPMethod}
     * @memberof HTTPRequestPolicy
     */
    public method:HTTPMethod;

    public constructor(host:string, path:string, method:HTTPMethod)
    {
        this.host = host;
        this.path = path;
        this.method = method;
    }

    /**
     * 发送请求逻辑
     * 
     * @param {string} url 目标url
     * @param {*} data 消息数据
     * @memberof HTTPRequestPolicy
     */
    public sendRequest(url:string, data?:any):void
    {
        // TODO Raykid 等待完成
    }
}

/** 导出HTTP方法枚举 */
export type HTTPMethod = "GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"PATCH"|"MOVE"|"COPY"|"LINK"|"UNLINK"|"WRAPPED"|"Extension-mothed";