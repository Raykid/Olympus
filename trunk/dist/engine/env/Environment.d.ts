/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 环境参数
*/
export default class Environment {
    protected _env: string;
    /**
     * 获取当前环境字符串
     *
     * @readonly
     * @type {string}
     * @memberof Environment
     */
    readonly env: string;
    private _hostsDict;
    /**
     * 获取域名字典
     *
     * @readonly
     * @type {{[env:string]:string[]}}
     * @memberof Environment
     */
    readonly hostsDict: {
        [env: string]: string[];
    };
    /**
     * 获取当前环境下某索引处的消息域名
     *
     * @param {number} [index=0] 域名字典索引，默认是0
     * @returns {string} 域名字符串，如果取不到则使用当前域名
     * @memberof Environment
     */
    getHost(index?: number): string;
    private _cdnsDict;
    /**
     * 获取CDN字典
     *
     * @readonly
     * @type {{[env:string]:string[]}}
     * @memberof Environment
     */
    readonly cdnsDict: {
        [env: string]: string[];
    };
    private _curCDNIndex;
    /**
     * 获取当前使用的CDN域名
     *
     * @readonly
     * @type {string}
     * @memberof Environment
     */
    readonly curCDNHost: string;
    /**
     * 切换下一个CDN
     *
     * @returns {boolean} 是否已经到达CDN列表的终点，回到了起点
     * @memberof Environment
     */
    nextCDN(): boolean;
    /**
     * 初始化Environment对象，因为该对象保存的数据基本来自项目初始参数，所以必须有initialize方法
     *
     * @param {string} [env] 当前所属环境字符串
     * @param {{[env:string]:string[]}} [hostsDict] host数组字典
     * @param {{[env:string]:string[]}} [cdnsDict] cdn数组字典
     * @memberof Environment
     */
    initialize(env?: string, hostsDict?: {
        [env: string]: string[];
    }, cdnsDict?: {
        [env: string]: string[];
    }): void;
    /**
     * 让url的域名变成消息域名
     *
     * @param {string} url 要转变的url
     * @param {number} [index=0] host索引，默认0
     * @returns {string} 转变后的url
     * @memberof Environment
     */
    toHostURL(url: string, index?: number): string;
    /**
     * 让url的域名变成CDN域名
     *
     * @param {string} url 要转变的url
     * @param {boolean} [forced=false] 是否强制替换host
     * @param {boolean} [infix=true] 是否加入路径中缀，即host之后，index.html之前的部分，默认加入
     * @returns {string} 转变后的url
     * @memberof Environment
     */
    toCDNHostURL(url: string, forced?: boolean, infix?: boolean): string;
}
/** 再额外导出一个单例 */
export declare const environment: Environment;
