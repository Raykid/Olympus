import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
*/
@Injectable
export default class Hash
{
    private _hash:string;
    /**
     * 获取原始的哈希字符串
     * 
     * @readonly
     * @type {string}
     * @memberof Hash
     */
    public get hash():string
    {
        return this._hash;
    }

    private _moduleDataDict:{[name:string]:IHashModuleData};
    private _moduleDatas:IHashModuleData[];
    /**
     * 获取模块跳转数据数组
     * 
     * @readonly
     * @type {IHashModuleData[]}
     * @memberof Hash
     */
    public get moduleDatas():IHashModuleData[]
    {
        return this._moduleDatas;
    }

    /**
     * 获取传递给首模块的参数，首模块数据的传递方式为位于第一个#后且不填写模块名
     * 
     * @readonly
     * @type {*}
     * @memberof Hash
     */
    public get firstModuleParams():any
    {
        var data:IHashModuleData = this._moduleDatas[0];
        if(!data) return undefined;
        // 如果传递的第一个模块有名字，则不认为是传递给首模块的
        return (data.name ? undefined : data.params);
    }

    private _keepHash:boolean = false;
    /**
     * 获取是否保持哈希值
     * 
     * @readonly
     * @type {boolean}
     * @memberof Hash
     */
    public get keepHash():boolean
    {
        return this._keepHash;
    }

    public constructor()
    {
        this._hash = window.location.hash;
        this._moduleDataDict = {};
        this._moduleDatas = [];
        var reg:RegExp = /#([^\?&#]+)?(\?([^\?&=#]+=[^\?&=#]+)(&([^\?&=#]+=[^\?&=#]+))*)?/g;
        var result:RegExpExecArray;
        while(result = reg.exec(this._hash))
        {
            var data:IHashModuleData = {
                name: result[1],
                params: {},
                direct: false
            };
            // 解析模块参数
            var paramsStr:string = result[2];
            if(paramsStr != null)
            {
                paramsStr = paramsStr.substr(1);
                var params:string[] = paramsStr.split("&");
                for(var i:number = 0, len:number = params.length; i < len; i++)
                {
                    var pair:string = params[i];
                    if(pair != null)
                    {
                        var temp:string[] = pair.split("=");
                        // 键和值都要做一次URL解码
                        var key:string = decodeURIComponent(temp[0]);
                        var value:string = decodeURIComponent(temp[1]);
                        data.params[key] = value;
                    }
                }
            }
            // 处理direct参数
            data.direct = (data.params.direct == "true");
            delete data.params.direct;
            // 处理keepHash参数
            this._keepHash = this._keepHash || (data.params.keepHash == "true");
            delete data.params.keepHash;
            // 记录模块跳转数据
            this._moduleDataDict[data.name] = data;
            this._moduleDatas.push(data);
        }
        // 如果keepHash不是true，则移除哈希值
        if(!this._keepHash)
        {
            // 要使用window.location.replace方法，不能直接设置hash属性，否则会产生历史记录
            var url:string = window.location.href;
            var index:number = url.indexOf("#");
            if(index >= 0)
                window.location.replace(url.substr(0, index + 1));
        }
    }

    /**
     * 获取指定哈希参数
     * 
     * @param {string} key 参数名
     * @param {string} [moduleName] 参数所属模块名，不传则获取第一个模块的参数
     * @returns {string} 参数值
     * @memberof Hash
     */
    public getParam(key:string, moduleName?:string):string
    {
        var data:IHashModuleData = (moduleName ? this._moduleDataDict[moduleName] : this._moduleDatas[0]);
        return (data && data.params[key]);
    }
}

export interface IHashModuleData
{
    name:string;
    params:any;
    direct:boolean;
}

/** 再额外导出一个单例 */
export const hash:Hash = core.getInject(Hash);