/// <reference path="../global/Decorator.ts"/>

import {core} from "../../core/Core"
import Message from "../../core/message/Message"
import CoreMessage from "../../core/message/CoreMessage"
import {extendObject} from "../../utils/ObjectUtil"
import {listenConstruct} from "../../utils/ConstructUtil"
import RequestData, {commonData} from "./RequestData"
import ResponseData, {IResponseDataConstructor} from "./ResponseData"
import NetMessage from "./NetMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * 
 * 网络管理器
*/

export interface ResponseHandler
{
    (response:ResponseData, request?:RequestData):void;
}

@Injectable
export default class NetManager
{
    public constructor()
    {
        core.listen(CoreMessage.MESSAGE_DISPATCHED, this.onMsgDispatched, this);
    }
    
    private onMsgDispatched(msg:CoreMessage):void
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

    private _responseDict:{[type:string]:IResponseDataConstructor} = {};
    /**
     * 注册一个返回结构体
     * 
     * @param {string} type 返回类型
     * @param {IResponseDataConstructor} cls 返回结构体构造器
     * @memberof NetManager
     */
    public registerResponse(cls:IResponseDataConstructor):void
    {
        this._responseDict[cls.getType()] = cls;
    }

    private _responseListeners:{[type:string]:[ResponseHandler, any, boolean][]} = {};
    /**
     * 添加一个通讯返回监听
     * 
     * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof NetManager
     */
    public listenResponse(clsOrType:IResponseDataConstructor|string, handler:ResponseHandler, thisArg?:any, once:boolean=false):void
    {
        var type:string = (typeof clsOrType == "string" ? clsOrType : clsOrType.getType());
        var listeners:[ResponseHandler, any, boolean][] = this._responseListeners[type];
        if(!listeners) this._responseListeners[type] = listeners = [];
        for(var listener of listeners)
        {
            if(handler == listener[0] && thisArg == listener[1] && once == listener[2])
                return;
        }
        listeners.push([handler, thisArg, once]);
    }

    /**
     * 移除一个通讯返回监听
     * 
     * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof NetManager
     */
    public unlistenResponse(clsOrType:IResponseDataConstructor|string, handler:ResponseHandler, thisArg?:any, once:boolean=false):void
    {
        var type:string = (typeof clsOrType == "string" ? clsOrType : clsOrType.getType());
        var listeners:[ResponseHandler, any, boolean][] = this._responseListeners[type];
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var listener:[ResponseHandler, any, boolean] = listeners[i];
                if(handler == listener[0] && thisArg == listener[1] && once == listener[2])
                {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    /** 这里导出不希望用户使用的方法，供框架内使用 */
    public __onResponse(type:string, result:any, request?:RequestData):void|never
    {
        // 解析结果
        var cls:IResponseDataConstructor = this._responseDict[type];
        if(cls)
        {
            var response:ResponseData = new cls();
            response.parse(result);
            // 派发事件
            core.dispatch(NetMessage.NET_RESPONSE, response, request);
            // 触发事件形式监听
            var listeners:[ResponseHandler, any, boolean][] = this._responseListeners[type];
            if(listeners)
            {
                for(var listener of listeners)
                {
                    listener[0].call(listener[1], response, request);
                    // 如果是一次性监听则移除之
                    if(listener[2]) this.unlistenResponse(type, listener[0], listener[1], listener[2]);
                }
            }
        }
        else
        {
            console.warn("没有找到返回结构体定义：" + type);
        }
    }

    public __onError(err:Error, request?:RequestData):void
    {
        // 派发事件
        core.dispatch(NetMessage.NET_ERROR, err, request);
    }
}
/** 再额外导出一个单例 */
export const netManager:NetManager = core.getInject(NetManager)

/*********************** 下面是装饰器方法实现 ***********************/

/** Result */
window["Result"] = function(clsOrType:IResponseDataConstructor|string):MethodDecorator
{
    return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
    {
        // 监听实例化
        listenConstruct(prototype.constructor, function(instance:any):void
        {
            netManager.listenResponse(clsOrType, instance[propertyKey], instance);
        });
    };
};