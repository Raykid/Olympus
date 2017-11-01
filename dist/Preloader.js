/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 对象工具集
*/
define("utils/ObjectUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    function extendObject(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) {
            if (!source)
                return;
            for (var propName in source) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            }
        });
        return target;
    }
    exports.extendObject = extendObject;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    function cloneObject(target, deep) {
        if (deep === void 0) { deep = false; }
        if (target == null)
            return null;
        var newObject = {};
        for (var key in target) {
            var value = target[key];
            if (deep && typeof value == "object") {
                // 如果是深表复制，则需要递归复制子对象
                value = cloneObject(value, true);
            }
            newObject[key] = value;
        }
        return newObject;
    }
    exports.cloneObject = cloneObject;
    /**
     * 生成一个随机ID
     */
    function getGUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }
    exports.getGUID = getGUID;
    var _getAutoIncIdMap = {};
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    function getAutoIncId(type) {
        var index = _getAutoIncIdMap[type] || 0;
        _getAutoIncIdMap[type] = index++;
        return type + "-" + index;
    }
    exports.getAutoIncId = getAutoIncId;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    function isEmpty(obj) {
        var result = true;
        for (var key in obj) {
            result = false;
            break;
        }
        return result;
    }
    exports.isEmpty = isEmpty;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    function trimData(data) {
        for (var key in data) {
            if (data[key] == null) {
                delete data[key];
            }
        }
        return data;
    }
    exports.trimData = trimData;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    exports.extendsClass = (function () {
        var extendStatics = Object["setPrototypeOf"] ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var hash = 0;
    var hashTypes = ["object", "function"];
    /**
     * 获取一个对象的对象哈希字符串
     *
     * @export
     * @param {*} target 任意对象，可以是基础类型或null
     * @returns {string} 哈希值
     */
    function getObjectHash(target) {
        if (target == null)
            return "__object_hash_0__";
        var key = "__object_hash__";
        var value;
        // 只有当前对象上有key才算
        if (target.hasOwnProperty(key))
            value = target[key];
        // 如果已经有哈希值则直接返回
        if (value)
            return value;
        // 如果是基础类型则直接返回对应字符串
        var type = typeof target;
        if (hashTypes.indexOf(type) < 0)
            return type + ":" + target;
        // 如果是复杂类型则返回计算的哈希值并打上标签
        var value = "__object_hash_" + (++hash) + "__";
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: false,
            writable: false,
            value: value
        });
        return value;
    }
    exports.getObjectHash = getObjectHash;
    /**
     * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
     *
     * @export
     * @param {...any[]} targets 希望获取哈希值的对象列表
     * @returns {string} 多个对象共同作用下的哈希值
     */
    function getObjectHashs() {
        var targets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targets[_i] = arguments[_i];
        }
        var values = targets.map(function (target) { return getObjectHash(target); });
        return values.join("|");
    }
    exports.getObjectHashs = getObjectHashs;
});
define("utils/URLUtil", ["require", "exports", "utils/ObjectUtil"], function (require, exports, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.trimURL = trimURL;
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
    exports.isAbsolutePath = isAbsolutePath;
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
    exports.validateProtocol = validateProtocol;
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
    exports.wrapHost = wrapHost;
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
    exports.wrapAbsolutePath = wrapAbsolutePath;
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
    exports.getHostAndPathname = getHostAndPathname;
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
    exports.getPath = getPath;
    /**
     * 获取URL的文件名
     * @param url 要分析的URL
     */
    function getName(url) {
        // 先去掉get参数和hash
        url = url.split("#")[0].split("?")[0];
        // 然后获取到文件名
        var urlArr = url.split("/");
        var fileName = urlArr[urlArr.length - 1];
        return fileName;
    }
    exports.getName = getName;
    /**
     * 解析URL
     * @param url 要被解析的URL字符串
     * @returns {any} 解析后的URLLocation结构体
     */
    function parseUrl(url) {
        var regExp = /(([^:]+:)\/\/(([^:\/\?#]+)(:(\d+))?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
        var match = regExp.exec(url);
        if (match) {
            return {
                href: match[0] || "",
                origin: match[1] || "",
                protocol: match[2] || "",
                host: match[3] || "",
                hostname: match[4] || "",
                port: match[6] || "",
                pathname: match[7] || "",
                search: match[8] || "",
                hash: (match[9] == "#" ? "" : match[9]) || ""
            };
        }
        else {
            throw new Error("传入parseUrl方法的参数不是一个完整的URL：" + url);
        }
    }
    exports.parseUrl = parseUrl;
    /**
     * 解析url查询参数
     * @TODO 添加对jquery编码方式的支持
     * @param url url
     */
    function getQueryParams(url) {
        var index = url.indexOf("#");
        if (index >= 0) {
            url = url.substring(0, index);
        }
        index = url.indexOf("?");
        if (index < 0)
            return {};
        var queryString = url.substring(index + 1);
        var params = {};
        var kvs = queryString.split("&");
        kvs.forEach(function (kv) {
            var pair = kv.split("=", 2);
            if (pair.length !== 2 || !pair[0]) {
                console.log("[URLUtil] invalid query params: " + kv);
                return;
            }
            var name = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            params[name] = value;
        });
        return params;
    }
    exports.getQueryParams = getQueryParams;
    /**
     * 将参数连接到指定URL后面
     * @param url url
     * @param params 一个map，包含要连接的参数
     * @return string 连接后的URL地址
     */
    function joinQueryParams(url, params) {
        if (url == null)
            throw new Error("url不能为空");
        var oriParams = getQueryParams(url);
        var targetParams = ObjectUtil_1.extendObject(oriParams, params);
        var hash = parseUrl(url).hash;
        url = getHostAndPathname(url);
        var isFirst = true;
        for (var key in targetParams) {
            if (isFirst) {
                url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
                isFirst = false;
            }
            else {
                url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
            }
        }
        // 加上hash
        url += hash;
        return url;
    }
    exports.joinQueryParams = joinQueryParams;
    /**
     * 将参数链接到URL的hash后面
     * @param url 如果传入的url没有注明hash模块，则不会进行操作
     * @param params 一个map，包含要连接的参数
     */
    function joinHashParams(url, params) {
        if (url == null)
            throw new Error("url不能为空");
        var hash = parseUrl(url).hash;
        if (hash == null || hash == "")
            return url;
        for (var key in params) {
            var value = params[key];
            if (value && typeof value != "string")
                value = value.toString();
            hash += ((hash.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
        return (url.split("#")[0] + hash);
    }
    exports.joinHashParams = joinHashParams;
});
define("utils/VersionUtil", ["require", "exports", "utils/URLUtil"], function (require, exports, URLUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-01
     * @modify date 2017-11-01
     *
     * 版本号管理工具，使用静态工具类做是因为可能会在Engine之外使用，例如Preloader中
    */
    var InitStatus;
    (function (InitStatus) {
        /** 未初始化 */
        InitStatus[InitStatus["UNINITIALIZED"] = 0] = "UNINITIALIZED";
        /** 初始化中 */
        InitStatus[InitStatus["INITIALIZING"] = 1] = "INITIALIZING";
        /** 已初始化 */
        InitStatus[InitStatus["INITIALIZED"] = 2] = "INITIALIZED";
    })(InitStatus || (InitStatus = {}));
    var VersionUtil = /** @class */ (function () {
        function VersionUtil() {
        }
        /**
         * 初始化哈希版本工具
         *
         * @static
         * @param {()=>void} [handler] 回调
         * @memberof VersionUtil
         */
        VersionUtil.initialize = function (handler) {
            var _this = this;
            switch (VersionUtil._initStatus) {
                case InitStatus.INITIALIZED:
                    // 已初始化，直接调用回调
                    handler && handler();
                    break;
                case InitStatus.INITIALIZING:
                    // 正在初始化，仅记录回调
                    if (VersionUtil._handlerList.indexOf(handler) < 0)
                        VersionUtil._handlerList.push(handler);
                    break;
                case InitStatus.UNINITIALIZED:
                    // 尚未初始化
                    VersionUtil._initStatus = InitStatus.INITIALIZING;
                    // 记录回调
                    if (VersionUtil._handlerList.indexOf(handler) < 0)
                        VersionUtil._handlerList.push(handler);
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
                            }
                            // 修改状态
                            VersionUtil._initStatus = InitStatus.INITIALIZED;
                            // 执行回调
                            for (var j = 0, len = VersionUtil._handlerList.length; j < len; j++) {
                                var handler = VersionUtil._handlerList.shift();
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
        };
        /**
         * 获取文件哈希值，如果没有文件哈希值则返回null
         *
         * @static
         * @param {string} url 文件的URL
         * @returns {string} 文件的哈希值，或者null
         * @memberof VersionUtil
         */
        VersionUtil.getHash = function (url) {
            url = URLUtil_1.trimURL(url);
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
         * @static
         * @param {string} url 原始url
         * @returns {string} 哈希版本url
         * @memberof VersionUtil
         */
        VersionUtil.wrapHashUrl = function (url) {
            var hash = this.getHash(url);
            if (hash != null) {
                url = this.joinVersion(url, hash);
            }
            return url;
        };
        /**
         * 添加-r_XXX形式版本号
         *
         * @static
         * @param {string} url
         * @param {string} version 版本号，以数字和小写字母组成
         * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
         * @memberof VersionUtil
         */
        VersionUtil.joinVersion = function (url, version) {
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
         * @static
         * @param {string} url url
         * @returns {string} 移除版本号后的url
         * @memberof VersionUtil
         */
        VersionUtil.removeVersion = function (url) {
            // 去掉-r_XXX版本号，如果有
            url = url.replace(/\-r_[a-z0-9]+\./ig, ".");
            return url;
        };
        VersionUtil._initStatus = InitStatus.UNINITIALIZED;
        VersionUtil._hashDict = {};
        VersionUtil._handlerList = [];
        return VersionUtil;
    }());
    exports.default = VersionUtil;
});
define("Preloader", ["require", "exports", "utils/URLUtil", "utils/VersionUtil"], function (require, exports, URLUtil_2, VersionUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-01
     * @modify date 2017-11-01
     *
     * 预加载器，负责预加载过程
    */
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
        // 首先初始化VersionUtil
        VersionUtil_1.default.initialize(preloadOne);
        function preloadOne() {
            if (jsFiles.length <= 0) {
                callback && callback();
            }
            else {
                var url = jsFiles.shift();
                // 如果是相对路径，则变为绝对路径
                if (!URLUtil_2.isAbsolutePath(url))
                    url = URLUtil_2.wrapAbsolutePath(url, host);
                // 添加Version
                url = VersionUtil_1.default.wrapHashUrl(url);
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
    exports.default = preload;
});
//# sourceMappingURL=Preloader.js.map