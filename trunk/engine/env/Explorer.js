import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * Explorer类记录浏览器相关数据
*/
/**
 * 浏览器类型枚举
 *
 * @enum {number}
 */
export var ExplorerType;
(function (ExplorerType) {
    ExplorerType[ExplorerType["IE"] = 0] = "IE";
    ExplorerType[ExplorerType["EDGE"] = 1] = "EDGE";
    ExplorerType[ExplorerType["OPERA"] = 2] = "OPERA";
    ExplorerType[ExplorerType["FIREFOX"] = 3] = "FIREFOX";
    ExplorerType[ExplorerType["SAFARI"] = 4] = "SAFARI";
    ExplorerType[ExplorerType["CHROME"] = 5] = "CHROME";
    ExplorerType[ExplorerType["OTHERS"] = 6] = "OTHERS";
})(ExplorerType || (ExplorerType = {}));
var Explorer = /** @class */ (function () {
    function Explorer() {
        //取得浏览器的userAgent字符串
        var userAgent = navigator.userAgent;
        // 判断浏览器类型
        var regExp;
        var result;
        if (window["ActiveXObject"] != null) {
            // IE浏览器
            this._type = ExplorerType.IE;
            // 获取IE版本号
            regExp = new RegExp("MSIE ([^ ;\\)]+);");
            result = regExp.exec(userAgent);
            if (result != null) {
                // 是IE8以前
                this._version = result[1];
            }
            else {
                // 是IE9以后
                regExp = new RegExp("rv:([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
        }
        else if (userAgent.indexOf("Edge") > -1) {
            // Edge浏览器
            this._type = ExplorerType.EDGE;
            // 获取Edge版本号
            regExp = new RegExp("Edge/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Firefox") > -1) {
            // Firefox浏览器
            this._type = ExplorerType.FIREFOX;
            // 获取Firefox版本号
            regExp = new RegExp("Firefox/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Opera") > -1) {
            // Opera浏览器
            this._type = ExplorerType.OPERA;
            // 获取Opera版本号
            regExp = new RegExp("OPR/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Chrome") > -1) {
            // Chrome浏览器
            this._type = ExplorerType.CHROME;
            // 获取Crhome版本号
            regExp = new RegExp("Chrome/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Safari") > -1) {
            // Safari浏览器
            this._type = ExplorerType.SAFARI;
            // 获取Safari版本号
            regExp = new RegExp("Safari/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else {
            // 其他浏览器
            this._type = ExplorerType.OTHERS;
            // 随意设置一个版本号
            this._version = "0.0";
        }
        // 赋值类型字符串
        this._typeStr = ExplorerType[this._type];
        // 赋值大版本号
        this._bigVersion = this._version.split(".")[0];
    }
    Object.defineProperty(Explorer.prototype, "type", {
        /**
         * 获取浏览器类型枚举值
         *
         * @readonly
         * @type {ExplorerType}
         * @memberof Explorer
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Explorer.prototype, "typeStr", {
        /**
         * 获取浏览器类型字符串
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        get: function () {
            return this._typeStr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Explorer.prototype, "version", {
        /**
         * 获取浏览器版本
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Explorer.prototype, "bigVersion", {
        /**
         * 获取浏览器大版本
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        get: function () {
            return this._bigVersion;
        },
        enumerable: true,
        configurable: true
    });
    Explorer = tslib_1.__decorate([
        Injectable,
        tslib_1.__metadata("design:paramtypes", [])
    ], Explorer);
    return Explorer;
}());
export default Explorer;
/** 再额外导出一个单例 */
export var explorer = core.getInject(Explorer);
