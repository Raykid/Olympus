import { trimURL } from "./URLUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 * 
 * 版本号管理工具，使用静态工具类做是因为可能会在Engine之外使用，例如Preloader中
*/

enum InitStatus
{
    /** 未初始化 */
    UNINITIALIZED,
    /** 初始化中 */
    INITIALIZING,
    /** 已初始化 */
    INITIALIZED
}

export default class VersionUtil
{
    private static _initStatus:InitStatus = InitStatus.UNINITIALIZED;
    private static _hashDict:{[key:string]:string} = {};
    private static _handlerList:(()=>void)[] = [];

    /**
     * 初始化哈希版本工具
     * 
     * @static
     * @param {()=>void} [handler] 回调
     * @memberof VersionUtil
     */
    public static initialize(handler?:()=>void):void
    {
        switch(VersionUtil._initStatus)
        {
            case InitStatus.INITIALIZED:
                // 已初始化，直接调用回调
                handler && handler();
                break;
            case InitStatus.INITIALIZING:
                // 正在初始化，仅记录回调
                if(VersionUtil._handlerList.indexOf(handler) < 0)
                    VersionUtil._handlerList.push(handler);
                break;
            case InitStatus.UNINITIALIZED:
                // 尚未初始化
                VersionUtil._initStatus = InitStatus.INITIALIZING;
                // 记录回调
                if(VersionUtil._handlerList.indexOf(handler) < 0)
                    VersionUtil._handlerList.push(handler);
                // 去加载version.cfg
                var request:XMLHttpRequest = null;
                if (window["XMLHttpRequest"])
                {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    request = new XMLHttpRequest();
                }
                else if (window["ActiveXObject"])
                {
                    // code for IE6, IE5
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                // 注册回调函数
                request.onreadystatechange = (evt:Event)=>
                {
                    var request:XMLHttpRequest = evt.target as XMLHttpRequest;
                    //判断对象状态是交互完成，接收服务器返回的数据
                    if (request.readyState == 4)
                    {
                        if(request.status == 200)
                        {
                            var fileName:string = request["fileName"];
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
                                    this._hashDict[key] = value;
                                }
                            }
                        }
                        // 修改状态
                        VersionUtil._initStatus = InitStatus.INITIALIZED;
                        // 执行回调
                        for(var j:number = 0, len:number = VersionUtil._handlerList.length; j < len; j++)
                        {
                            var handler:()=>void = VersionUtil._handlerList.shift();
                            handler && handler();
                        }
                    }
                };
                // 设置连接信息
                request.open("GET", "version.cfg?v=" + new Date().getTime(), true);
                // 发送数据，开始和服务器进行交互
                request.send();
                break;
        }
    }

    /**
     * 获取文件哈希值，如果没有文件哈希值则返回null
     * 
     * @static
     * @param {string} url 文件的URL
     * @returns {string} 文件的哈希值，或者null
     * @memberof VersionUtil
     */
    public static getHash(url:string):string
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
     * @static
     * @param {string} url 原始url
     * @returns {string} 哈希版本url
     * @memberof VersionUtil
     */
    public static wrapHashUrl(url:string):string
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
     * @static
     * @param {string} url 
     * @param {string} version 版本号，以数字和小写字母组成
     * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
     * @memberof VersionUtil
     */
    public static joinVersion(url:string, version:string):string
    {
        if(version == null) return url;
        // 去掉version中的非法字符
        version = version.replace(/[^0-9a-z]+/ig, "");
        // 插入版本号
        var reg:RegExp = /([a-zA-Z]+:\/+[^\/\?#]+\/[^\?#]+)\.([^\?]+)(\?.+)?/;
        var result:RegExpExecArray = reg.exec(url);
        if(result != null)
        {
            url = result[1] + "-r_" + version + "." + result[2] + (result[3] || "");
        }
        return url;
    }

    /**
     * 移除-r_XXX形式版本号
     * 
     * @static
     * @param {string} url url
     * @returns {string} 移除版本号后的url
     * @memberof VersionUtil
     */
    public static removeVersion(url:string):string
    {
        // 去掉-r_XXX版本号，如果有
        url = url.replace(/\-r_[a-z0-9]+\./ig, ".");
        return url;
    }
}