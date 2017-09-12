import {core} from "../../core/Core"
import Message from "../../core/message/Message"
import RequestData from "./RequestData"
import ResponseData from "./ResponseData"
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
    private _responseDict:{[type:string]:{new():ResponseData}} = {};

    /**
     * 注册一个返回结构体
     * 
     * @param {string} type 返回类型
     * @param {{new():ResponseData}} cls 返回结构体构造器
     * @memberof NetManager
     */
    public registerResponse(type:string, cls:{new():ResponseData}):void
    {
        this._responseDict[type] = cls;
    }

    private netPreResponse_handler(msg:Message):void
    {
        var result:any, request:RequestData;
        [result, request] = msg.params;
        // 解析结果
        var cls:{new():ResponseData} = this._responseDict[request.getType()];
        if(!cls) throw new Error("无法找到返回结构体，请先注册");
        var response:ResponseData = new cls();
        response.parse(result);
        // 派发事件
        core.dispatch(NetMessage.NET_ERROR, response, request);
    }

    private netPreError_handler(msg:Message):void
    {
        var err:Error, request:RequestData;
        [err, request] = msg.params;
        // 派发事件
        core.dispatch(NetMessage.NET_ERROR, err, request);
    }
}
/** 再额外导出一个单例 */
export const netManager:NetManager = global.Inject.getInject(NetManager)