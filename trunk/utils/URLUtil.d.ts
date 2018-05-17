/**
 * 获取当前页面的origin，会兼容IE10以下
 *
 * @export
 * @returns {string}
 */
export declare function getCurOrigin(): string;
/**
 * 规整url
 * @param url
 */
export declare function trimURL(url: string): string;
/**
 * 检查URL是否是绝对路径（具有协议头）
 * @param url 要判断的URL
 * @returns {any} 是否是绝对路径
 */
export declare function isAbsolutePath(url: string): boolean;
/**
 * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
 * @param url 要统一protocol的url
 * @param {string} [protocol] 要统一成的protocol，不传则根据当前页面的protocol使用。根据标准，protocol是要携带:的，比如“http:”
 */
export declare function validateProtocol(url: string, protocol?: string): string;
/**
 * 替换url中的host，如果传入的是绝对路径且forced为false，则不会合法化protocol
 * @param url       url
 * @param host      要替换的host
 * @param forced    是否强制替换（默认false）
 */
export declare function wrapHost(url: string, host: string, forced?: boolean): string;
/**
 * 将相对于当前页面的相对路径包装成绝对路径
 * @param relativePath 相对于当前页面的相对路径
 * @param host 传递该参数会用该host替换当前host
 */
export declare function wrapAbsolutePath(relativePath: string, host?: string): string;
/**
 * 获取URL的host+pathname部分，即问号(?)以前的部分
 *
 */
export declare function getHostAndPathname(url: string): string;
/**
 * 获取URL路径（文件名前的部分）
 * @param url 要分析的URL
 */
export declare function getPath(url: string): string;
/**
 * 获取URL的文件名
 * @param url 要分析的URL
 */
export declare function getName(url: string): string;
/**
 * 解析URL
 * @param url 要被解析的URL字符串
 * @returns {any} 解析后的URLLocation结构体
 */
export declare function parseUrl(url: string): URLLocation;
/**
 * 解析url查询参数
 * @TODO 添加对jquery编码方式的支持
 * @param url url
 */
export declare function getQueryParams(url: string): {
    [key: string]: string;
};
/**
 * 将参数连接到指定URL后面
 * @param url url
 * @param params 一个map，包含要连接的参数
 * @return string 连接后的URL地址
 */
export declare function joinQueryParams(url: string, params: Object): string;
/**
 * 将参数链接到URL的hash后面
 * @param url 如果传入的url没有注明hash模块，则不会进行操作
 * @param params 一个map，包含要连接的参数
 */
export declare function joinHashParams(url: string, params: Object): string;
export interface URLLocation {
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
}
