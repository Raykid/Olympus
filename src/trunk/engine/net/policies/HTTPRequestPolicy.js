define(["require", "exports", "../../../utils/HTTPUtil", "../../env/Environment", "../NetManager", "../../../utils/ObjectUtil"], function (require, exports, HTTPUtil_1, Environment_1, NetManager_1, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * HTTP请求策略
    */
    var HTTPRequestPolicy = /** @class */ (function () {
        function HTTPRequestPolicy() {
        }
        /**
         * 发送请求逻辑
         *
         * @param {RequestData} request 请求数据
         * @memberof HTTPRequestPolicy
         */
        HTTPRequestPolicy.prototype.sendRequest = function (request) {
            // 取到参数
            var params = request.__params;
            // 修改数据
            var httpParams = ObjectUtil_1.extendObject({
                url: Environment_1.environment.toHostURL(params.path, params.hostIndex),
                onResponse: function (result) { return NetManager_1.netManager.__onResponse(request.__params.response.type, result, request); },
                onError: function (err) { return NetManager_1.netManager.__onError(err, request); },
                headerDict: {}
            }, params);
            // ajax请求都统一设置withCredentials
            httpParams.headerDict["withCredentials"] = "true";
            // 发送
            HTTPUtil_1.load(httpParams);
        };
        return HTTPRequestPolicy;
    }());
    exports.HTTPRequestPolicy = HTTPRequestPolicy;
    /** 再额外导出一个实例 */
    exports.default = new HTTPRequestPolicy();
});
//# sourceMappingURL=HTTPRequestPolicy.js.map