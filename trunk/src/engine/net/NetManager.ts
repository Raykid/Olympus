import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"
import IMessage from "../../core/message/IMessage";
import CoreMessage from "../../core/message/CoreMessage";
import { extendObject } from "../../utils/ObjectUtil";
import RequestData, { commonData } from "./RequestData";
import ResponseData, { IResponseDataConstructor } from "./ResponseData";
import NetMessage from "./NetMessage";
import * as NetUtil from "./NetUtil";
import { maskManager } from "../mask/MaskManager";
import IObservable from "../../core/observable/IObservable";

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
    (response:ResponseData|Error, request?:RequestData):void;
}

@Injectable
export default class NetManager
{
    public constructor()
    {
        core.listen(CoreMessage.MESSAGE_DISPATCHED, this.onMsgDispatched, core);
    }
    
    private onMsgDispatched(msg:IMessage):void
    {
        var observable:IObservable = (this as any).observable;
        // 如果消息是通讯消息则做处理
        if(msg instanceof RequestData)
        {
            // 添加遮罩
            if(msg.__useMask) maskManager.showLoading(null, "net");
            // 指定消息参数连接上公共参数作为参数
            extendObject(msg.__params.data, commonData);
            // 发送消息
            msg.__policy.sendRequest(msg);
            // 派发系统消息
            observable.dispatch(NetMessage.NET_REQUEST, msg);
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
        this._responseDict[cls.type] = cls;
    }

    private _responseListeners:{[type:string]:[ResponseHandler, any, boolean, IObservable][]} = {};
    /**
     * 添加一个通讯返回监听
     * 
     * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    public listenResponse(clsOrType:IResponseDataConstructor|string, handler:ResponseHandler, thisArg?:any, once:boolean=false, observable?:IObservable):void
    {
        if(!observable) observable = core.observable;
        var type:string = (typeof clsOrType == "string" ? clsOrType : clsOrType.type);
        var listeners:[ResponseHandler, any, boolean, IObservable][] = this._responseListeners[type];
        if(!listeners) this._responseListeners[type] = listeners = [];
        for(var listener of listeners)
        {
            if(handler == listener[0] && thisArg == listener[1] && once == listener[2])
                return;
        }
        listeners.push([handler, thisArg, once, observable]);
    }

    /**
     * 移除一个通讯返回监听
     * 
     * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    public unlistenResponse(clsOrType:IResponseDataConstructor|string, handler:ResponseHandler, thisArg?:any, once:boolean=false, observable?:IObservable):void
    {
        if(!observable) observable = core.observable;
        var type:string = (typeof clsOrType == "string" ? clsOrType : clsOrType.type);
        var listeners:[ResponseHandler, any, boolean, IObservable][] = this._responseListeners[type];
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var listener:[ResponseHandler, any, boolean, IObservable] = listeners[i];
                if(handler == listener[0] && thisArg == listener[1] && once == listener[2] && observable == listener[3])
                {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 发送多条请求，并且等待返回结果（如果有的话），调用回调
     * 
     * @param {RequestData[]} [requests 要发送的请求列表
     * @param {(responses?:ResponseData[]|Error)=>void} [handler] 收到返回结果或错误后的回调函数
     * @param {*} [thisArg] this指向
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    public sendMultiRequests(requests?:RequestData[], handler?:(responses?:ResponseData[]|Error)=>void, thisArg?:any, observable?:IObservable):void
    {
        var self:NetManager = this;
        var responses:(IResponseDataConstructor|ResponseData)[] = [];
        var leftResCount:number = 0;
        if(!observable) observable = core.observable;
        for(var request of requests || [])
        {
            var response:IResponseDataConstructor = request.__params.response;
            if(response)
            {
                // 监听一次性返回
                this.listenResponse(response, onResponse, request);
                // 记录返回监听
                responses.push(response);
                // 记录数量
                leftResCount ++;
            }
            // 发送请求
            observable.dispatch(request);
        }
        // 测试回调
        testCallback();

        function onResponse(response:ResponseData|Error):void
        {
            if(response instanceof Error)
            {
                // 出错了，直接调用回调
                handler && handler.call(thisArg, response);
            }
            else
            {
                // 成功了
                for(var key in responses)
                {
                    var temp:IResponseDataConstructor = <IResponseDataConstructor>responses[key];
                    if(temp == response.constructor && this === response.__params.request)
                    {
                        self.unlistenResponse(temp, onResponse, this);
                        responses[key] = response;
                        leftResCount --;
                        // 测试回调
                        testCallback();
                        break;
                    }
                }
            }
        }

        function testCallback():void
        {
            // 判断是否全部替换完毕
            if(leftResCount <= 0)
            {
                handler && handler.call(thisArg, responses);
            }
        }
    }

    /** 这里导出不希望用户使用的方法，供框架内使用 */
    public __onResponse(type:string, result:any, request?:RequestData):void|never
    {
        // 移除遮罩
        if(request && request.__useMask) maskManager.hideLoading("net");
        // 解析结果
        var cls:IResponseDataConstructor = this._responseDict[type];
        if(cls)
        {
            var response:ResponseData = new cls();
            // 执行解析
            response.parse(result);
            // 设置配对请求和发送内核
            var observable:IObservable = core.observable;
            if(request)
            {
                response.__params.request = request;
                // 由上至下找到最远的一个有效内核
                for(var i:number = request.__observables.length - 1; i >= 0; i--)
                {
                    var temp:IObservable = request.__observables[i];
                    if(!temp || temp.disposed) break;
                    else observable = temp;
                }
            }
            // 派发事件
            observable.dispatch(NetMessage.NET_RESPONSE, response, request);
            // 递归处理事件监听
            this.recurseResponse(type, response, request, observable);
        }
        else
        {
            console.warn("没有找到返回结构体定义：" + type);
        }
    }

    public __onError(type:string, err:Error, request?:RequestData):void
    {
        // 移除遮罩
        if(request && request.__useMask) maskManager.hideLoading("net");
        // 如果有配对请求，则将返回值发送到请求所在的原始内核里
        var observable:IObservable = request && request.__oriObservable;
        // 派发事件
        observable.dispatch(NetMessage.NET_ERROR, err, request);
        // 递归处理事件监听
        this.recurseResponse(type, err, request, observable);
    }

    private recurseResponse(type:string, response:ResponseData|Error, request:RequestData, observable:IObservable):void
    {
        // 先递归父级，与消息发送时顺序相反
        if(observable.parent)
        {
            this.recurseResponse(type, response, request, observable.parent);
        }
        // 触发事件形式监听
        var listeners:[ResponseHandler, any, boolean, IObservable][] = this._responseListeners[type];
        if(listeners)
        {
            listeners = listeners.concat();
            for(var listener of listeners)
            {
                if(listener[3] == observable)
                {
                    // 必须是同核消息才能触发回调
                    listener[0].call(listener[1], response, request);
                    // 如果是一次性监听则移除之
                    if(listener[2]) this.unlistenResponse(type, listener[0], listener[1], listener[2], listener[3]);
                }
            }
        }
    }
}
/** 再额外导出一个单例 */
export const netManager:NetManager = core.getInject(NetManager);