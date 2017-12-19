var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    PlatformManager = __decorate([
        Injectable
    ], PlatformManager);
    return PlatformManager;
}());
export default PlatformManager;
/** 再额外导出一个单例 */
export var platformManager = core.getInject(PlatformManager);
