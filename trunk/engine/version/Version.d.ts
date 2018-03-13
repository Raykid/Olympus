/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 管理文件哈希版本号
*/
export default class Version {
    private _hashDict;
    /**
     * 初始化哈希版本工具
     *
     * @param {()=>void} handler 回调
     * @param {string} [host] version.cfg文件加载域名，不传则使用当前域名
     * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     * @memberof Version
     */
    initialize(handler: () => void, host?: string, version?: string): void;
    /**
     * 获取文件哈希值，如果没有文件哈希值则返回null
     *
     * @param {string} url 文件的URL
     * @returns {string} 文件的哈希值，或者null
     * @memberof Version
     */
    getHash(url: string): string;
    /**
     * 将url转换为哈希版本url
     *
     * @param {string} url 原始url
     * @returns {string} 哈希版本url
     * @memberof Version
     */
    wrapHashUrl(url: string): string;
    /**
     * 添加-r_XXX形式版本号
     *
     * @param {string} url
     * @param {string} version 版本号，以数字和小写字母组成
     * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
     * @memberof Version
     */
    joinVersion(url: string, version: string): string;
    /**
     * 移除-r_XXX形式版本号
     *
     * @param {string} url url
     * @returns {string} 移除版本号后的url
     * @memberof Version
     */
    removeVersion(url: string): string;
}
/** 再额外导出一个单例 */
export declare const version: Version;
