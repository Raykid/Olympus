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
     * @param {(keyOrPath?:string, assets?:any)=>void} [oneComplete] 一个资源加载完毕会调用这个回调，如果有的话。仅在keyOrPath是数组情况下生效
     * @returns {void}
     * @memberof AssetsManager
     */
    loadAssets(keyOrPath: string | string[], complete: (assets?: any | any[]) => void, responseType?: XMLHttpRequestResponseType, oneComplete?: (keyOrPath?: string, assets?: any) => void): void;
    /**
     * 加载CSS样式文件
     *
     * @param {string[]} cssFiles 样式文件URL列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @memberof AssetsManager
     */
    loadStyleFiles(cssFiles: string[], handler: (err?: Error) => void): void;
    /**
     * 加载JS文件
     *
     * @param {JSFile[]} jsFiles js文件列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @memberof AssetsManager
     */
    loadJsFiles(jsFiles: JSFile[], handler: (err?: Error) => void, ordered?: boolean): void;
}
export declare enum JSLoadMode {
    AUTO = 0,
    JSONP = 1,
    TAG = 2,
}
export interface JSFileData {
    url: string;
    mode?: JSLoadMode;
}
export declare type JSFile = string | JSFileData;
/** 再额外导出一个单例 */
export declare const assetsManager: AssetsManager;
