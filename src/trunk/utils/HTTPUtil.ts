import { environment } from "../engine/env/Environment";
import { validateProtocol, joinQueryParams } from "./URLUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-12
 * @modify date 2017-10-12
 * 
 * HTTP请求工具
*/

// export type HTTPMethod = "GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"PATCH"|"MOVE"|"COPY"|"LINK"|"UNLINK"|"WRAPPED"|"Extension-mothed";
export type HTTPMethod = "GET"|"POST";

export interface IHTTPRequestParams
{
    /**
     * url地址
     * 
     * @type {string}
     * @memberof HTTPRequestPolicy
     */
    url:string;
    /**
     * 要发送的数据
     * 
     * @type {*}
     * @memberof IHTTPRequestParams
     */
    data?:any;
    /**
     * 是否使用CDN域名和CDN切换机制，默认是false
     * 
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    useCDN?:boolean;
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
    /**
     * 成功回调
     * 
     * @memberof IHTTPRequestParams
     */
    onResponse?:(result:any)=>void;
    /**
     * 失败回调
     * 
     * @memberof IHTTPRequestParams
     */
    onError?:(err:Error)=>void;
}

/**
 * 发送一个HTTP请求，无视CDN，不进行CDN切换
 * 
 * @export
 * @param {IHTTPRequestParams} params 请求参数
 */
export function load(params:IHTTPRequestParams):void
{
    var retryTimes:number = params.retryTimes || 2;
    var timeout:number = params.timeout || 10000;
    var method:HTTPMethod = params.method || "GET";
    var timeoutId:number = 0;
    var data:any = params.data || {};
    // 取到url
    var url:string = params.url;
    // 如果使用CDN则改用cdn域名
    if(params.useCDN) url = environment.toCDNHostURL(url);
    // 合法化一下protocol
    url = validateProtocol(url);
    // 生成并初始化xhr
    var xhr:XMLHttpRequest = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    xhr.onreadystatechange = onReadyStateChange;
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
                xhr.setRequestHeader("withCredentials", "true");
                xhr.send(JSON.stringify(data));
                break;
            case "GET":
                // 将数据添加到url上
                url = joinQueryParams(url, data);
                xhr.open(method, url, true);
                xhr.setRequestHeader("withCredentials", "true");
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
                        params.onResponse && params.onResponse(xhr.responseText);
                    }
                    else if(retryTimes > 0)
                    {
                        // 没有超过重试上限则重试
                        abortAndRetry();
                    }
                    else
                    {
                        // 出错，如果使用CDN功能则尝试切换
                        if(params.useCDN && !environment.nextCDN())
                        {
                            // 还没切换完，重新加载
                            load(params);
                        }
                        else
                        {
                            // 切换完了还失败，则汇报错误
                            var err:Error = new Error(xhr.status + " " + xhr.statusText);
                            params.onError && params.onError(err);
                        }
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