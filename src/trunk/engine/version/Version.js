var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/Core", "../../core/injector/Injector", "../../utils/URLUtil"], function (require, exports, Core_1, Injector_1, URLUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 管理文件哈希版本号
    */
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
                            window["__Olympus_Version_hashDict__"] = _this._hashDict;
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
            var reg = /(([a-zA-Z]+:\/+[^\/\?#]+\/)?[^\?#]+)\.([^\?]+)(\?.+)?/;
            var result = reg.exec(url);
            if (result != null) {
                url = result[1] + "-r_" + version + "." + result[3] + (result[4] || "");
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
        Version = __decorate([
            Injector_1.Injectable
        ], Version);
        return Version;
    }());
    exports.default = Version;
    /** 再额外导出一个单例 */
    exports.version = Core_1.core.getInject(Version);
});
//# sourceMappingURL=Version.js.map