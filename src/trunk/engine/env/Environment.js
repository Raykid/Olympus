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
     * 环境参数
    */
    var Environment = /** @class */ (function () {
        function Environment() {
        }
        Object.defineProperty(Environment.prototype, "env", {
            /**
             * 获取当前环境字符串
             *
             * @readonly
             * @type {string}
             * @memberof Environment
             */
            get: function () {
                return this._env;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "hostsDict", {
            /**
             * 获取域名字典
             *
             * @readonly
             * @type {{[env:string]:string[]}}
             * @memberof Environment
             */
            get: function () {
                return this._hostsDict;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取当前环境下某索引处的消息域名
         *
         * @param {number} [index=0] 域名字典索引，默认是0
         * @returns {string} 域名字符串，如果取不到则使用当前域名
         * @memberof Environment
         */
        Environment.prototype.getHost = function (index) {
            if (index === void 0) { index = 0; }
            var hosts = this._hostsDict[this._env];
            if (!hosts)
                return window.location.origin;
            return (hosts[index] || window.location.origin);
        };
        Object.defineProperty(Environment.prototype, "cdnsDict", {
            /**
             * 获取CDN字典
             *
             * @readonly
             * @type {{[env:string]:string[]}}
             * @memberof Environment
             */
            get: function () {
                return this._cdnsDict;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "curCDNHost", {
            /**
             * 获取当前使用的CDN域名
             *
             * @readonly
             * @type {string}
             * @memberof Environment
             */
            get: function () {
                var cdns = this._cdnsDict[this._env];
                if (!cdns)
                    return window.location.origin;
                return (cdns[this._curCDNIndex] || window.location.origin);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 切换下一个CDN
         *
         * @returns {boolean} 是否已经到达CDN列表的终点，回到了起点
         * @memberof Environment
         */
        Environment.prototype.nextCDN = function () {
            var cdns = this._cdnsDict[this._env];
            if (!cdns)
                return true;
            this._curCDNIndex++;
            if (this._curCDNIndex >= cdns.length) {
                this._curCDNIndex = 0;
                return true;
            }
            return false;
        };
        /**
         * 初始化Environment对象，因为该对象保存的数据基本来自项目初始参数，所以必须有initialize方法
         *
         * @param {string} [env] 当前所属环境字符串
         * @param {{[env:string]:string[]}} [hostsDict] host数组字典
         * @param {{[env:string]:string[]}} [cdnsDict] cdn数组字典
         * @memberof Environment
         */
        Environment.prototype.initialize = function (env, hostsDict, cdnsDict) {
            this._env = env || "dev";
            this._hostsDict = hostsDict || {};
            this._cdnsDict = cdnsDict || {};
            this._curCDNIndex = 0;
        };
        /**
         * 让url的域名变成消息域名
         *
         * @param {string} url 要转变的url
         * @param {number} [index=0] host索引，默认0
         * @returns {string} 转变后的url
         * @memberof Environment
         */
        Environment.prototype.toHostURL = function (url, index) {
            if (index === void 0) { index = 0; }
            // 加上domain
            url = URLUtil_1.wrapHost(url, this.getHost(index));
            // 返回url
            return url;
        };
        /**
         * 让url的域名变成CDN域名
         *
         * @param {string} url 要转变的url
         * @param {boolean} [forced=false] 是否强制替换host
         * @param {boolean} [infix=true] 是否加入路径中缀，即host之后，index.html之前的部分，默认加入
         * @returns {string} 转变后的url
         * @memberof Environment
         */
        Environment.prototype.toCDNHostURL = function (url, forced, infix) {
            if (forced === void 0) { forced = false; }
            if (infix === void 0) { infix = true; }
            if (infix) {
                // 组织中缀
                var midnameIndex = window.location.pathname.lastIndexOf("/");
                var midname = window.location.pathname.substring(0, midnameIndex + 1);
                return URLUtil_1.wrapHost(url, this.curCDNHost + "/" + midname, forced);
            }
            else {
                // 只替换域名
                return URLUtil_1.wrapHost(url, this.curCDNHost, forced);
            }
        };
        Environment = __decorate([
            Injector_1.Injectable
        ], Environment);
        return Environment;
    }());
    exports.default = Environment;
    /** 再额外导出一个单例 */
    exports.environment = Core_1.core.getInject(Environment);
});
//# sourceMappingURL=Environment.js.map