import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { trimURL, wrapAbsolutePath } from "../../utils/URLUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 管理文件哈希版本号
*/
@Injectable
export default class Version
{
    private _hashDict:{[key:string]:string} = {};

    /**
     * 初始化哈希版本工具
     * 
     * @param {()=>void} handler 回调
     * @param {string} [host] version.cfg文件加载域名，不传则使用当前域名
     * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     * @memberof Version
     */
    public initialize(handler:()=>void, host?:string, version?:string):void
    {
        var self:Version = this;
        if(window["__Olympus_Version_hashDict__"])
        {
            // 之前在哪加载过，无需再次加载，直接使用
            this._hashDict = window["__Olympus_Version_hashDict__"];
            handler();
        }
        else
        {
            // 去加载version.cfg
            var request:XMLHttpRequest = null;
            if(window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0)
            {
                // code for IE7 - IE9
                request = new window["XDomainRequest"]();
            }
            else if (window["XMLHttpRequest"])
            {
                // code for IE10, Firefox, Chrome, Opera, Safari
                request = new XMLHttpRequest();
            }
            else if (window["ActiveXObject"])
            {
                // code for IE6, IE5
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            // 注册回调函数
            request.onload = function(evt:Event):void
            {
                if(request.status === undefined)
                {
                    // 说明是不支持XMLHttpRequest的情况，查看其responseText是否为""
                    if(request.responseText === "")
                    {
                        // 失败
                        request.onerror(new ErrorEvent("RequestError", {filename: url}));
                    }
                    else
                    {
                        // 成功
                        onLoad(evt);
                        handler();
                    }
                }
                else
                {
                    // 即使是onLoad也要判断下状态码
                    var statusHead:number = Math.floor(request.status * 0.01);
                    switch(statusHead)
                    {
                        case 2:
                        case 3:
                            // 2xx和3xx的状态码认为是成功
                            onLoad(evt);
                            handler();
                            break;
                        case 4:
                        case 5:
                            // 4xx和5xx的状态码认为是错误，转调错误回调
                            request.onerror(new ErrorEvent("RequestError", {filename: url, message: request.status + " " + request.statusText}));
                            break;
                    }
                }
            };
            var url:string;
            if(version)
            {
                request.onerror = function():void
                {
                    // 使用-r_方式加载失败了，再试一次用query参数加载版本号
                    var url:string = wrapAbsolutePath("version.cfg?v=" + version, host);
                    request.abort();
                    request.onerror = handler;
                    request.open("GET", url, true);
                    request.send();
                };
                // 设置连接信息
                url = wrapAbsolutePath("version.cfg", host);
                // 添加-r_方式版本号
                url = this.joinVersion(url, version);
            }
            else
            {
                // 没有版本号，直接使用当前时间戳加载
                request.onerror = handler;
                url = wrapAbsolutePath("version.cfg?v=" + Date.now(), host);
            }
            request.open("GET", url, true);
            // 发送数据，开始和服务器进行交互
            request.send();
        }

        function onLoad(evt:Event):void
        {
            var request:XMLHttpRequest = evt.target as XMLHttpRequest;
            var responseText = request.responseText;
            var lines:string[] = responseText.split("\n");
            for(var i in lines)
            {
                var line:string = lines[i];
                var arr:string[] = line.split("  ");
                if(arr.length == 2)
                {
                    var key:string = arr[1].substr(2);
                    var value:string = arr[0];
                    self._hashDict[key] = value;
                }
            }
            // 在window上挂一份
            window["__Olympus_Version_hashDict__"] = self._hashDict;
        }
    }

    /**
     * 获取文件哈希值，如果没有文件哈希值则返回null
     * 
     * @param {string} url 文件的URL
     * @returns {string} 文件的哈希值，或者null
     * @memberof Version
     */
    public getHash(url:string):string
    {
        url = trimURL(url);
        var result:string = null;
        for(var path in this._hashDict)
        {
            if(url.indexOf(path) >= 0)
            {
                result = this._hashDict[path];
                break;
            }
        }
        return result;
    }

    /**
     * 将url转换为哈希版本url
     * 
     * @param {string} url 原始url
     * @returns {string} 哈希版本url
     * @memberof Version
     */
    public wrapHashUrl(url:string):string
    {
        var hash:string = this.getHash(url);
        if(hash != null)
        {
            url = this.joinVersion(url, hash);
        }
        return url;
    }

    /**
     * 添加-r_XXX形式版本号
     * 
     * @param {string} url 
     * @param {string} version 版本号，以数字和小写字母组成
     * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
     * @memberof Version
     */
    public joinVersion(url:string, version:string):string
    {
        if(version == null) return url;
        // 去掉version中的非法字符
        version = version.replace(/[^0-9a-z]+/ig, "");
        // 插入版本号
        var reg:RegExp = /(([a-zA-Z]+:\/+[^\/\?#]+\/)?[^\?#]+)\.([^\?]+)(\?.+)?/;
        var result:RegExpExecArray = reg.exec(url);
        if(result != null)
        {
            url = result[1] + "-r_" + version + "." + result[3] + (result[4] || "");
        }
        return url;
    }

    /**
     * 移除-r_XXX形式版本号
     * 
     * @param {string} url url
     * @returns {string} 移除版本号后的url
     * @memberof Version
     */
    public removeVersion(url:string):string
    {
        // 去掉-r_XXX版本号，如果有
        url = url.replace(/\-r_[a-z0-9]+\./ig, ".");
        return url;
    }
}
/** 再额外导出一个单例 */
export const version:Version = core.getInject(Version);