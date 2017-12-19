var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * Query类记录通过GET参数传递给框架的参数字典
*/
var Query = /** @class */ (function () {
    function Query() {
        this._params = {};
        var query = window.location.search.substr(1);
        var vars = query.split('&');
        for (var i = 0, len = vars.length; i < len; i++) {
            var pair = vars[i].split('=', 2);
            if (pair.length != 2 || !pair[0])
                continue;
            var name = pair[0];
            var value = pair[1];
            name = decodeURIComponent(name);
            value = decodeURIComponent(value);
            // decode twice for ios
            name = decodeURIComponent(name);
            value = decodeURIComponent(value);
            this._params[name] = value;
        }
    }
    Object.defineProperty(Query.prototype, "params", {
        /**
         * 获取全部Query参数
         *
         * @readonly
         * @type {{[key:string]:string}}
         * @memberof Query
         */
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取GET参数
     *
     * @param {string} key 参数key
     * @returns {string} 参数值
     * @memberof Query
     */
    Query.prototype.getParam = function (key) {
        return this._params[key];
    };
    Query = __decorate([
        Injectable,
        __metadata("design:paramtypes", [])
    ], Query);
    return Query;
}());
export default Query;
/** 再额外导出一个单例 */
export var query = core.getInject(Query);
