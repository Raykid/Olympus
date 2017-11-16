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

export interface IResponseParams
{
    type:string;
    request?:RequestData;// 如果消息可以配对则有这个对象
    [key:string]:any;// 其他可能需要的参数
}

export default abstract class ResponseData extends DataType
{
    /**
     * 返回参数
     * 
     * @abstract
     * @type {IResponseParams}
     * @memberof ResponseType
     */
    public abstract __params:IResponseParams;
}

export interface IResponseDataConstructor
{
    new():ResponseData;
    readonly type:string;
}