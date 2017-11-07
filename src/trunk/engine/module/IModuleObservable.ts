import IMessage from "../../core/message/IMessage";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import IObservable from "../../core/observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 * 
 * 模块可观察接口
*/
export default interface IModuleObservable
{
    /**
     * 将内部的IObservable暴露出来
     * 
     * @type {IObservable}
     * @memberof IModuleObservable
     */
    readonly observable:IObservable;

    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    listenModule(type:IConstructor|string, handler:Function, thisArg?:any):void;
    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    unlistenModule(type:IConstructor|string, handler:Function, thisArg?:any):void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IModuleObservable
     */
    mapCommandModule(type:string, cmd:ICommandConstructor):void;

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof IModuleObservable
     */
    unmapCommandModule(type:string, cmd:ICommandConstructor):void;
    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof IModuleObservable
     */
    dispatchModule(msg:IMessage):void;
    
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof IModuleObservable
     */
    dispatchModule(type:string, ...params:any[]):void;
}