/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * Explorer类记录浏览器相关数据
*/
/**
 * 浏览器类型枚举
 *
 * @enum {number}
 */
export declare enum ExplorerType {
    IE = 0,
    EDGE = 1,
    OPERA = 2,
    FIREFOX = 3,
    SAFARI = 4,
    CHROME = 5,
    OTHERS = 6,
}
export default class Explorer {
    private _type;
    /**
     * 获取浏览器类型枚举值
     *
     * @readonly
     * @type {ExplorerType}
     * @memberof Explorer
     */
    readonly type: ExplorerType;
    private _typeStr;
    /**
     * 获取浏览器类型字符串
     *
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    readonly typeStr: string;
    private _version;
    /**
     * 获取浏览器版本
     *
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    readonly version: string;
    private _bigVersion;
    /**
     * 获取浏览器大版本
     *
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    readonly bigVersion: string;
    constructor();
}
/** 再额外导出一个单例 */
export declare const explorer: Explorer;
