import {core} from "../../core/Core"
import Command from "../../core/command/Command"
import RequestData, {IRequestParams, commonData} from "./RequestData"
import {extendObject} from "../../utils/ObjectUtil"
import NetMessage from "./NetMessage"
import ResponseData from "./ResponseData"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 请求消息执行命令基类
*/
export default abstract class RequestCommand extends Command
{
    /**
     * 请求消息对象
     * 
     * @type {RequestData}
     * @memberof RequestCommand
     */
    public msg:RequestData;

    public exec():void
    {
        // 指定消息参数连接上公共参数作为参数
        extendObject(this.msg.__params.data, commonData);
        // 发送消息
        this.msg.__policy.sendRequest(this.msg);
        // 派发系统消息
        core.dispatch(NetMessage.NET_REQUEST, this.msg);
    }
}