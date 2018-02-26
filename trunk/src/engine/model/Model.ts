import { core } from "../../core/Core";
import IMessage from "../../core/message/IMessage";
import IObservable from "../../core/observable/IObservable";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import EngineMessage from "../message/EngineMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * Model的基类，也可以不继承该基类，因为Model是很随意的东西
*/
export default abstract class Model implements IObservable
{
    /**
     * Model的disposed属性没有任何作用，仅为了实现接口，始终返回false
     * 
     * @readonly
     * @type {boolean}
     * @memberof Model
     */
    public get disposed():boolean
    {
        return false;
    }

    /**
     * 转发core.observable
     * 
     * @readonly
     * @type {IObservable}
     * @memberof Model
     */
    public get observable():IObservable
    {
        return core.observable;
    }

    /**
     * 获取到父级IObservable
     * 
     * @type {IObservable}
     * @memberof Model
     */
    public get parent():IObservable
    {
        return null;
    }

    public constructor()
    {
        core.listen(EngineMessage.INITIALIZED, this.onInitialized, this);
    }

    /**
     * 在框架初始化完毕时调用
     * 
     * @memberof Model
     */
    public onInitialized():void
    {
        // 留待子类完善
    }

    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Model
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Model
     */
    public dispatch(type:string, ...params:any[]):void;
    public dispatch(...params:any[]):void
    {
        core.dispatch.apply(core, params);
    }

    /**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Model
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        core.listen(type, handler, thisArg, once);
    }

    /**
     * 移除内核消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Model
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        core.unlisten(type, handler, thisArg, once);
    }
    
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Model
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        core.mapCommand(type, cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof Model
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        core.unmapCommand(type, cmd);
    }

    /**
     * Model的dispose方法没有任何作用，仅为了实现接口
     * 
     * @memberof Model
     */
    public dispose():void
    {
    }
}