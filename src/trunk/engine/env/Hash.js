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
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
    */
    var Hash = /** @class */ (function () {
        function Hash() {
            this._params = {};
            this._direct = false;
            this._keepHash = false;
            this._hash = window.location.hash;
            var reg = /#([^\?&]+)(\?([^\?&=]+=[^\?&=]+)(&([^\?&=]+=[^\?&=]+))*)?/;
            var result = reg.exec(this._hash);
            if (result) {
                // 解析模块名称
                this._moduleName = result[1];
                // 解析模块参数
                var paramsStr = result[2];
                if (paramsStr != null) {
                    paramsStr = paramsStr.substr(1);
                    var params = paramsStr.split("&");
                    for (var i = 0, len = params.length; i < len; i++) {
                        var pair = params[i];
                        if (pair != null) {
                            var temp = pair.split("=");
                            // 键和值都要做一次URL解码
                            var key = decodeURIComponent(temp[0]);
                            var value = decodeURIComponent(temp[1]);
                            this._params[key] = value;
                        }
                    }
                }
                // 处理direct参数
                this._direct = (this._params.direct == "true");
                delete this._params.direct;
                // 处理keepHash参数
                this._keepHash = (this._params.keepHash == "true");
                delete this._params.keepHash;
                // 如果keepHash不是true，则移除哈希值
                if (!this._keepHash)
                    window.location.hash = "";
            }
        }
        Object.defineProperty(Hash.prototype, "hash", {
            /**
             * 获取原始的哈希字符串
             *
             * @readonly
             * @type {string}
             * @memberof Hash
             */
            get: function () {
                return this._hash;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "moduleName", {
            /**
             * 获取模块名
             *
             * @readonly
             * @type {string}
             * @memberof Hash
             */
            get: function () {
                return this._moduleName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "params", {
            /**
             * 获取传递给模块的参数
             *
             * @readonly
             * @type {{[key:string]:string}}
             * @memberof Hash
             */
            get: function () {
                return this._params;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "direct", {
            /**
             * 获取是否直接跳转模块
             *
             * @readonly
             * @type {boolean}
             * @memberof Hash
             */
            get: function () {
                return this._direct;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "keepHash", {
            /**
             * 获取是否保持哈希值
             *
             * @readonly
             * @type {boolean}
             * @memberof Hash
             */
            get: function () {
                return this._keepHash;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取指定哈希参数
         *
         * @param {string} key 参数名
         * @returns {string} 参数值
         * @memberof Hash
         */
        Hash.prototype.getParam = function (key) {
            return this._params[key];
        };
        Hash = __decorate([
            Injector_1.Injectable,
            __metadata("design:paramtypes", [])
        ], Hash);
        return Hash;
    }());
    exports.default = Hash;
    /** 再额外导出一个单例 */
    exports.hash = Core_1.core.getInject(Hash);
});
//# sourceMappingURL=Hash.js.map