/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 *
 * 资源管理器
*/
export default class AssetsManager {
    private _keyDict;
    /**
     * 为路径配置短名称
     *
     * @param {string} key 路径短名称
     * @param {string} path 路径
     * @memberof AssetsManager
     */
    configPath(key: string, path: string): void;
    /**
     * 为路径配置短名称
     *
     * @param {{[key:string]:string}} params 路径短名称字典
     * @memberof AssetsManager
     */
    configPath(params: {
        [key: string]: string;
    }): void;
    private _assetsDict;
    /**
     * 获取资源，同步的，且如果找不到资源并不会触发加载
     *
     * @param {string} keyOrPath 资源的短名称或路径
     * @returns {*}
     * @memberof AssetsManager
     */
    getAssets(keyOrPath: string): any;
    /**
     * 加载资源，如果已加载过则同步回调，如果未加载则加载后异步回调
     *
     * @param {string|string[]} keyOrPath 资源短名称或资源路径
     * @param {(assets?:any|any[])=>void} complete 完成回调，如果加载失败则参数是个Error对象
     * @param {XMLHttpRequestResponseType} [responseType] 加载类型
     * @returns {void}
     * @memberof AssetsManager
     */
    loadAssets(keyOrPath: string | string[], complete: (assets?: any | any[]) => void, responseType?: XMLHttpRequestResponseType): void;
}
/** 再额外导出一个单例 */
export declare const assetsManager: AssetsManager;
