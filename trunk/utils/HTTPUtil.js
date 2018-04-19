import { environment } from "../engine/env/Environment";
import { validateProtocol, joinQueryParams, trimURL } from "./URLUtil";
import { cloneObject } from "./ObjectUtil";
/**
 * 发送一个或多个HTTP请求
 *
 * @export
 * @param {IHTTPRequestParams} params 请求参数
 */
export function load(params) {
    // 非空判断
    if (!params.url) {
        // 成功回调
        params.onResponse && params.onResponse();
        return;
    }
    // 数组判断
    if (params.url instanceof Array) {
        // 一次请求多个地址，需要做一个队列加载，然后一次性回调
        var urls = params.url;
        var results = [];
        var newParams = cloneObject(params);
        newParams.onResponse = function (result) {
            results.push(result);
            loadNext();
        };
        var loadNext = function () {
            if (urls.length <= 0) {
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
    var retryTimes = params.retryTimes || 2;
    var timeout = params.timeout || 10000;
    var method = params.method || "GET";
    var timeoutId = 0;
    var data = params.data || {};
    // 取到url
    var url = params.url;
    if (params.useCDN) {
        // 如果使用CDN则改用cdn域名
        url = environment.toCDNHostURL(url);
    }
    else {
        // 合法化protocol
        url = validateProtocol(url, params.forceHTTPS ? "https:" : null);
        // 规整一下url
        url = trimURL(url);
    }
    // 生成xhr
    var xhr = (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0 ? new window["XDomainRequest"]() : window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    // 发送
    send();
    function send() {
        var sendData = null;
        // 根据发送方式组织数据格式
        switch (method) {
            case "POST":
                switch (params.headerDict && params.headerDict["Content-Type"]) {
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
        if (params.responseType)
            xhr.responseType = params.responseType;
        // 如果需要withCredentials，则设置之
        if (params.withCredentials)
            xhr.withCredentials = true;
        xhr.onload = onLoad;
        xhr.onerror = onError;
        // 添加自定义请求头，如果可以的话
        if (xhr.setRequestHeader) {
            for (var key in params.headerDict) {
                xhr.setRequestHeader(key, params.headerDict[key]);
            }
        }
        // 开始发送
        xhr.send(sendData);
        // 开始计时
        timeoutId = window.setTimeout(abortAndRetry, timeout);
    }
    function onLoad(evt) {
        // 即使是onLoad也要判断下状态码，但如果没有状态码，比如说XDomainRequest就直接认为成功了
        var statusHead = xhr.status ? Math.floor(xhr.status * 0.01) : 2;
        switch (statusHead) {
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
    function onError() {
        // 停止计时
        timeoutId && clearTimeout(timeoutId);
        timeoutId = 0;
        // 失败重试
        if (retryTimes > 0) {
            // 没有超过重试上限则重试
            abortAndRetry();
        }
        else {
            // 出错，如果使用CDN功能则尝试切换
            if (params.useCDN && !environment.nextCDN()) {
                // 还没切换完，重新加载
                load(params);
            }
            else {
                // 切换完了还失败，则汇报错误
                var err = new Error(xhr.status ? xhr.status + " " + xhr.statusText : "请求错误，且无法获取错误信息");
                params.onError && params.onError(err);
            }
        }
    }
    function abortAndRetry() {
        // 重试次数递减
        retryTimes--;
        // 中止xhr
        xhr.abort();
        // 添加时间戳作为随机版本号
        url = joinQueryParams(url, { _r: Date.now() });
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
export function toFormParams(data) {
    var keys = Object.keys(data);
    var params = keys.map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    });
    return params.join("&");
}
