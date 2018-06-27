/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-01
 * @modify date 2017-11-01
 *
 * 预加载器，负责预加载过程
*/
var olympus;
(function (olympus) {
    /**
     * 获取当前页面的origin，会兼容IE10以下
     *
     * @returns {string}
     */
    function getCurOrigin() {
        if (window.location.origin)
            return window.location.origin;
        return (window.location.protocol + "//" + window.location.host);
    }
    olympus.getCurOrigin = getCurOrigin;
    /**
     * 规整url
     * @param url
     */
    function trimURL(url) {
        // 去除多余的"/"
        url = url.replace(/([^:/])(\/)+/g, "$1/");
        if (url.charAt(0) == "/")
            url = url.substr(1);
        // 处理"/./"
        var index;
        while ((index = url.indexOf("/./")) >= 0) {
            url = url.replace("/./", "/");
        }
        // 处理"/xx/../"
        var reg = /\/[^\/\.]+?\/\.\.\//;
        while (reg.test(url)) {
            url = url.replace(reg, "/");
        }
        return url;
    }
    olympus.trimURL = trimURL;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    function getHostAndPathname(url) {
        if (url == null)
            throw new Error("url不能为空");
        // 去掉get参数和hash
        url = url.split("#")[0].split("?")[0];
        // 去掉多余的/
        url = trimURL(url);
        return url;
    }
    olympus.getHostAndPathname = getHostAndPathname;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    function getPath(url) {
        // 首先去掉多余的/
        url = getHostAndPathname(url);
        // 然后获取到路径
        var urlArr = url.split("/");
        urlArr.pop();
        return urlArr.join("/") + "/";
    }
    olympus.getPath = getPath;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    function isAbsolutePath(url) {
        if (url == null)
            return false;
        return (url.indexOf("://") >= 0);
    }
    olympus.isAbsolutePath = isAbsolutePath;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    function validateProtocol(url) {
        if (url == null)
            return null;
        var index = url.indexOf("://");
        if (index < 0)
            return url;
        var protocol = url.substring(0, index);
        // 调整http和https
        if (protocol == "http" || protocol == "https") {
            return window.location.protocol + url.substr(index + 1);
        }
        // 调整ws和wss
        if (protocol == "ws" || protocol == "wss") {
            if (window.location.protocol == "https:")
                protocol = "wss";
            else
                protocol = "ws";
            return protocol + url.substr(index);
        }
        // 不需要调整
        return url;
    }
    olympus.validateProtocol = validateProtocol;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    function wrapHost(url, host, forced) {
        if (forced === void 0) { forced = false; }
        host = host || getCurOrigin();
        var re = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
        var arr = url.match(re);
        if (arr && arr.length > 0) {
            if (forced) {
                url = url.substr(arr[0].length);
                url = host + "/" + url;
            }
        }
        else {
            url = host + "/" + url;
        }
        // 合法化一下protocol
        url = validateProtocol(url);
        // 最后规整一下url
        url = trimURL(url);
        return url;
    }
    olympus.wrapHost = wrapHost;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    function wrapAbsolutePath(relativePath, host) {
        // 获取当前页面的url
        var curPath = getPath(window.location.href);
        var url = trimURL(curPath + "/" + relativePath);
        if (host != null) {
            url = wrapHost(url, host, true);
        }
        return url;
    }
    olympus.wrapAbsolutePath = wrapAbsolutePath;
    var Version = /** @class */ (function () {
        function Version() {
            this._hashDict = {};
        }
        /**
         * 初始化哈希版本工具
         *
         * @param {()=>void} handler 回调
         * @param {string} [host] version.cfg文件加载域名，不传则使用当前域名
         * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
         * @memberof Version
         */
        Version.prototype.initialize = function (handler, host, version) {
            var self = this;
            if (window["__Olympus_Version_hashDict__"]) {
                // 之前在哪加载过，无需再次加载，直接使用
                this._hashDict = window["__Olympus_Version_hashDict__"];
                handler();
            }
            else {
                // 去加载version.cfg
                var request = null;
                if (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0) {
                    // code for IE7 - IE9
                    request = new window["XDomainRequest"]();
                }
                else if (window["XMLHttpRequest"]) {
                    // code for IE10, Firefox, Chrome, Opera, Safari
                    request = new XMLHttpRequest();
                }
                else if (window["ActiveXObject"]) {
                    // code for IE6, IE5
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                // 注册回调函数
                request.onload = function (evt) {
                    if (request.status === undefined) {
                        // 说明是不支持XMLHttpRequest的情况，查看其responseText是否为""
                        if (request.responseText === "") {
                            // 失败
                            request.onerror(new Event("RequestError: " + JSON.stringify({ filename: url })));
                        }
                        else {
                            // 成功
                            onLoad(evt);
                            handler();
                        }
                    }
                    else {
                        // 即使是onLoad也要判断下状态码
                        var statusHead = Math.floor(request.status * 0.01);
                        switch (statusHead) {
                            case 2:
                            case 3:
                                // 2xx和3xx的状态码认为是成功
                                onLoad(evt);
                                handler();
                                break;
                            case 4:
                            case 5:
                                // 4xx和5xx的状态码认为是错误，转调错误回调
                                request.onerror(new Event("RequestError: " + JSON.stringify({ filename: url, message: request.status + " " + request.statusText })));
                                break;
                        }
                    }
                };
                var url;
                if (version) {
                    request.onerror = function () {
                        // 使用-r_方式加载失败了，再试一次用query参数加载版本号
                        var url = wrapAbsolutePath("version.cfg?v=" + version, host);
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
                else {
                    // 没有版本号，直接使用当前时间戳加载
                    request.onerror = handler;
                    url = wrapAbsolutePath("version.cfg?v=" + Date.now(), host);
                }
                request.open("GET", url, true);
                // 发送数据，开始和服务器进行交互
                request.send();
            }
            function onLoad(evt) {
                var request = evt.target;
                var responseText = request.responseText;
                var lines = responseText.split("\n");
                for (var i in lines) {
                    var line = lines[i];
                    var arr = line.split("  ");
                    if (arr.length == 2) {
                        var key = arr[1].substr(2);
                        var value = arr[0];
                        self._hashDict[key] = value;
                    }
                }
                // 在window上挂一份
                window["__Olympus_Version_hashDict__"] = self._hashDict;
            }
        };
        /**
         * 获取文件哈希值，如果没有文件哈希值则返回null
         *
         * @param {string} url 文件的URL
         * @returns {string} 文件的哈希值，或者null
         * @memberof Version
         */
        Version.prototype.getHash = function (url) {
            url = trimURL(url);
            var result = null;
            for (var path in this._hashDict) {
                if (url.indexOf(path) >= 0) {
                    result = this._hashDict[path];
                    break;
                }
            }
            return result;
        };
        /**
         * 将url转换为哈希版本url
         *
         * @param {string} url 原始url
         * @returns {string} 哈希版本url
         * @memberof Version
         */
        Version.prototype.wrapHashUrl = function (url) {
            var hash = this.getHash(url);
            if (hash != null) {
                url = this.joinVersion(url, hash);
            }
            return url;
        };
        /**
         * 添加-r_XXX形式版本号
         *
         * @param {string} url
         * @param {string} version 版本号，以数字和小写字母组成
         * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
         * @memberof Version
         */
        Version.prototype.joinVersion = function (url, version) {
            if (version == null)
                return url;
            // 去掉version中的非法字符
            version = version.replace(/[^0-9a-z]+/ig, "");
            // 插入版本号
            var reg = /([a-zA-Z]+:\/+[^\/\?#]+\/[^\?#]+)\.([^\?]+)(\?.+)?/;
            var result = reg.exec(url);
            if (result != null) {
                url = result[1] + "-r_" + version + "." + result[2] + (result[3] || "");
            }
            return url;
        };
        /**
         * 移除-r_XXX形式版本号
         *
         * @param {string} url url
         * @returns {string} 移除版本号后的url
         * @memberof Version
         */
        Version.prototype.removeVersion = function (url) {
            // 去掉-r_XXX版本号，如果有
            url = url.replace(/\-r_[a-z0-9]+\./ig, ".");
            return url;
        };
        return Version;
    }());
    var _version = new Version();
    /**
     * 预加载方法
     *
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {(err?:Error)=>void} [callback] 全部加载完成后的回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @param {string} [version] 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     */
    function preload(jsFiles, host, callback, ordered, version) {
        if (ordered === void 0) { ordered = true; }
        // 首先初始化version
        _version.initialize(function () {
            loadJsFiles(jsFiles, host || getCurOrigin(), function (err) {
                if (callback) {
                    // 有回调，将逻辑交给回调处理
                    callback(err);
                }
                else if (err) {
                    // 有错误，使用alert提示用户，并延迟5秒刷新页面
                    alert(err.message + "\n点击确定5秒后将刷新页面。");
                    setTimeout(function () { return window.location.reload(true); }, 5000);
                }
            }, ordered);
        }, host, version);
    }
    olympus.preload = preload;
    function loadJsFiles(jsFiles, host, callback, ordered) {
        if (!jsFiles) {
            callback();
            return;
        }
        jsFiles = jsFiles.concat();
        var count = jsFiles.length;
        var jsonpCount = 0;
        var stop = false;
        var nodes = [];
        // 遍历加载js
        for (var i in jsFiles) {
            var jsFile = jsFiles[i];
            // 统一类型
            if (typeof jsFile === "string") {
                // 是简单路径，变成JSFileData
                jsFiles[i] = jsFile = {
                    url: jsFile,
                    mode: JSLoadMode.AUTO
                };
            }
            // 如果是相对路径，则变为绝对路径
            var url = jsFile.url;
            if (!isAbsolutePath(url))
                url = wrapAbsolutePath(url, host);
            // 添加Version
            url = _version.wrapHashUrl(url);
            // 创建一个空的script标签
            var jsNode = document.createElement("script");
            jsNode.type = "text/javascript";
            nodes.push(jsNode);
            // 开始加载
            if (jsFile.mode === JSLoadMode.JSONP || (jsFile.mode === JSLoadMode.AUTO && !isAbsolutePath(jsFile.url))) {
                // 使用JSONP方式加载
                var xhr = (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0 ? new window["XDomainRequest"]() : window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
                // 记录索引
                xhr["index"] = i;
                xhr.open("GET", url, true);
                // responseType设置要在open之后，否则IE10和IE11会报错
                xhr.responseType = "text";
                xhr.onload = onJSONPLoadOne;
                xhr.onerror = onJSONPLoadError;
                xhr.send(null);
                // 递增数量
                jsonpCount++;
            }
            else {
                // 使用script标签方式加载，不用在意顺序
                jsNode.onload = onLoadOne;
                jsNode.onerror = onErrorOne;
                jsNode.src = url;
            }
        }
        // 判断一次
        var appendIndex = 0;
        judgeAppend();
        function judgeAppend() {
            if (jsonpCount === 0) {
                // 这里统一将所有script标签添加到DOM中，以此保持顺序
                for (var i = appendIndex, len = nodes.length; i < len;) {
                    var node = nodes[i];
                    document.body.appendChild(node);
                    // 记录添加索引
                    appendIndex = ++i;
                    // 如果需要保持顺序且当前是标签形式js，则停止添加，等待加载完毕再继续
                    if (ordered && node.src)
                        break;
                }
            }
        }
        function onJSONPLoadOne(evt) {
            var xhr = evt.target;
            var success = function (evt) {
                // 取到索引
                var index = xhr["index"];
                // 填充script标签内容
                var jsNode = nodes[index];
                jsNode.innerHTML = xhr.responseText;
                // 递减jsonp数量
                jsonpCount--;
                // 调用成功
                onLoadOne();
            };
            if (xhr.status === undefined) {
                // 说明是不支持XMLHttpRequest的情况，查看其responseText是否为""
                if (xhr.responseText === "") {
                    // 失败
                    onJSONPLoadError();
                }
                else {
                    // 成功
                    success(evt);
                }
            }
            else {
                // 即使是onLoad也要判断下状态码
                var statusHead = Math.floor(xhr.status * 0.01);
                switch (statusHead) {
                    case 2:
                    case 3:
                        // 2xx和3xx的状态码认为是成功
                        success(evt);
                        break;
                    case 4:
                    case 5:
                        // 4xx和5xx的状态码认为是错误，转调错误回调
                        onJSONPLoadError();
                        break;
                }
            }
        }
        function onJSONPLoadError() {
            // 调用失败
            onErrorOne();
        }
        function onLoadOne() {
            // 添加标签
            judgeAppend();
            // 如果全部加载完毕则调用回调
            if (!stop && --count === 0)
                callback();
        }
        function onErrorOne() {
            if (!stop) {
                stop = true;
                callback(new Error("JS加载失败"));
            }
        }
    }
    var JSLoadMode;
    (function (JSLoadMode) {
        JSLoadMode[JSLoadMode["AUTO"] = 0] = "AUTO";
        JSLoadMode[JSLoadMode["JSONP"] = 1] = "JSONP";
        JSLoadMode[JSLoadMode["TAG"] = 2] = "TAG";
    })(JSLoadMode = olympus.JSLoadMode || (olympus.JSLoadMode = {}));
})(olympus || (olympus = {}));
