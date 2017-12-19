/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * External类为window.external参数字典包装类
*/
export default class WindowExternal {
    private _params;
    /**
     * 获取全部window.external参数
     *
     * @readonly
     * @type {{[key:string]:string}}
     * @memberof WindowExternal
     */
    readonly params: {
        [key: string]: string;
    };
    constructor();
    /**
     * 获取window.external中的参数
     *
     * @param {string} key 参数名
     * @returns {*} 参数值
     * @memberof External
     */
    getParam(key: string): any;
}
/** 再额外导出一个单例 */
export declare const windowExternal: WindowExternal;
