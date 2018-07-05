import { load, IHTTPRequestParams } from "../../../utils/HTTPUtil";
import IRequestPolicy from "../IRequestPolicy";
import RequestData, { IRequestParams } from "../RequestData";
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
export class HTTPRequestPolicy implements IRequestPolicy
{
    /**
     * 发送请求逻辑
     * 
     * @param {RequestData} request 请求数据
     * @memberof HTTPRequestPolicy
     */
    public sendRequest(request:RequestData):void
    {
        // 取到参数
        var params:IRequestParams = request.__params;
        // 修改数据
        var httpParams:IHTTPRequestParams = extendObject({
            url: environment.toHostURL(params.path, params.hostIndex),
            onResponse: result=>netManager.__onResponse(request.__params.response.type, result, request),
            onError: err=>netManager.__onError(request.__params.response.type, err, request),
            headerDict: {}
        }, params);
        // 发送
        load(httpParams);
    }
}

/** 再额外导出一个实例 */
export default new HTTPRequestPolicy();