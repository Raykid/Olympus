import { load } from "../../../utils/HTTPUtil";
import { environment } from "../../env/Environment";
import { netManager } from "../NetManager";
import { extendObject } from "../../../utils/ObjectUtil";
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
        var httpParams = extendObject({
            url: environment.toHostURL(params.path, params.hostIndex),
            onResponse: function (result) { return netManager.__onResponse(request.__params.response.type, result, request); },
            onError: function (err) { return netManager.__onError(request.__params.response.type, err, request); },
            headerDict: {}
        }, params);
        // 发送
        load(httpParams);
    };
    return HTTPRequestPolicy;
}());
export { HTTPRequestPolicy };
/** 再额外导出一个实例 */
export default new HTTPRequestPolicy();
