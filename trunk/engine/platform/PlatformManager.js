import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import WebPlatform from "./WebPlatform";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 平台接口管理器，通过桥接模式统一不同平台的不同接口，从而实现对框架其他模块透明化
*/
var PlatformManager = /** @class */ (function () {
    function PlatformManager() {
        /**
         * 平台接口实现对象，默认是普通网页平台，也可以根据需要定制
         *
         * @type {IPlatform}
         * @memberof PlatformManager
         */
        this.platform = new WebPlatform();
    }
    /**
     * 刷新当前页面
     *
     * @memberof PlatformManager
     */
    PlatformManager.prototype.reload = function () {
        this.platform.reload();
    };
    PlatformManager = tslib_1.__decorate([
        Injectable
    ], PlatformManager);
    return PlatformManager;
}());
export default PlatformManager;
/** 再额外导出一个单例 */
export var platformManager = core.getInject(PlatformManager);
