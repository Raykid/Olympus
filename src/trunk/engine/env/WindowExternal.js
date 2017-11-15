var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../core/Core", "../../core/injector/Injector"], function (require, exports, Core_1, Injector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        WindowExternal = __decorate([
            Injector_1.Injectable,
            __metadata("design:paramtypes", [])
        ], WindowExternal);
        return WindowExternal;
    }());
    exports.default = WindowExternal;
    /** 再额外导出一个单例 */
    exports.windowExternal = Core_1.core.getInject(WindowExternal);
});
//# sourceMappingURL=WindowExternal.js.map