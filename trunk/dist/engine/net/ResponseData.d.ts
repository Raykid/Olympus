import DataType from "./DataType";
import RequestData from "./RequestData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 通讯返回消息基类
*/
export interface IResponseParams {
    type: string;
    request?: RequestData;
    [key: string]: any;
}
export default abstract class ResponseData extends DataType {
    /**
     * 返回参数
     *
     * @abstract
     * @type {IResponseParams}
     * @memberof ResponseType
     */
    abstract __params: IResponseParams;
}
export interface IResponseDataConstructor {
    new (): ResponseData;
    readonly type: string;
}
