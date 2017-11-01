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
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    function wrapHost(url, host, forced) {
        if (forced === void 0) { forced = false; }
        host = host || window.location.origin;
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
    var Version = /** @class */ (function () {
        function Version() {
            this._hashDict = {};
        }
        /**
         * 初始化哈希版本工具
         *
         * @param {()=>void} handler 回调
         * @memberof Version
         */
        Version.prototype.initialize = function (handler) {
            var _this = this;
            if (window["__Olympus_Version_hashDict__"]) {
                // 之前在哪加载过，无需再次加载，直接使用
                this._hashDict = window["__Olympus_Version_hashDict__"];
                handler();
            }
            else {
                // 去加载version.cfg
                var request = null;
                if (window["XMLHttpRequest"]) {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    request = new XMLHttpRequest();
                }
                else if (window["ActiveXObject"]) {
                    // code for IE6, IE5
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                // 注册回调函数
                request.onreadystatechange = function (evt) {
                    var request = evt.target;
                    //判断对象状态是交互完成，接收服务器返回的数据
                    if (request.readyState == 4) {
                        if (request.status == 200) {
                            var fileName = request["fileName"];
                            var responseText = request.responseText;
                            var lines = responseText.split("\n");
                            for (var i in lines) {
                                var line = lines[i];
                                var arr = line.split("  ");
                                if (arr.length == 2) {
                                    var key = arr[1].substr(2);
                                    var value = arr[0];
                                    _this._hashDict[key] = value;
                                }
                            }
                            // 在window上挂一份
                            window["__Olympus_Version_hashDict__"] = value;
                        }
                        handler();
                    }
                };
                // 设置连接信息
                request.open("GET", "version.cfg?v=" + new Date().getTime(), true);
                // 发送数据，开始和服务器进行交互
                request.send();
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
    var version = new Version();
    /**
     * 预加载方法
     *
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {()=>void} [callback] 全部加载完成后的回调
     */
    function preload(jsFiles, host, callback) {
        // 使用host默认值
        if (!host)
            host = window.location.origin;
        // 首先初始化version
        version.initialize(preloadOne);
        function preloadOne() {
            if (jsFiles.length <= 0) {
                callback && callback();
            }
            else {
                var url = jsFiles.shift();
                // 如果是相对路径，则变为绝对路径
                if (!isAbsolutePath(url))
                    url = wrapAbsolutePath(url, host);
                // 添加Version
                url = version.wrapHashUrl(url);
                // 请求文件
                var xhr = (window["XMLHttpRequest"] ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
                xhr.responseType = "text";
                xhr.onreadystatechange = onReadyStateChange;
                xhr.open("GET", url, true);
                xhr.send(null);
            }
        }
        function onReadyStateChange(evt) {
            var xhr = evt.target;
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 将脚本内容以script标签形式添加到DOM中，这样运行的脚本不会跨域
                var script = document.createElement("script");
                script.innerHTML = xhr.responseText;
                document.body.appendChild(script);
                // 加载下一个
                preloadOne();
            }
        }
    }
    olympus.preload = preload;
})(olympus || (olympus = {}));
//# sourceMappingURL=Preloader.js.map