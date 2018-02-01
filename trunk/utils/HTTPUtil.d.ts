/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-12
 * @modify date 2017-10-12
 *
 * HTTP请求工具
*/
export declare type HTTPMethod = "GET" | "POST";
export interface IHTTPRequestParams {
    /**
     * url地址或者url地址数组
     *
     * @type {string|string[]}
     * @memberof HTTPRequestPolicy
     */
    url: string | string[];
    /**
     * 要发送的数据
     *
     * @type {*}
     * @memberof IHTTPRequestParams
     */
    data?: any;
    /**
     * 是否使用CDN域名和CDN切换机制，默认是false
     *
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    useCDN?: boolean;
    /**
     * 是否强制使用https，默认是false
     *
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    forceHTTPS?: boolean;
    /**
     * HTTP方法类型，默认是GET
     *
     * @type {HTTPMethod}
     * @memberof HTTPRequestPolicy
     */
    method?: HTTPMethod;
    /**
     * 是否使用withCredentials，默认是false
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
     * @type {boolean}
     * @memberof IHTTPRequestParams
     */
    withCredentials?: boolean;
    /**
     * HTTP返回值类型，从XMLHttpRequestResponseType查找枚举值
     *
     * @type {XMLHttpRequestResponseType}
     * @memberof IHTTPRequestParams
     */
    responseType?: XMLHttpRequestResponseType;
    /**
     * HTTP请求头字典，如果有需要的请求头则放在这里
     *
     * @type {{[key:string]:string}}
     * @memberof IHTTPRequestParams
     */
    headerDict?: {
        [key: string]: string;
    };
    /**
     * 失败重试次数，默认重试2次
     *
     * @type {number}
     * @memberof HTTPRequestPolicy
     */
    retryTimes?: number;
    /**
     * 超时时间，毫秒，默认10000，即10秒
     *
     * @type {number}
     * @memberof HTTPRequestPolicy
     */
    timeout?: number;
    /**
     * 成功回调，只加一个地址时返回结果，一次加载多个地址时返回结果数组
     *
     * @memberof IHTTPRequestParams
     */
    onResponse?: (result?: any | any[]) => void;
    /**
     * 失败回调
     *
     * @memberof IHTTPRequestParams
     */
    onError?: (err: Error) => void;
}
/**
 * 发送一个或多个HTTP请求
 *
 * @export
 * @param {IHTTPRequestParams} params 请求参数
 */
export declare function load(params: IHTTPRequestParams): void;
/**
 * 将数据转换为form形式
 *
 * @export
 * @param {*} data 要转换的数据
 * @returns {string} 转换结果字符串
 */
export declare function toFormParams(data: any): string;
