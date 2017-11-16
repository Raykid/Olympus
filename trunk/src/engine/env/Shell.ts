import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-23
 * @modify date 2017-10-23
 * 
 * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
*/
@Injectable
export default class Shell
{
    /**
     * 获取当前外壳类型
     * 
     * @readonly
     * @type {string}
     * @memberof Shell
     */
    public get type():string
    {
        return "web";
    }
    
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
    public reload(params?:{
        forcedReload?:boolean,
        url?:string,
        replace?:boolean
    }):void
    {
        if(!params)
            window.location.reload();
        else if(!params.url)
            window.location.reload(params.forcedReload);
        else if(!params.replace)
            window.location.href = params.url;
        else
            window.location.replace(params.url);
    }

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
    public open(params?:{
        url?:string,
        name?:string,
        replace?:boolean,
        features:{[key:string]:any}
    }):void
    {
        if(!params) 
        {
            window.open();
        }
        else
        {
            var features:string[] = undefined;
            if(params.features)
            {
                features = [];
                for(var key in params.features)
                {
                    features.push(key + "=" + params.features[key]);
                }
            }
            window.open(params.url, params.name, features && features.join(","), params.replace);
        }
    }

    /**
     * 关闭窗口
     * 
     * @memberof Shell
     */
    public close():void
    {
        window.close();
    }

    /*************************** 下面是本地存储接口 ***************************/

    /**
     * 获取本地存储
     * 
     * @param {string} key 要获取值的键
     * @returns {string} 获取的值
     * @memberof Shell
     */
    public localStorageGet(key:string):string
    {
        return window.localStorage.getItem(key);
    }

    /**
     * 设置本地存储
     * 
     * @param {string} key 要设置的键
     * @param {string} value 要设置的值
     * @memberof Shell
     */
    public localStorageSet(key:string, value:string):void
    {
        window.localStorage.setItem(key, value);
    }

    /**
     * 移除本地存储
     * 
     * @param {string} key 要移除的键
     * @memberof Shell
     */
    public localStorageRemove(key:string):void
    {
        window.localStorage.removeItem(key);
    }

    /**
     * 清空本地存储
     * 
     * @memberof Shell
     */
    public localStorageClear():void
    {
        window.localStorage.clear();
    }

    /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
    [name:string]:any;
}

/** 再额外导出一个单例 */
export var shell:Shell = core.getInject(Shell);