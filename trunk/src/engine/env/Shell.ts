import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import IShell, { IShellProxyConstructor } from "./IShell";
import { assetsManager, JSLoadMode } from "../assets/AssetsManager";
import AudioTagImpl from "../audio/AudioTagImpl";
import { environment } from "./Environment";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-23
 * @modify date 2017-10-23
 * 
 * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
*/
@Injectable
export default class Shell implements IShell
{
    // 这是代理对象，如果有代理对象，则Shell会仅执行代理对象的接口，即“变身”为代理对象
    private _proxy:IShell;

    /**
     * 设置外壳代理，如果条件命中了该代理类型，则生成该代理实例并替代外壳行为
     * 
     * @memberof Shell
     */
    public set proxy(value:IShellProxyConstructor)
    {
        if(value.hit) this._proxy = new value();
    }

    /**
     * 获取当前外壳类型
     * 
     * @readonly
     * @type {string}
     * @memberof Shell
     */
    public get type():string
    {
        if(this._proxy) return this._proxy.type;
        else return "web";
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
        if(this._proxy)
        {
            this._proxy.reload(params);
        }
        else
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
        if(this._proxy)
        {
            this._proxy.open(params);
        }
        else
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
    }

    /**
     * 关闭窗口
     * 
     * @memberof Shell
     */
    public close():void
    {
        if(this._proxy) this._proxy.close();
        else window.close();
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
        if(this._proxy) return this._proxy.localStorageGet(key);
        else return window.localStorage.getItem(key);
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
        if(this._proxy) this._proxy.localStorageSet(key, value);
        else window.localStorage.setItem(key, value);
    }

    /**
     * 移除本地存储
     * 
     * @param {string} key 要移除的键
     * @memberof Shell
     */
    public localStorageRemove(key:string):void
    {
        if(this._proxy) this._proxy.localStorageRemove(key);
        else window.localStorage.removeItem(key);
    }

    /**
     * 清空本地存储
     * 
     * @memberof Shell
     */
    public localStorageClear():void
    {
        if(this._proxy) this._proxy.localStorageClear();
        else window.localStorage.clear();
    }

    /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
    [name:string]:any;
}

/**
 * 这是Shell在微信浏览器下的一个变形代理
 * 
 * @class ShellWX
 * @extends {Shell}
 */
class ShellWX extends Shell
{
    public static get hit():boolean
    {
        return (
            window.top === window &&
            /MicroMessenger/i.test(navigator.userAgent)
        );
    }

    public constructor()
    {
        super();
        // 用来记录加载微信js间隙的音频加载请求
        var loadCache:[string, AudioTagImpl][] = [];
        var loadFlag:boolean = false;
        // 变异AudioTagImpl，在微信里的Audio标签需要从微信触发加载
        var oriLoad:(url:string)=>void = AudioTagImpl.prototype.load;
        AudioTagImpl.prototype.load = function(url:string):void
        {
            // 第一次进行了音频加载，如果还没加载过js，则去加载之
            if(!loadFlag)
            {
                loadFlag = true;
                // 去加载微信js
                assetsManager.loadJsFiles([{
                    url: "http://res.wx.qq.com/open/js/jweixin-1.2.0.js",
                    mode: JSLoadMode.TAG
                }], (err:Error)=>{
                    if(err)
                    {
                        // 发生错误了，恢复原始的操作
                        AudioTagImpl.prototype.load = oriLoad;
                        // 移除闭包数据
                        oriLoad = null;
                    }
                    // 重新启动缓存的加载请求
                    for(var cache of loadCache)
                    {
                        cache[1].load(cache[0]);
                    }
                    // 移除闭包数据
                    loadCache = null;
                });
            }
            // 处理url
            var toUrl:string = environment.toCDNHostURL(url);
            // 尝试获取缓存数据
            var data:any = this._audioCache[toUrl];
            // 如果没有缓存才去加载
            if(!data || data.__from_cache__)
            {
                // 先调用原始方法，否则行为就变了
                if(!data) oriLoad.call(this, url);
                else delete data.__from_cache__;
                // 如果js还没加载好则等待加载
                if(!window["wx"])
                {
                    loadCache.push([url, this]);
                    // 这里记录一个从缓存来的标记
                    data = this._audioCache[toUrl];
                    data.__from_cache__ = true;
                    return;
                }
                // 从微信里触发加载操作
                window["wx"].checkJsApi({
                    jsApiList: ["checkJsApi"],
                    success: ()=>{
                        var data:any = this._audioCache[toUrl];
                        var node:HTMLAudioElement = data.node;
                        node.load();
                    }
                });
            }
        };
    }

    public get type():string
    {
        return "weixin";
    }

    public close():void
    {
        window["WeixinJSBridge"].invoke("closeWindow");
    }
}

/** 再额外导出一个单例 */
export var shell:Shell = core.getInject(Shell);

/** 尝试添加微信外壳代理 */
shell.proxy = ShellWX;