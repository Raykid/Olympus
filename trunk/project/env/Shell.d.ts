import IShell, { IShellProxyConstructor } from "./IShell";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-23
 * @modify date 2017-10-23
 *
 * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
*/
export default class Shell implements IShell {
    private _proxy;
    /**
     * 设置外壳代理，如果条件命中了该代理类型，则生成该代理实例并替代外壳行为
     *
     * @memberof Shell
     */
    proxy: IShellProxyConstructor;
    /**
     * 获取当前外壳类型
     *
     * @readonly
     * @type {string}
     * @memberof Shell
     */
    readonly type: string;
    /*************************** 下面是页面跳转接口 ***************************/
    /**
     * 刷新页面
     *
     * @param {{
     *         forcedReload?:boolean, // false表示允许从缓存取，true表示强制从服务器取，默认是false
     *         url?:string, // 传递则使用新URL刷新页面
     *         replace?:boolean // 如果有新url，则表示是否要替换当前浏览历史
     *     }} [params]
     * @memberof Shell
     */
    reload(params?: {
        forcedReload?: boolean;
        url?: string;
        replace?: boolean;
    }): void;
    /**
     * 打开一个新页面
     *
     * @param {{
     *         url?:string, // 新页面地址，不传则不更新地址
     *         name?:string, // 给新页面命名，或导航到已有页面
     *         replace?:boolean, // 是否替换当前浏览历史条目，默认false
     *         features:{[key:string]:any} // 其他可能的参数
     *     }} [params]
     * @memberof Shell
     */
    open(params?: {
        url?: string;
        name?: string;
        replace?: boolean;
        features: {
            [key: string]: any;
        };
    }): void;
    /**
     * 关闭窗口
     *
     * @memberof Shell
     */
    close(): void;
    /*************************** 下面是本地存储接口 ***************************/
    /**
     * 获取本地存储
     *
     * @param {string} key 要获取值的键
     * @returns {string} 获取的值
     * @memberof Shell
     */
    localStorageGet(key: string): string;
    /**
     * 设置本地存储
     *
     * @param {string} key 要设置的键
     * @param {string} value 要设置的值
     * @memberof Shell
     */
    localStorageSet(key: string, value: string): void;
    /**
     * 移除本地存储
     *
     * @param {string} key 要移除的键
     * @memberof Shell
     */
    localStorageRemove(key: string): void;
    /**
     * 清空本地存储
     *
     * @memberof Shell
     */
    localStorageClear(): void;
    /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
    [name: string]: any;
}
/** 再额外导出一个单例 */
export declare var shell: Shell;
