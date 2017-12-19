/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * Query类记录通过GET参数传递给框架的参数字典
*/
export default class Query {
    private _params;
    /**
     * 获取全部Query参数
     *
     * @readonly
     * @type {{[key:string]:string}}
     * @memberof Query
     */
    readonly params: {
        [key: string]: string;
    };
    constructor();
    /**
     * 获取GET参数
     *
     * @param {string} key 参数key
     * @returns {string} 参数值
     * @memberof Query
     */
    getParam(key: string): string;
}
/** 再额外导出一个单例 */
export declare const query: Query;
