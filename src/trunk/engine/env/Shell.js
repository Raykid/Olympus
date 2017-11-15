var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/injector/Injector", "../../core/Core"], function (require, exports, Injector_1, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-23
     * @modify date 2017-10-23
     *
     * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
    */
    var Shell = /** @class */ (function () {
        function Shell() {
        }
        Object.defineProperty(Shell.prototype, "type", {
            /**
             * 获取当前外壳类型
             *
             * @readonly
             * @type {string}
             * @memberof Shell
             */
            get: function () {
                return "web";
            },
            enumerable: true,
            configurable: true
        });
        /*************************** 下面是页面跳转接口 ***************************/
        /**
         * 刷新页面
         *
         * @param {{
         *         forcedReload?:boolean, // false表示允许从缓存取，true表示强制从服务器取，默认是false
         *         url?:string, // 传递则使用新URL刷新页面
         *         replace?:boolean // 如果有新url，则表示是否要替换当前浏览历史
         *     }} [params]
         * @memberof Shell
         */
        Shell.prototype.reload = function (params) {
            if (!params)
                window.location.reload();
            else if (!params.url)
                window.location.reload(params.forcedReload);
            else if (!params.replace)
                window.location.href = params.url;
            else
                window.location.replace(params.url);
        };
        /**
         * 打开一个新页面
         *
         * @param {{
         *         url?:string, // 新页面地址，不传则不更新地址
         *         name?:string, // 给新页面命名，或导航到已有页面
         *         replace?:boolean, // 是否替换当前浏览历史条目，默认false
         *         features:{[key:string]:any} // 其他可能的参数
         *     }} [params]
         * @memberof Shell
         */
        Shell.prototype.open = function (params) {
            if (!params) {
                window.open();
            }
            else {
                var features = undefined;
                if (params.features) {
                    features = [];
                    for (var key in params.features) {
                        features.push(key + "=" + params.features[key]);
                    }
                }
                window.open(params.url, params.name, features && features.join(","), params.replace);
            }
        };
        /**
         * 关闭窗口
         *
         * @memberof Shell
         */
        Shell.prototype.close = function () {
            window.close();
        };
        /*************************** 下面是本地存储接口 ***************************/
        /**
         * 获取本地存储
         *
         * @param {string} key 要获取值的键
         * @returns {string} 获取的值
         * @memberof Shell
         */
        Shell.prototype.localStorageGet = function (key) {
            return window.localStorage.getItem(key);
        };
        /**
         * 设置本地存储
         *
         * @param {string} key 要设置的键
         * @param {string} value 要设置的值
         * @memberof Shell
         */
        Shell.prototype.localStorageSet = function (key, value) {
            window.localStorage.setItem(key, value);
        };
        /**
         * 移除本地存储
         *
         * @param {string} key 要移除的键
         * @memberof Shell
         */
        Shell.prototype.localStorageRemove = function (key) {
            window.localStorage.removeItem(key);
        };
        /**
         * 清空本地存储
         *
         * @memberof Shell
         */
        Shell.prototype.localStorageClear = function () {
            window.localStorage.clear();
        };
        Shell = __decorate([
            Injector_1.Injectable
        ], Shell);
        return Shell;
    }());
    exports.default = Shell;
    /** 再额外导出一个单例 */
    exports.shell = Core_1.core.getInject(Shell);
});
//# sourceMappingURL=Shell.js.map