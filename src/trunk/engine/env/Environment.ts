import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { wrapHost } from "../../utils/URLUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 环境参数
*/
@Injectable
export default class Environment
{
    protected _env:string;
    /**
     * 获取当前环境字符串
     * 
     * @readonly
     * @type {string}
     * @memberof Environment
     */
    public get env():string
    {
        return this._env;
    }

    private _hostsDict:{[env:string]:string[]};
    /**
     * 获取域名字典
     * 
     * @readonly
     * @type {{[env:string]:string[]}}
     * @memberof Environment
     */
    public get hostsDict():{[env:string]:string[]}
    {
        return this._hostsDict;
    }

    /**
     * 获取当前环境下某索引处的消息域名
     * 
     * @param {number} [index=0] 域名字典索引，默认是0
     * @returns {string} 域名字符串，如果取不到则使用当前域名
     * @memberof Environment
     */
    public getHost(index:number=0):string
    {
        var hosts:string[] = this._hostsDict[this._env];
        if(!hosts) return window.location.origin;
        return (hosts[index] || window.location.origin);
    }

    private _cdnsDict:{[env:string]:string[]};
    /**
     * 获取CDN字典
     * 
     * @readonly
     * @type {{[env:string]:string[]}}
     * @memberof Environment
     */
    public get cdnsDict():{[env:string]:string[]}
    {
        return this._cdnsDict;
    }
    private _curCDNIndex:number;
    /**
     * 获取当前使用的CDN域名
     * 
     * @readonly
     * @type {string}
     * @memberof Environment
     */
    public get curCDNHost():string
    {
        var cdns:string[] = this._cdnsDict[this._env];
        if(!cdns) return window.location.origin;
        return (cdns[this._curCDNIndex] || window.location.origin);
    }
    /**
     * 切换下一个CDN
     * 
     * @returns {boolean} 是否已经到达CDN列表的终点，回到了起点
     * @memberof Environment
     */
    public nextCDN():boolean
    {
        var cdns:string[] = this._cdnsDict[this._env];
        if(!cdns) return true;
        this._curCDNIndex ++;
        if(this._curCDNIndex >= cdns.length)
        {
            this._curCDNIndex = 0;
            return true;
        }
        return false;
    }

    /**
     * 初始化Environment对象，因为该对象保存的数据基本来自项目初始参数，所以必须有initialize方法
     * 
     * @param {string} [env] 当前所属环境字符串
     * @param {{[env:string]:string[]}} [hostsDict] host数组字典
     * @param {{[env:string]:string[]}} [cdnsDict] cdn数组字典
     * @memberof Environment
     */
    public initialize(env?:string, hostsDict?:{[env:string]:string[]}, cdnsDict?:{[env:string]:string[]}):void
    {
        this._env = env || "dev";
        this._hostsDict = hostsDict || {};
        this._cdnsDict = cdnsDict || {};
        this._curCDNIndex = 0;
    }

    /**
     * 让url的域名变成消息域名
     * 
     * @param {string} url 要转变的url
     * @param {number} [index=0] host索引，默认0
     * @returns {string} 转变后的url
     * @memberof Environment
     */
    public toHostURL(url:string, index:number=0):string
    {
        // 加上domain
        url = wrapHost(url, this.getHost(index));
        // 返回url
        return url;
    }

    /**
     * 让url的域名变成CDN域名
     * 
     * @param {string} url 要转变的url
     * @param {boolean} [forced=false] 是否强制替换host
     * @returns {string} 转变后的url
     * @memberof Environment
     */
    public toCDNHostURL(url:string, forced:boolean=false):string
    {
        // 组织中缀
        var midnameIndex:number = window.location.pathname.lastIndexOf("/");
        var midname:string = window.location.pathname.substring(0, midnameIndex + 1);
        return wrapHost(url, this.curCDNHost + "/" + midname, forced);
    }
}
/** 再额外导出一个单例 */
export const environment:Environment = core.getInject(Environment);