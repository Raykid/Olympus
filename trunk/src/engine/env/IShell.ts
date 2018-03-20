/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-20
 * @modify date 2018-03-20
 * 
 * 外壳接口
*/
export default interface IShell
{
    /**
     * 获取当前外壳类型
     * 
     * @readonly
     * @type {string}
     * @memberof IShell
     */
    readonly type:string;
    
    /*************************** 下面是页面跳转接口 ***************************/

    /**
     * 刷新页面
     * 
     * @param {{
     *         forcedReload?:boolean, // false表示允许从缓存取，true表示强制从服务器取，默认是false
     *         url?:string, // 传递则使用新URL刷新页面
     *         replace?:boolean // 如果有新url，则表示是否要替换当前浏览历史
     *     }} [params] 
     * @memberof IShell
     */
    reload(params?:{
        forcedReload?:boolean,
        url?:string,
        replace?:boolean
    }):void;

    /**
     * 打开一个新页面
     * 
     * @param {{
     *         url?:string, // 新页面地址，不传则不更新地址
     *         name?:string, // 给新页面命名，或导航到已有页面
     *         replace?:boolean, // 是否替换当前浏览历史条目，默认false
     *         features:{[key:string]:any} // 其他可能的参数
     *     }} [params] 
     * @memberof IShell
     */
    open(params?:{
        url?:string,
        name?:string,
        replace?:boolean,
        features:{[key:string]:any}
    }):void;

    /**
     * 关闭窗口
     * 
     * @memberof IShell
     */
    close():void;

    /*************************** 下面是本地存储接口 ***************************/

    /**
     * 获取本地存储
     * 
     * @param {string} key 要获取值的键
     * @returns {string} 获取的值
     * @memberof IShell
     */
    localStorageGet(key:string):string;

    /**
     * 设置本地存储
     * 
     * @param {string} key 要设置的键
     * @param {string} value 要设置的值
     * @memberof IShell
     */
    localStorageSet(key:string, value:string):void;

    /**
     * 移除本地存储
     * 
     * @param {string} key 要移除的键
     * @memberof IShell
     */
    localStorageRemove(key:string):void;

    /**
     * 清空本地存储
     * 
     * @memberof IShell
     */
    localStorageClear():void;

    /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
    [name:string]:any;
}

export interface IShellProxyConstructor
{
    new():IShell;
    /**
     * 是否命中该类型外壳
     * 
     * @type {boolean}
     * @memberof IShellProxyConstructor
     */
    readonly hit:boolean;
}