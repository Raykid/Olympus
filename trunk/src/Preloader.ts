/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 * 
 * 预加载器，负责预加载过程
*/
namespace olympus
{
    
    /**
     * 获取当前页面的origin，会兼容IE10以下
     * 
     * @returns {string} 
     */
    function getCurOrigin():string
    {
        if(window.location.origin) return window.location.origin;
        return (window.location.protocol + "//" + window.location.host);
    }

    /**
     * 规整url
     * @param url
     */
    function trimURL(url:string):string
    {
        // 去除多余的"/"
        url = url.replace(/([^:/])(\/)+/g, "$1/");
        if(url.charAt(0) == "/") url = url.substr(1);
        // 处理"/./"
        var index:number;
        while((index = url.indexOf("/./")) >= 0)
        {
            url = url.replace("/./", "/");
        }
        // 处理"/xx/../"
        var reg:RegExp = /\/[^\/\.]+?\/\.\.\//;
        while(reg.test(url))
        {
            url = url.replace(reg, "/");
        }
        return url;
    }
    
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    function getHostAndPathname(url: string): string
    {
        if (url == null) throw new Error("url不能为空");
        // 去掉get参数和hash
        url = url.split("#")[0].split("?")[0];
        // 去掉多余的/
        url = trimURL(url);
        return url;
    }

    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    function getPath(url:string):string
    {
        // 首先去掉多余的/
        url = getHostAndPathname(url);
        // 然后获取到路径
        var urlArr:string[] = url.split("/");
        urlArr.pop();
        return urlArr.join("/") + "/";
    }

    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    function isAbsolutePath(url:string):boolean
    {
        if(url == null) return false;
        return (url.indexOf("://") >= 0);
    }

    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    function validateProtocol(url:string):string
    {
        if(url == null) return null;
        var index:number = url.indexOf("://");
        if(index < 0) return url;
        var protocol:string = url.substring(0, index);
        // 调整http和https
        if(protocol == "http" || protocol == "https")
        {
            return window.location.protocol + url.substr(index + 1);
        }
        // 调整ws和wss
        if(protocol == "ws" || protocol == "wss")
        {
            if(window.location.protocol == "https:") protocol = "wss";
            else protocol = "ws";
            return protocol + url.substr(index);
        }
        // 不需要调整
        return url;
    }

    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    function wrapHost(url:string, host:string, forced:boolean = false):string
    {
        host = host || getCurOrigin();
        var re: RegExp = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
        var arr: string[] = url.match(re);
        if (arr && arr.length > 0)
        {
            if (forced)
            {
                url = url.substr(arr[0].length);
                url = host + "/" + url;
            }
        }
        else
        {
            url = host + "/" + url;
        }
        // 合法化一下protocol
        url = validateProtocol(url);
        // 最后规整一下url
        url = trimURL(url);
        return url;
    }

    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    function wrapAbsolutePath(relativePath:string, host?:string): string
    {
        // 获取当前页面的url
        var curPath:string = getPath(window.location.href);
        var url:string = trimURL(curPath + "/" + relativePath);
        if(host != null)
        {
            url = wrapHost(url, host, true);
        }
        return url;
    }

    class Version
    {
        private _hashDict:{[key:string]:string} = {};
    
        /**
         * 初始化哈希版本工具
         * 
         * @param {()=>void} handler 回调
         * @memberof Version
         */
        public initialize(handler:()=>void):void
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
                if (window["XMLHttpRequest"])
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
                    onLoad(evt);
                    handler();
                };
                request.onerror = handler;
                // 设置连接信息
                request.open("GET", "version.cfg?v=" + new Date().getTime(), true);
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

    var version:Version = new Version();

    /**
     * 预加载方法
     * 
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {()=>void} [callback] 全部加载完成后的回调
     */
    export function preload(jsFiles:JSFile[], host?:string, callback?:()=>void):void
    {
        // 首先初始化version
        version.initialize(()=>{
            loadJsFiles(jsFiles, host || getCurOrigin(), (err?:Error)=>{
                if(err)
                    throw err;
                else
                    callback && callback();
            });
        });
    }

    function loadJsFiles(jsFiles:JSFile[], host:string, callback:(err?:Error)=>void):void
    {
        if(!jsFiles)
        {
            callback();
            return;
        }
        jsFiles = jsFiles.concat();
        var count:number = jsFiles.length;
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
            // 如果是相对路径，则变为绝对路径
            var url:string = jsFile.url;
            if(!isAbsolutePath(url))
                url = wrapAbsolutePath(url, host);
            // 添加Version
            url = version.wrapHashUrl(url);
            // 创建一个空的script标签
            var jsNode:HTMLScriptElement = document.createElement("script");
            jsNode.type = "text/javascript";
            nodes.push(jsNode);
            // 开始加载
            if(jsFile.mode === JSLoadMode.JSONP || (jsFile.mode === JSLoadMode.AUTO && !isAbsolutePath(jsFile.url)))
            {
                // 使用JSONP方式加载
                var xhr:XMLHttpRequest = (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0 ? new window["XDomainRequest"]() : window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
                xhr.open("GET", url, true);
                // responseType设置要在open之后，否则IE10和IE11会报错
                xhr.responseType = "text";
                xhr.onload = onJSONPLoadOne;
                xhr.onerror = onJSONPLoadOne;
                xhr.send(null);
            }
            else
            {
                // 使用script标签方式加载，不用在意顺序
                jsNode.onload = onLoadOne;
                jsNode.onerror = onErrorOne;
                jsNode.src = url;
            }
        }

        function onJSONPLoadOne(evt:Event):void
        {
            if(evt instanceof ErrorEvent)
            {
                // 调用失败
                onErrorOne();
            }
            else
            {
                var xhr:XMLHttpRequest = <XMLHttpRequest>evt.target;
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
                    jsNode.innerHTML = xhr.responseText;
                }
                // 调用成功
                onLoadOne();
            }
        }

        function onLoadOne():void
        {
            // 如果全部加载完毕则调用回调
            if(!stop && --count === 0) onAllDone();
        }

        function onErrorOne():void
        {
            if(!stop)
            {
                stop = true;
                callback(new Error("JS加载失败"));
            }
        }

        function onAllDone():void
        {
            // 这里统一将所有script标签添加到DOM中，以此保持顺序
            for(var node of nodes)
            {
                document.body.appendChild(node);
            }
            // 回调
            callback();
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
}