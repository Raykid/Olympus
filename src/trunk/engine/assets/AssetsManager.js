var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/injector/Injector", "../../core/Core", "../../utils/HTTPUtil", "../version/Version"], function (require, exports, Injector_1, Core_1, HTTPUtil_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-26
     * @modify date 2017-10-26
     *
     * 资源管理器
    */
    var AssetsManager = /** @class */ (function () {
        function AssetsManager() {
            this._keyDict = {};
            this._assetsDict = {};
        }
        /**
         * @private
         */
        AssetsManager.prototype.configPath = function (arg1, arg2) {
            if (typeof arg1 == "string") {
                this._keyDict[arg1] = arg2;
            }
            else {
                for (var key in arg1) {
                    this._keyDict[key] = arg1[key];
                }
            }
        };
        /**
         * 获取资源，同步的，且如果找不到资源并不会触发加载
         *
         * @param {string} keyOrPath 资源的短名称或路径
         * @returns {*}
         * @memberof AssetsManager
         */
        AssetsManager.prototype.getAssets = function (keyOrPath) {
            var path = this._keyDict[keyOrPath] || keyOrPath;
            return this._assetsDict[path];
        };
        /**
         * 加载资源，如果已加载过则同步回调，如果未加载则加载后异步回调
         *
         * @param {string|string[]} keyOrPath 资源短名称或资源路径
         * @param {(assets?:any|any[])=>void} complete 完成回调，如果加载失败则参数是个Error对象
         * @param {XMLHttpRequestResponseType} [responseType] 加载类型
         * @returns {void}
         * @memberof AssetsManager
         */
        AssetsManager.prototype.loadAssets = function (keyOrPath, complete, responseType) {
            var _this = this;
            // 非空判断
            if (!keyOrPath) {
                complete();
                return;
            }
            // 获取路径
            if (keyOrPath instanceof Array) {
                // 是个数组，转换成单一名称或对象
                var results = [];
                var onGetOne = function (result) {
                    // 记录结果
                    results.push(result);
                    // 获取下一个
                    getOne();
                };
                var getOne = function () {
                    if (keyOrPath.length <= 0)
                        complete(results);
                    else
                        _this.loadAssets(keyOrPath.shift(), onGetOne);
                };
                getOne();
            }
            else {
                // 是单一名称或对象
                var path = this._keyDict[keyOrPath] || keyOrPath;
                // 获取值
                var value = this._assetsDict[path];
                if (value instanceof Array) {
                    // 正在加载中，等待之
                    value.push(complete);
                }
                else if (value) {
                    // 已经加载过了，直接返回
                    complete(value);
                }
                else {
                    // 没有就去加载
                    this._assetsDict[path] = value = [complete];
                    HTTPUtil_1.load({
                        url: Version_1.version.wrapHashUrl(path),
                        useCDN: true,
                        responseType: responseType,
                        onResponse: function (result) {
                            // 记录结果
                            _this._assetsDict[path] = result;
                            // 通知各个回调
                            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                                var handler = value_1[_i];
                                handler(result);
                            }
                        },
                        onError: function (err) {
                            // 移除结果
                            delete _this._assetsDict[path];
                            // 通知各个回调
                            for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                                var handler = value_2[_i];
                                handler(err);
                            }
                        }
                    });
                }
            }
        };
        AssetsManager = __decorate([
            Injector_1.Injectable
        ], AssetsManager);
        return AssetsManager;
    }());
    exports.default = AssetsManager;
    /** 再额外导出一个单例 */
    exports.assetsManager = Core_1.core.getInject(AssetsManager);
});
//# sourceMappingURL=AssetsManager.js.map