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
    private _moduleDataDict;
    private _moduleDatas;
    /**
     * 获取模块跳转数据数组
     *
     * @readonly
     * @type {IHashModuleData[]}
     * @memberof Hash
     */
    readonly moduleDatas: IHashModuleData[];
    /**
     * 获取传递给首模块的参数，首模块数据的传递方式为位于第一个#后且不填写模块名
     *
     * @readonly
     * @type {*}
     * @memberof Hash
     */
    readonly firstModuleParams: any;
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
     * @param {string} [moduleName] 参数所属模块名，不传则获取第一个模块的参数
     * @returns {string} 参数值
     * @memberof Hash
     */
    getParam(key: string, moduleName?: string): string;
}
export interface IHashModuleData {
    name: string;
    params: any;
    direct: boolean;
}
/** 再额外导出一个单例 */
export declare const hash: Hash;
