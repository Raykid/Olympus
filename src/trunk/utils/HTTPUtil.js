define(["require", "exports", "../engine/env/Environment", "./URLUtil", "./ObjectUtil"], function (require, exports, Environment_1, URLUtil_1, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 发送一个或多个HTTP请求
     *
     * @export
     * @param {IHTTPRequestParams} params 请求参数
     */
    function load(params) {
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
            var newParams = ObjectUtil_1.cloneObject(params);
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
            url = Environment_1.environment.toCDNHostURL(url);
        }
        else {
            // 合法化一下protocol
            url = URLUtil_1.validateProtocol(url);
            // 规整一下url
            url = URLUtil_1.trimURL(url);
        }
        // 生成并初始化xhr
        var xhr = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
        if (params.responseType)
            xhr.responseType = params.responseType;
        xhr.onreadystatechange = onReadyStateChange;
        // 发送
        send();
        function send() {
            var sendData = null;
            // 根据发送方式组织数据格式
            switch (method) {
                case "POST":
                    // POST目前规定为JSON格式发送
                    sendData = JSON.stringify(data);
                    break;
                case "GET":
                    // 将数据添加到url上
                    url = URLUtil_1.joinQueryParams(url, data);
                    break;
                default:
                    throw new Error("暂不支持的HTTP Method：" + method);
            }
            // 打开XHR
            xhr.open(method, url, true);
            // 添加自定义请求头
            for (var key in params.headerDict) {
                xhr.setRequestHeader(key, params.headerDict[key]);
            }
            // 开始发送
            xhr.send(sendData);
        }
        function onReadyStateChange() {
            switch (xhr.readyState) {
                case 2:// 已经发送，开始计时
                    timeoutId = setTimeout(abortAndRetry, timeout);
                    break;
                case 4:// 接收完毕
                    // 停止计时
                    timeoutId && clearTimeout(timeoutId);
                    timeoutId = 0;
                    if (xhr.status == 200) {
                        // 成功回调
                        params.onResponse && params.onResponse(xhr.response);
                    }
                    else if (retryTimes > 0) {
                        // 没有超过重试上限则重试
                        abortAndRetry();
                    }
                    else {
                        // 出错，如果使用CDN功能则尝试切换
                        if (params.useCDN && !Environment_1.environment.nextCDN()) {
                            // 还没切换完，重新加载
                            load(params);
                        }
                        else {
                            // 切换完了还失败，则汇报错误
                            var err = new Error(xhr.status + " " + xhr.statusText);
                            params.onError && params.onError(err);
                        }
                    }
                    break;
            }
        }
        function abortAndRetry() {
            // 重试次数递减
            retryTimes--;
            // 中止xhr
            xhr.abort();
            // 添加时间戳作为随机版本号
            url = URLUtil_1.joinQueryParams(url, { _r: Date.now() });
            // 重新发送
            send();
        }
    }
    exports.load = load;
});
//# sourceMappingURL=HTTPUtil.js.map