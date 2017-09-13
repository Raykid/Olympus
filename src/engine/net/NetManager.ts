import {core} from "../../core/Core"
import Message from "../../core/message/Message"
import CoreMessage from "../../core/message/CoreMessage"
import {extendObject} from "../../utils/ObjectUtil"
import RequestData, {commonData} from "./RequestData"
import ResponseData, {ResponseDataConstructor} from "./ResponseData"
import NetMessage from "./NetMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * 
 * 网络管理器
*/
@Injectable
export default class NetManager
{
    private _responseDict:{[type:string]:ResponseDataConstructor} = {};
    /**
     * 注册一个返回结构体
     * 
     * @param {string} type 返回类型
     * @param {ResponseDataConstructor} cls 返回结构体构造器
     * @memberof NetManager
     */
    public registerResponse(cls:ResponseDataConstructor):void
    {
        this._responseDict[cls.getType()] = cls;
    }

    private messageDispatched_handler(msg:CoreMessage):void
    {
        var netMsg:RequestData = msg.getMessage() as RequestData;
        // 如果消息是通讯消息则做处理
        if(msg instanceof RequestData)
        {
            // 指定消息参数连接上公共参数作为参数
            extendObject(netMsg.__params.data, commonData);
            // 发送消息
            netMsg.__policy.sendRequest(netMsg);
            // 派发系统消息
            core.dispatch(NetMessage.NET_REQUEST, netMsg);
        }
    }
}
/** 再额外导出一个单例 */
export const netManager:NetManager = global.Inject.getInject(NetManager)

/** 这里导出不希望用户使用的方法，供框架内使用 */
export function __onResponse(result:any, request?:RequestData):void|never
{
    // 解析结果
    var cls:ResponseDataConstructor = this._responseDict[request.getType()];
    if(cls)
    {
        var response:ResponseData = new cls();
        response.parse(result);
        // 派发事件
        core.dispatch(NetMessage.NET_ERROR, response, request);
    }
    else
    {
        console.warn("没有找到返回结构体定义：" + request.getType());
    }
}

export function __onError(err:Error, request?:RequestData):void
{
    // 派发事件
    core.dispatch(NetMessage.NET_ERROR, err, request);
}