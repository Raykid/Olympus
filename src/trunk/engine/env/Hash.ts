import {core} from "../../core/Core";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
*/
@injectable
export default class Hash
{
    private _hash:string;
    /**
     * 获取原始的哈希字符串
     * 
     * @returns {string} 
     * @memberof Hash
     */
    public getHash():string
    {
        return this._hash;
    }

    private _moduleName:string;
    /**
     * 获取模块名
     * 
     * @returns {string} 模块名
     * @memberof Hash
     */
    public getModuleName():string
    {
        return this._moduleName;
    }

    private _params:{[key:string]:string} = {};
    /**
     * 获取传递给模块的参数
     * 
     * @returns {{[key:string]:string}} 模块参数
     * @memberof Hash
     */
    public getParams():{[key:string]:string}
    {
        return this._params;
    }

    private _direct:boolean = false;
    /**
     * 获取是否直接跳转模块
     * 
     * @returns {boolean} 是否直接跳转模块
     * @memberof Hash
     */
    public getDirect():boolean
    {
        return this._direct;
    }

    private _keepHash:boolean = false;
    /**
     * 获取是否保持哈希值
     * 
     * @returns {boolean} 是否保持哈希值
     * @memberof Hash
     */
    public getKeepHash():boolean
    {
        return this._keepHash;
    }

    public constructor()
    {
        this._hash = window.location.hash;
        var reg:RegExp = /#([^\?&]+)(\?([^\?&=]+=[^\?&=]+)(&([^\?&=]+=[^\?&=]+))*)?/;
        var result:RegExpExecArray = reg.exec(this._hash);
        if(result)
        {
            // 解析模块名称
            this._moduleName = result[1];
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
                        this._params[key] = value;
                    }
                }
            }
            // 处理direct参数
            this._direct = (this._params.direct == "true");
            delete this._params.direct;
            // 处理keepHash参数
            this._keepHash = (this._params.keepHash == "true");
            delete this._params.keepHash;
            // 如果keepHash不是true，则移除哈希值
            if(!this._keepHash) window.location.hash = "";
        }
    }

    /**
     * 获取指定哈希参数
     * 
     * @param {string} key 参数名
     * @returns {string} 参数值
     * @memberof Hash
     */
    public getParam(key:string):string
    {
        return this._params[key];
    }
}
/** 再额外导出一个单例 */
export const hash:Hash = core.getInject(Hash)