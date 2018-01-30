import IConstructor from "../interfaces/IConstructor";
import IMessage from "../message/IMessage";
import ICommandConstructor from "../command/ICommandConstructor";
import IDisposable from "../interfaces/IDisposable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 * 
 * 可观察接口
*/
export default interface IObservable extends IDisposable
{
    /**
     * 获取到IObservable实体，若本身就是IObservable实体则返回本身
     * 
     * @type {IObservable}
     * @memberof IObservable
     */
    readonly observable:IObservable;
    /**
     * 父级IObservable
     * 
     * @type {IObservable}
     * @memberof IObservable
     */
    parent:IObservable;

    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof IObservable
     */
    dispatch(msg:IMessage):void;
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof IObservable
     */
    dispatch(type:string, ...params:any[]):void;
    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once] 是否一次性监听
     * @memberof IObservable
     */
    listen(type:IConstructor|string, handler:Function, thisArg?:any, once?:boolean):void;
    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once] 是否一次性监听
     * @memberof IObservable
     */
    unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once?:boolean):void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IObservable
     */
    mapCommand(type:string, cmd:ICommandConstructor):void;

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof IObservable
     */
    unmapCommand(type:string, cmd:ICommandConstructor):void;
}