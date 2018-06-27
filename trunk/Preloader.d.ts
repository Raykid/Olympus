/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 *
 * 预加载器，负责预加载过程
*/
declare namespace olympus {
    /**
     * 获取当前页面的origin，会兼容IE10以下
     *
     * @returns {string}
     */
    function getCurOrigin(): string;
    /**
     * 规整url
     * @param url
     */
    function trimURL(url: string): string;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    function getHostAndPathname(url: string): string;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    function getPath(url: string): string;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    function isAbsolutePath(url: string): boolean;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    function validateProtocol(url: string): string;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    function wrapHost(url: string, host: string, forced?: boolean): string;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    function wrapAbsolutePath(relativePath: string, host?: string): string;
    /**
     * 预加载方法
     *
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {(err?:Error)=>void} [callback] 全部加载完成后的回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     */
    function preload(jsFiles: JSFile[], host?: string, callback?: (err?: Error) => void, ordered?: boolean, version?: string): void;
    enum JSLoadMode {
        AUTO = 0,
        JSONP = 1,
        TAG = 2,
    }
    interface JSFileData {
        url: string;
        mode?: JSLoadMode;
    }
    type JSFile = string | JSFileData;
}
