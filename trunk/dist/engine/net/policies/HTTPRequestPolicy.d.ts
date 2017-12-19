import IRequestPolicy from "../IRequestPolicy";
import RequestData from "../RequestData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * HTTP请求策略
*/
export declare class HTTPRequestPolicy implements IRequestPolicy {
    /**
     * 发送请求逻辑
     *
     * @param {RequestData} request 请求数据
     * @memberof HTTPRequestPolicy
     */
    sendRequest(request: RequestData): void;
}
declare const _default: HTTPRequestPolicy;
export default _default;
