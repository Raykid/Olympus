import MessageType from "./MessageType"
import RequestMessage from "./RequestMessage"
import IMessage from "../../core/message/IMessage"

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
    protocol:string;
    method:null|"GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"PATCH"|"MOVE"|"COPY"|"LINK"|"UNLINK"|"WRAPPED"|"Extension-mothed";
    data:any;
    request?:RequestMessage;// 如果消息可以配对则有这个对象
    error?:Error;// 如果请求出错了则有这个对象
}

export default abstract class ResponseMessage extends MessageType implements IMessage
{
    /**
     * 返回参数
     * 
     * @abstract
     * @type {IResponseParams}
     * @memberof ResponseType
     */
    public abstract __params:IResponseParams;

    /**
     * 获取返回消息类型字符串
     * 
     * @returns {string} 
     * @memberof ResponseMessage
     */
    public getType():string
    {
        return this.__params.type;
    }
}