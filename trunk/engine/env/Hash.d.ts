/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
*/
export default class Hash {
    private _hash;
    /**
     * 获取原始的哈希字符串
     *
     * @readonly
     * @type {string}
     * @memberof Hash
     */
    readonly hash: string;
    private _moduleName;
    /**
     * 获取模块名
     *
     * @readonly
     * @type {string}
     * @memberof Hash
     */
    readonly moduleName: string;
    private _params;
    /**
     * 获取传递给模块的参数
     *
     * @readonly
     * @type {{[key:string]:string}}
     * @memberof Hash
     */
    readonly params: {
        [key: string]: string;
    };
    private _direct;
    /**
     * 获取是否直接跳转模块
     *
     * @readonly
     * @type {boolean}
     * @memberof Hash
     */
    readonly direct: boolean;
    private _keepHash;
    /**
     * 获取是否保持哈希值
     *
     * @readonly
     * @type {boolean}
     * @memberof Hash
     */
    readonly keepHash: boolean;
    constructor();
    /**
     * 获取指定哈希参数
     *
     * @param {string} key 参数名
     * @returns {string} 参数值
     * @memberof Hash
     */
    getParam(key: string): string;
}
/** 再额外导出一个单例 */
export declare const hash: Hash;
