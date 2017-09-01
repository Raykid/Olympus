import {IContextMessage} from "ContextMessage"
import ContextMessage from "ContextMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 内核消息处理函数接口
*/
export interface IContextMessageHandler
{
    (msg:IContextMessage):void;
}

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * Olympus核心对象，负责实现框架内消息转发、对象注入等核心功能
*/
export default class Context
{
    private static _listenerDict:{[type:string]:IContextMessageData[]} = {};

    /**
     * 派发内核消息
     * 
     * @static
     * @param {IContextMessage} msg 内核消息实例
     * @memberof Context
     */
    public static dispatch(msg:IContextMessage):void;
    /**
     * 派发内核消息，消息会转变为ContextMessage类型对象
     * 
     * @static
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Context
     */
    public static dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public static dispatch(typeOrMsg:string|IContextMessage, ...params:any[]):void
    {
        // 统一事件对象
        var msg:IContextMessage = typeOrMsg as IContextMessage;
        if(typeof typeOrMsg == "string")
        {
            msg = new ContextMessage(typeOrMsg);
            (msg as ContextMessage).params = params;
        }
        // 派发消息
        var listeners:IContextMessageData[] = Context._listenerDict[msg.getType()];
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
     * @static
     * @param {string} type 消息类型
     * @param {IContextMessageHandler} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    public static listen(type:string, handler:IContextMessageHandler, thisArg?:any):void
    {
        var listeners:IContextMessageData[] = Context._listenerDict[type];
        if(!listeners) Context._listenerDict[type] = listeners = [];
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
     * @static
     * @param {string} type 消息类型
     * @param {IContextMessageHandler} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    public static unlisten(type:string, handler:IContextMessageHandler, thisArg?:any):void
    {
        var listeners:IContextMessageData[] = Context._listenerDict[type];
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

interface IContextMessageData
{
    handler:IContextMessageHandler;
    thisArg:any;
}