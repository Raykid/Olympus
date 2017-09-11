import {core} from "../../core/Core"
import Command from "../../core/command/Command"
import RequestMessage, {IRequestParams, commonData} from "./RequestMessage"
import {extendObject} from "../../utils/ObjectUtil"
import {wrapHost, validateProtocol} from "../../utils/URLUtil"
import NetMessage from "./NetMessage"
import ResponseMessage from "./ResponseMessage"

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
     * @type {RequestMessage}
     * @memberof RequestCommand
     */
    public msg:RequestMessage;

    public exec():void
    {
        // 按照框架规则处理一下数据
        var params:IRequestParams = this.msg.__params;
        // 取到url
        var url:string = wrapHost(params.policy.path, params.policy.host, true);
        // 合法化一下protocol
        url = validateProtocol(url);
        // 指定消息参数连接上公共参数作为参数
        extendObject(params.data, commonData);
        // 发送消息
        params.policy.sendRequest(url, params.data);
        // 派发系统消息
        core.dispatch(NetMessage.NET_REQUEST, this.msg);
    }
}