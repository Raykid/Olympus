import {IContextMessage} from "ContextMessage"
import ContextMessage from "ContextMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * Olympus核心上下文模块，负责实现框架内消息转发、对象注入等核心功能
*/

/**
 * 上下文模块内部使用的记录转发数据的接口
 * 
 * @interface IContextMessageData
 */
interface IContextMessageData
{
    handler:(msg:IContextMessage)=>void;
    thisArg:any;
}

/**
 * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
 * 
 * @export
 * @class Context
 */
export class Context
{
    private static _instance:Context;

    private _listenerDict:{[type:string]:IContextMessageData[]};

    public constructor()
    {
        // 进行单例判断
        if(Context._instance) throw new Error("已生成过Context实例，不允许多次生成");
        Context._instance = this;
        this._listenerDict = {};
    }

    /**
     * 派发内核消息
     * 
     * @param {IContextMessage} msg 内核消息实例
     * @memberof Context
     */
    public dispatch(msg:IContextMessage):void;
    /**
     * 派发内核消息，消息会转变为ContextMessage类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Context
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(typeOrMsg:string|IContextMessage, ...params:any[]):void
    {
        // 统一事件对象
        var msg:IContextMessage = typeOrMsg as IContextMessage;
        if(typeof typeOrMsg == "string")
        {
            msg = new ContextMessage(typeOrMsg);
            (msg as ContextMessage).params = params;
        }
        // 派发消息
        var listeners:IContextMessageData[] = this._listenerDict[msg.getType()];
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var temp:IContextMessageData = listeners[i];
                temp.handler.call(temp.thisArg, msg);
            }
        }
    }

    /**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {(msg:IContextMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    public listen(type:string, handler:(msg:IContextMessage)=>void, thisArg?:any):void
    {
        var listeners:IContextMessageData[] = this._listenerDict[type];
        if(!listeners) this._listenerDict[type] = listeners = [];
        // 检查存在性
        for(var i:number = 0, len:number = listeners.length; i < len; i++)
        {
            var temp:IContextMessageData = listeners[i];
            // 如果已经存在监听则直接返回
            if(temp.handler == handler && temp.thisArg == thisArg) return;
        }
        // 添加监听
        listeners.push({handler: handler, thisArg: thisArg});
    }

    /**
     * 移除内核消息监听
     * 
     * @
     * @param {string} type 消息类型
     * @param {(msg:IContextMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    public unlisten(type:string, handler:(msg:IContextMessage)=>void, thisArg?:any):void
    {
        var listeners:IContextMessageData[] = this._listenerDict[type];
        // 检查存在性
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var temp:IContextMessageData = listeners[i];
                // 如果已经存在监听则直接返回
                if(temp.handler == handler && temp.thisArg == thisArg)
                {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
}

/** 默认导出Context实例 */
export default new Context();