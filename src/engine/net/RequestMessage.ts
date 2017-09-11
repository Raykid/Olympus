import IMessage from "../../core/message/IMessage"
import IRequestPolicy from "./IRequestPolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 通讯发送消息基类
*/

export interface IRequestParams
{
    type:string;
    policy:IRequestPolicy;
    data:any;
}

export default abstract class RequestMessage implements IMessage
{
    /**
     * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
     * 
     * @type {*}
     * @memberof RequestMessage
     */
    public __userData:any = {};
    /**
     * 请求参数，可以运行时修改
     * 
     * @type {IRequestParams}
     * @memberof RequestMessage
     */
    public abstract __params:IRequestParams;

    /**
     * 获取请求消息类型字符串
     * 
     * @returns {string} 请求消息类型字符串
     * @memberof RequestMessage
     */
    public getType():string
    {
        return this.__params.type;
    }
}

/** 导出公共消息参数对象 */
export var commonData:any = {};