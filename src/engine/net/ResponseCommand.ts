import {core} from "../../core/Core"
import Command from "../../core/command/Command"
import NetMessage from "./NetMessage"
import ResponseMessage, {IResponseParams} from "./ResponseMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 返回消息执行命令基类
*/
export default abstract class ResponseCommand extends Command
{
    /**
     * 返回消息体
     * 
     * @type {ResponseMessage}
     * @memberof ResponseCommand
     */
    public msg:ResponseMessage;

    public exec():void
    {
        var params:IResponseParams = this.msg.__params;
        // 派发消息
        var type:string = (params.error ? NetMessage.NET_ERROR : NetMessage.NET_RESPONSE);
        core.dispatch(type, this.msg);
    }
}