import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 *
 * External类为window.external参数字典包装类
*/
var WindowExternal = /** @class */ (function () {
    function WindowExternal() {
        this._params = {};
        // 处理window.external
        try {
            if (!(window.external && typeof window.external === "object")) {
                window.external = {};
            }
        }
        catch (err) {
            window.external = {};
        }
        this._params = window.external;
    }
    Object.defineProperty(WindowExternal.prototype, "params", {
        /**
         * 获取全部window.external参数
         *
         * @readonly
         * @type {{[key:string]:string}}
         * @memberof WindowExternal
         */
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取window.external中的参数
     *
     * @param {string} key 参数名
     * @returns {*} 参数值
     * @memberof External
     */
    WindowExternal.prototype.getParam = function (key) {
        return this._params[key];
    };
    WindowExternal = tslib_1.__decorate([
        Injectable,
        tslib_1.__metadata("design:paramtypes", [])
    ], WindowExternal);
    return WindowExternal;
}());
export default WindowExternal;
/** 再额外导出一个单例 */
export var windowExternal = core.getInject(WindowExternal);
