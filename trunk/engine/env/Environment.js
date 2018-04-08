import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { wrapHost, getCurOrigin } from "../../utils/URLUtil";
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
        this._env = "dev";
        this._hostsDict = {};
        this._cdnsDict = {};
        this._curCDNIndex = 0;
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
            return getCurOrigin();
        return (hosts[index] || getCurOrigin());
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
                return getCurOrigin();
            return (cdns[this._curCDNIndex] || getCurOrigin());
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
        url = wrapHost(url, this.getHost(index));
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
            return wrapHost(url, this.curCDNHost + "/" + midname, forced);
        }
        else {
            // 只替换域名
            return wrapHost(url, this.curCDNHost, forced);
        }
    };
    Environment = tslib_1.__decorate([
        Injectable
    ], Environment);
    return Environment;
}());
export default Environment;
/** 再额外导出一个单例 */
export var environment = core.getInject(Environment);
