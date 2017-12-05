import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import { load } from "../../utils/HTTPUtil";
import { trimURL } from "../../utils/URLUtil";
import { version } from "../version/Version";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 * 
 * 资源管理器
*/
@Injectable
export default class AssetsManager
{
    private _keyDict:{[key:string]:string} = {};
    /**
     * 为路径配置短名称
     * 
     * @param {string} key 路径短名称
     * @param {string} path 路径
     * @memberof AssetsManager
     */
    public configPath(key:string, path:string):void;
    /**
     * 为路径配置短名称
     * 
     * @param {{[key:string]:string}} params 路径短名称字典
     * @memberof AssetsManager
     */
    public configPath(params:{[key:string]:string}):void;
    /**
     * @private
     */
    public configPath(arg1:string|{[key:string]:string}, arg2?:string):void
    {
        if(typeof arg1 == "string")
        {
            this._keyDict[arg1] = arg2;
        }
        else
        {
            for(var key in arg1)
            {
                this._keyDict[key] = arg1[key];
            }
        }
    }

    private _assetsDict:{[path:string]:any} = {};

    /**
     * 获取资源，同步的，且如果找不到资源并不会触发加载
     * 
     * @param {string} keyOrPath 资源的短名称或路径
     * @returns {*} 
     * @memberof AssetsManager
     */
    public getAssets(keyOrPath:string):any
    {
        var path:string = this._keyDict[keyOrPath] || keyOrPath;
        return this._assetsDict[path];
    }

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
    public loadAssets(keyOrPath:string|string[], complete:(assets?:any|any[])=>void, responseType?:XMLHttpRequestResponseType, oneComplete?:(keyOrPath?:string, assets?:any)=>void):void
    {
        // 非空判断
        if(!keyOrPath)
        {
            complete();
            return;
        }
        // 获取路径
        if(keyOrPath instanceof Array)
        {
            // 使用副本，防止修改原始数组
            var temp:string[] = keyOrPath.concat();
            // 是个数组，转换成单一名称或对象
            var results:any[] = [];
            var curKey:string;
            var onGetOne:(result:any)=>void = (result:any)=>
            {
                // 记录结果
                results.push(result);
                // 调用回调
                oneComplete && oneComplete(curKey, result);
                // 获取下一个
                getOne();
            };
            var getOne:()=>void = ()=>{
                if(temp.length <= 0)
                {
                    complete(results);
                }
                else
                {
                    curKey = temp.shift();
                    this.loadAssets(curKey, onGetOne);
                }
            };
            getOne();
        }
        else
        {
            // 是单一名称或对象
            var path:string = this._keyDict[keyOrPath] || keyOrPath;
            // 获取值
            var value:any = this._assetsDict[path];
            if(value instanceof Array)
            {
                // 正在加载中，等待之
                value.push(complete);
            }
            else if(value)
            {
                // 已经加载过了，直接返回
                complete(value);
            }
            else
            {
                // 没有就去加载
                this._assetsDict[path] = value = [complete];
                load({
                    url: version.wrapHashUrl(path),
                    useCDN: true,
                    responseType: responseType,
                    onResponse: (result:any)=>{
                        // 记录结果
                        this._assetsDict[path] = result;
                        // 通知各个回调
                        for(var handler of value)
                        {
                            handler(result);
                        }
                    },
                    onError: (err:Error)=>{
                        // 移除结果
                        delete this._assetsDict[path];
                        // 通知各个回调
                        for(var handler of value)
                        {
                            handler(err);
                        }
                    }
                })
            }
        }
    }
}
/** 再额外导出一个单例 */
export const assetsManager:AssetsManager = core.getInject(AssetsManager);