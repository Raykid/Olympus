import { extendObject } from "./ObjectUtil";
/**
 * 获取当前页面的origin，会兼容IE10以下
 *
 * @export
 * @returns {string}
 */
export function getCurOrigin() {
    if (window.location.origin)
        return window.location.origin;
    return (window.location.protocol + "//" + window.location.host);
}
/**
 * 规整url
 * @param url
 */
export function trimURL(url) {
    // 去除多余的"/"
    url = url.replace(/([^:\/]|(:\/))\/+/g, "$1/");
    if (url.charAt(0) == "/")
        url = url.substr(1);
    // 处理非紧贴域名的"/xx/../"
    var reg = /(?!:\/{2,}[^\/]+\/)([^\/\.]+)\/[^\/\.]+?\/\.\.\//;
    while (reg.test(url)) {
        url = url.replace(reg, "/$1");
    }
    // 处理"/./"和剩余的"/../"，直接丢弃之
    var reg = /\/\.{1,2}\//;
    while (reg.test(url)) {
        url = url.replace(reg, "/");
    }
    return url;
}
/**
 * 检查URL是否是绝对路径（具有协议头）
 * @param url 要判断的URL
 * @returns {any} 是否是绝对路径
 */
export function isAbsolutePath(url) {
    if (url == null)
        return false;
    return (url.indexOf("://") >= 0);
}
/**
 * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
 * @param url 要统一protocol的url
 * @param {string} [protocol] 要统一成的protocol，不传则根据当前页面的protocol使用。根据标准，protocol是要携带:的，比如“http:”
 */
export function validateProtocol(url, protocol) {
    if (url == null)
        return null;
    var index = url.indexOf("://");
    if (index < 0)
        return url;
    // 因为protocol是要携带:的，所以index自加1
    index++;
    if (protocol) {
        // 直接使用传递的protocol
        return protocol + url.substr(index);
    }
    else {
        protocol = url.substring(0, index);
        // 调整http和https
        if (protocol == "http:" || protocol == "https:") {
            return window.location.protocol + url.substr(index);
        }
        // 调整ws和wss
        if (protocol == "ws:" || protocol == "wss:") {
            if (window.location.protocol == "https:")
                protocol = "wss:";
            else
                protocol = "ws:";
            return protocol + url.substr(index);
        }
        // 不需要调整
        return url;
    }
}
/**
 * 替换url中的host，如果传入的是绝对路径且forced为false，则不会合法化protocol
 * @param url       url
 * @param host      要替换的host
 * @param forced    是否强制替换（默认false）
 */
export function wrapHost(url, host, forced) {
    if (forced === void 0) { forced = false; }
    if (url == null)
        return url;
    host = host || getCurOrigin();
    var re = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
    var arr = url.match(re);
    if (arr && arr.length > 0) {
        if (forced) {
            url = url.substr(arr[0].length);
            url = host + "/" + url;
            // 合法化一下protocol
            url = validateProtocol(url);
        }
    }
    else {
        url = host + "/" + url;
        // 合法化一下protocol
        url = validateProtocol(url);
    }
    // 最后规整一下url
    url = trimURL(url);
    return url;
}
/**
 * 将相对于当前页面的相对路径包装成绝对路径
 * @param relativePath 相对于当前页面的相对路径
 * @param host 传递该参数会用该host替换当前host
 */
export function wrapAbsolutePath(relativePath, host) {
    // 获取当前页面的url
    var curPath = getPath(window.location.href);
    var url = trimURL(curPath + "/" + relativePath);
    if (host != null) {
        url = wrapHost(url, host, true);
    }
    return url;
}
/**
 * 获取URL的host+pathname部分，即问号(?)以前的部分
 *
 */
export function getHostAndPathname(url) {
    if (url == null)
        throw new Error("url不能为空");
    // 去掉get参数和hash
    url = url.split("#")[0].split("?")[0];
    // 去掉多余的/
    url = trimURL(url);
    return url;
}
/**
 * 获取URL路径（文件名前的部分）
 * @param url 要分析的URL
 */
export function getPath(url) {
    // 首先去掉多余的/
    url = getHostAndPathname(url);
    // 然后获取到路径
    var urlArr = url.split("/");
    urlArr.pop();
    return urlArr.join("/") + "/";
}
/**
 * 获取URL的文件名
 * @param url 要分析的URL
 */
export function getName(url) {
    // 先去掉get参数和hash
    url = url.split("#")[0].split("?")[0];
    // 然后获取到文件名
    var urlArr = url.split("/");
    var fileName = urlArr[urlArr.length - 1];
    return fileName;
}
/**
 * 解析URL
 * @param url 要被解析的URL字符串
 * @returns {any} 解析后的URLLocation结构体
 */
export function parseUrl(url) {
    var regExp = /(([^:]+:)\/{2,}(([^:\/\?#]+)(:(\d+))?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
    var match = regExp.exec(url);
    if (match) {
        return {
            href: match[0] || "",
            origin: match[1] || "",
            protocol: match[2] || "",
            host: match[3] || "",
            hostname: match[4] || "",
            port: match[6] || "",
            pathname: match[7] || "",
            search: match[8] || "",
            hash: (match[9] == "#" ? "" : match[9]) || ""
        };
    }
    else {
        throw new Error("传入parseUrl方法的参数不是一个完整的URL：" + url);
    }
}
/**
 * 解析url查询参数
 * @TODO 添加对jquery编码方式的支持
 * @param url url
 */
export function getQueryParams(url) {
    var index = url.indexOf("#");
    if (index >= 0) {
        url = url.substring(0, index);
    }
    index = url.indexOf("?");
    if (index < 0)
        return {};
    var queryString = url.substring(index + 1);
    var params = {};
    var kvs = queryString.split("&");
    for (var _i = 0, kvs_1 = kvs; _i < kvs_1.length; _i++) {
        var kv = kvs_1[_i];
        var pair = kv.split("=", 2);
        if (pair.length !== 2 || !pair[0]) {
            console.log("[URLUtil] invalid query params: " + kv);
            continue;
        }
        var name = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        params[name] = value;
    }
    return params;
}
/**
 * 将参数连接到指定URL后面
 * @param url url
 * @param params 一个map，包含要连接的参数
 * @return string 连接后的URL地址
 */
export function joinQueryParams(url, params) {
    if (url == null)
        throw new Error("url不能为空");
    var oriParams = getQueryParams(url);
    var targetParams = extendObject(oriParams, params);
    var hash = parseUrl(url).hash;
    url = getHostAndPathname(url);
    var isFirst = true;
    for (var key in targetParams) {
        if (isFirst) {
            url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
            isFirst = false;
        }
        else {
            url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
        }
    }
    // 加上hash
    url += hash;
    return url;
}
/**
 * 将参数链接到URL的hash后面
 * @param url 如果传入的url没有注明hash模块，则不会进行操作
 * @param params 一个map，包含要连接的参数
 */
export function joinHashParams(url, params) {
    if (url == null)
        throw new Error("url不能为空");
    var hash = parseUrl(url).hash;
    if (hash == null || hash == "")
        return url;
    for (var key in params) {
        var value = params[key];
        if (value && typeof value != "string")
            value = value.toString();
        hash += ((hash.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return (url.split("#")[0] + hash);
}
