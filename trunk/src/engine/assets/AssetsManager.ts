import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import { load } from "../../utils/HTTPUtil";
import { trimURL, isAbsolutePath } from "../../utils/URLUtil";
import { version } from "../version/Version";
import { environment } from "../env/Environment";
import { unique } from "../../utils/ArrayUtil";

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
        var result:any = this._assetsDict[path];
        // 如果是个数组则表示正在加载中，返回undefined
        if(result instanceof Array) return undefined;
        else return result;
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
            complete && complete(value);
            return;
        }
        // 获取路径
        if(keyOrPath instanceof Array)
        {
            // 数组去重
            keyOrPath = unique(keyOrPath);
            // 是个数组，转换成单一名称或对象
            var count:number = keyOrPath.length;
            var results:any[] = [];
            // 判断数量
            if(count > 0)
            {
                // 声明回调
                var handler:(keyOrPath?:string, assets?:any)=>void = (path:string, assets:any)=>{
                    // 调用回调
                    oneComplete && oneComplete(path, assets);
                    // 填充数组
                    var index:number = keyOrPath.indexOf(path);
                    results[index] = assets;
                    // 判断完成
                    if(-- count === 0)
                        complete && complete(results);
                };
                // 并行加载资源
                for(var i:number = 0, len:number = count; i < len; i++)
                {
                    var path:string = keyOrPath[i];
                    this.loadAssets(path, null, null, handler);
                }
            }
            else
            {
                // 直接完成
                complete && complete(results);
            }
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
                oneComplete && oneComplete(keyOrPath, value);
                complete && complete(value);
            }
            else
            {
                // 没有就去加载
                this._assetsDict[path] = value = [(result:any)=>{
                    oneComplete && oneComplete(<string>keyOrPath, result);
                    complete && complete(result);
                }];
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

    /**
     * 加载CSS样式文件
     * 
     * @param {string[]} cssFiles 样式文件URL列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @memberof AssetsManager
     */
    public loadStyleFiles(cssFiles:string[], handler:(err?:Error)=>void):void
    {
        if(!cssFiles || cssFiles.length === 0)
        {
            handler();
            return;
        }
        var count:number = cssFiles.length;
        var stop:boolean = false;
        for(var cssFile of cssFiles)
        {
            var cssNode:HTMLLinkElement= document.createElement("link");
            cssNode.rel = "stylesheet";
            cssNode.type = "text/css";
            cssNode.href = environment.toCDNHostURL(version.wrapHashUrl(cssFile));
            cssNode.onload = onLoadOne;
            cssNode.onerror = onErrorOne;
            document.body.appendChild(cssNode);
        }

        function onLoadOne():void
        {
            // 如果全部加载完毕则调用回调
            if(!stop && --count === 0) handler();
        }

        function onErrorOne(evt:Event):void
        {
            if(!stop)
            {
                stop = true;
                handler(new Error("CSS加载失败"));
            }
        }
    }

    /**
     * 加载JS文件
     * 
     * @param {JSFile[]} jsFiles js文件列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @memberof AssetsManager
     */
    public loadJsFiles(jsFiles:JSFile[], handler:(err?:Error)=>void, ordered:boolean=true):void
    {
        if(!jsFiles || jsFiles.length === 0)
        {
            handler();
            return;
        }
        jsFiles = jsFiles.concat();
        var count:number = jsFiles.length;
        var jsonpCount:number = 0;
        var stop:boolean = false;
        var nodes:HTMLScriptElement[] = [];
        // 遍历加载js
        for(var i in jsFiles)
        {
            var jsFile:JSFile = jsFiles[i];
            // 统一类型
            if(typeof jsFile === "string")
            {
                // 是简单路径，变成JSFileData
                jsFiles[i] = jsFile = {
                    url: jsFile,
                    mode: JSLoadMode.AUTO
                };
            }
            // 创建一个空的script标签
            var jsNode:HTMLScriptElement = document.createElement("script");
            jsNode.type = "text/javascript";
            nodes.push(jsNode);
            // 开始加载
            if(jsFile.mode === JSLoadMode.JSONP || (jsFile.mode === JSLoadMode.AUTO && !isAbsolutePath(jsFile.url)))
            {
                this.loadAssets(jsFile.url, null, null, onCompleteOne);
                // 递增数量
                jsonpCount ++;
            }
            else
            {
                // 使用script标签方式加载，不用在意顺序
                jsNode.onload = onLoadOne;
                jsNode.onerror = onErrorOne;
                jsNode.src = environment.toCDNHostURL(version.wrapHashUrl(jsFile.url));
            }
        }
        // 判断一次
        var appendIndex:number = 0;
        judgeAppend();

        function judgeAppend():void
        {
            if(jsonpCount === 0)
            {
                // 这里统一将所有script标签添加到DOM中，以此保持顺序
                for(var i:number = appendIndex, len:number = nodes.length; i < len; )
                {
                    var node:HTMLScriptElement = nodes[i];
                    document.body.appendChild(node);
                    // 记录添加索引
                    appendIndex = ++ i;
                    // 如果需要保持顺序且当前是标签形式js，则停止添加，等待加载完毕再继续
                    if(ordered && node.src) break;
                }
            }
        }

        function onCompleteOne(url:string, result:string|Error):void
        {
            if(result instanceof Error)
            {
                // 调用失败
                onErrorOne();
            }
            else
            {
                // 取到索引
                var index:number = -1;
                for(var i:number = 0, len:number = jsFiles.length; i < len; i++)
                {
                    var jsFile:JSFileData = <JSFileData>jsFiles[i];
                    if(jsFile.url === url)
                    {
                        index = i;
                        break;
                    }
                }
                // 填充script标签内容
                if(index >= 0)
                {
                    var jsNode = nodes[index];
                    jsNode.innerHTML = result;
                }
                // 递减jsonp数量
                jsonpCount --;
                // 调用成功
                onLoadOne();
            }
        }

        function onLoadOne():void
        {
            // 添加标签
            judgeAppend();
            // 如果全部加载完毕则调用回调
            if(!stop && --count === 0) handler();
        }

        function onErrorOne():void
        {
            if(!stop)
            {
                stop = true;
                handler(new Error("JS加载失败"));
            }
        }
    }
}

export enum JSLoadMode
{
    AUTO,
    JSONP,
    TAG
}

export interface JSFileData
{
    url:string;
    mode?:JSLoadMode;
}

export type JSFile = string | JSFileData;

/** 再额外导出一个单例 */
export const assetsManager:AssetsManager = core.getInject(AssetsManager);