import {wrapHost, validateProtocol, joinQueryParams} from "../../../utils/URLUtil"
import IRequestPolicy from "../IRequestPolicy"
import RequestData, {IRequestParams} from "../RequestData"
import HTTPMethod from "../HTTPMethod"
import {__onResponse, __onError} from "../NetManager"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * HTTP请求策略
*/

export interface IHTTPRequestParams extends IRequestParams
{
    /**
     * 消息域名
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    host:string;
    /**
     * 消息地址
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    path:string;
    /**
     * HTTP方法类型，默认是GET
     * 
     * @type {HTTPMethod}
     * @memberof HTTPRequestPolicy
     */
    method?:HTTPMethod;
    /**
     * 失败重试次数，默认重试2次
     * 
     * @type {number}
     * @memberof HTTPRequestPolicy
     */
    retryTimes?:number;
    /**
     * 超时时间，毫秒，默认10000，即10秒
     * 
     * @type {number}
     * @memberof HTTPRequestPolicy
     */
    timeout?:number;
}

export default class HTTPRequestPolicy implements IRequestPolicy
{
    /**
     * 发送请求逻辑
     * 
     * @param {IHTTPRequestParams} params HTTP请求数据
     * @memberof HTTPRequestPolicy
     */
    public sendRequest(request:RequestData):void
    {
        var params:IRequestParams = request.__params;
        var retryTimes:number = params.retryTimes || 2;
        var timeout:number = params.timeout || 10000;
        var method:HTTPMethod = params.method || "GET";
        var timeoutId:number = 0;
        // 取到url
        var url:string = wrapHost(params.path, params.host, true);
        // 合法化一下protocol
        url = validateProtocol(url);
        // 生成并初始化xhr
        var xhr:XMLHttpRequest = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
        xhr.onreadystatechange = onReadyStateChange;
        xhr.setRequestHeader("withCredentials", "true");
        // 发送
        send();

        function send():void
        {
            // 根据发送方式组织数据格式
            switch(method)
            {
                case "POST":
                    // POST目前规定为JSON格式发送
                    xhr.open(method, url, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(params.data));
                    break;
                case "GET":
                    // 将数据添加到url上
                    url = joinQueryParams(url, params.data);
                    xhr.open(method, url, true);
                    xhr.send(null);
                    break;
                default:
                    throw new Error("暂不支持的HTTP Method：" + method);
            }
        }

        function onReadyStateChange():void
        {
            switch(xhr.readyState)
            {
                case 2:// 已经发送，开始计时
                    timeoutId = setTimeout(abortAndRetry, timeout);
                    break;
                case 4:// 接收完毕
                    // 停止计时
                    timeoutId && clearTimeout(timeoutId);
                    timeoutId = 0;
                    try
                    {
                        if(xhr.status == 200)
                        {
                            // 成功回调
                            var result:any = JSON.parse(xhr.responseText);
                            __onResponse(result, request);
                        }
                        else if(retryTimes > 0)
                        {
                            // 没有超过重试上限则重试
                            abortAndRetry();
                        }
                        else
                        {
                            // 出错回调
                            var err:Error = new Error(xhr.status + " " + xhr.statusText);
                            __onError(err, request);
                        }
                    }
                    catch(err)
                    {
                        console.error(err.message);
                    }
                    break;
            }
        }

        function abortAndRetry():void
        {
            // 重试次数递减
            retryTimes --;
            // 中止xhr
            xhr.abort();
            // 重新发送
            send();
        }
    }
}

/** 再额外导出一个实例 */
export const httpRequestPolicy:HTTPRequestPolicy = new HTTPRequestPolicy();