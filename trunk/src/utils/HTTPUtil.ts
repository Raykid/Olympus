import { environment } from "../engine/env/Environment";
import { validateProtocol, joinQueryParams, trimURL } from "./URLUtil";
import { cloneObject } from "./ObjectUtil";

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
     * url地址或者url地址数组
     * 
     * @type {string|string[]}
     * @memberof HTTPRequestPolicy
     */
    url:string|string[];
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
     * 是否强制使用https，默认是false
     * 
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    forceHTTPS?:boolean;
    /**
     * HTTP方法类型，默认是GET
     * 
     * @type {HTTPMethod}
     * @memberof HTTPRequestPolicy
     */
    method?:HTTPMethod;
    /**
     * 是否使用withCredentials，默认是false
     * 
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    withCredentials?:boolean;
    /**
     * HTTP返回值类型，从XMLHttpRequestResponseType查找枚举值
     * 
     * @type {XMLHttpRequestResponseType}
     * @memberof IHTTPRequestParams
     */
    responseType?:XMLHttpRequestResponseType;
    /**
     * HTTP请求头字典，如果有需要的请求头则放在这里
     * 
     * @type {{[key:string]:string}}
     * @memberof IHTTPRequestParams
     */
    headerDict?:{[key:string]:string};
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
     * 成功回调，只加一个地址时返回结果，一次加载多个地址时返回结果数组
     * 
     * @memberof IHTTPRequestParams
     */
    onResponse?:(result?:any|any[])=>void;
    /**
     * 失败回调
     * 
     * @memberof IHTTPRequestParams
     */
    onError?:(err:Error)=>void;
}

/**
 * 发送一个或多个HTTP请求
 * 
 * @export
 * @param {IHTTPRequestParams} params 请求参数
 */
export function load(params:IHTTPRequestParams):void
{
    // 非空判断
    if(!params.url)
    {
        // 成功回调
        params.onResponse && params.onResponse();
        return;
    }
    // 数组判断
    if(params.url instanceof Array)
    {
        // 一次请求多个地址，需要做一个队列加载，然后一次性回调
        var urls:string[] = params.url;
        var results:any[] = [];
        var newParams:IHTTPRequestParams = cloneObject(params);
        newParams.onResponse = function(result:any):void
        {
            results.push(result);
            loadNext();
        };
        var loadNext:()=>void = function():void
        {
            if(urls.length <= 0)
            {
                // 成功回调
                params.onResponse && params.onResponse(results);
                return;
            }
            newParams.url = urls.shift();
            load(newParams);
        };
        loadNext();
        return;
    }
    // 一次请求一个地址
    var retryTimes:number = params.retryTimes || 2;
    var timeout:number = params.timeout || 10000;
    var method:HTTPMethod = params.method || "GET";
    var timeoutId:number = 0;
    var data:any = params.data || {};
    // 取到url
    var url:string = params.url;
    if(params.useCDN)
    {
        // 如果使用CDN则改用cdn域名
        url = environment.toCDNHostURL(url);
    }
    else
    {
        // 合法化protocol
        url = validateProtocol(url, params.forceHTTPS ? "https:" : null);
        // 规整一下url
        url = trimURL(url);
    }
    // 生成xhr
    var xhr:XMLHttpRequest = (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0 ? new window["XDomainRequest"]() : window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    // 发送
    send();

    function send():void
    {
        var sendData:string = null;
        // 根据发送方式组织数据格式
        switch(method)
        {
            case "POST":
                switch(params.headerDict && params.headerDict["Content-Type"])
                {
                    case "application/x-www-form-urlencoded":
                        sendData = toFormParams(data);
                        break;
                    default:
                        sendData = JSON.stringify(data);
                        break;
                }
                break;
            case "GET":
                // 将数据添加到url上
                url = joinQueryParams(url, data);
                break;
            default:
                throw new Error("暂不支持的HTTP Method：" + method);
        }
        // 打开XHR
        xhr.open(method, url, true);
        // 初始化，responseType必须在open之后设置，否则IE10和IE11会报错
        if(params.responseType) xhr.responseType = params.responseType;
        // 如果需要withCredentials，则设置之
        if(params.withCredentials) xhr.withCredentials = true;
        xhr.onload = onLoad;
        xhr.onerror = onError;
        // 添加自定义请求头，如果可以的话
        if(xhr.setRequestHeader)
        {
            for(var key in params.headerDict)
            {
                xhr.setRequestHeader(key, params.headerDict[key]);
            }
        }
        // 开始发送
        xhr.send(sendData);
        // 开始计时
        timeoutId = window.setTimeout(abortAndRetry, timeout);
    }

    function onLoad(evt:Event):void
    {
        // 即使是onLoad也要判断下状态码，但如果没有状态码，比如说XDomainRequest就直接认为成功了
        var statusHead:number = xhr.status ? Math.floor(xhr.status * 0.01) : 2;
        switch(statusHead)
        {
            case 2:
            case 3:
                // 2xx和3xx的状态码认为是成功
                timeoutId && clearTimeout(timeoutId);
                timeoutId = 0;
                // 成功回调
                params.onResponse && params.onResponse(xhr.response || xhr.responseText);
                break;
            case 4:
            case 5:
                // 4xx和5xx的状态码认为是错误，转调错误回调
                onError();
                break;
        }
    }

    function onError():void
    {
        // 停止计时
        timeoutId && clearTimeout(timeoutId);
        timeoutId = 0;
        // 失败重试
        if(retryTimes > 0)
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
                var err:Error = new Error(xhr.status ? xhr.status + " " + xhr.statusText : "请求错误，且无法获取错误信息");
                params.onError && params.onError(err);
            }
        }
    }

    function abortAndRetry():void
    {
        // 重试次数递减
        retryTimes --;
        // 中止xhr
        xhr.abort();
        // 添加时间戳作为随机版本号
        url = joinQueryParams(url, {_r: Date.now()});
        // 重新发送
        send();
    }
}

/**
 * 将数据转换为form形式
 * 
 * @export
 * @param {*} data 要转换的数据
 * @returns {string} 转换结果字符串
 */
export function toFormParams(data:any):string
{
    var keys:string[] = Object.keys(data);
    var params:string[] = keys.map((key:string)=>{
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    });
    return params.join("&");
}