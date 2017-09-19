import { core } from "../Core";
import IMessage from "../message/IMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
*/
export default abstract class Command
{
    /**
     * 触发该Command运行的Message实例
     * 
     * @type {IMessage}
     * @memberof Command
     */
    public msg:IMessage;

    public constructor(msg:IMessage)
    {
        this.msg = msg;
    }
    
    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    public dispatch(type:string, ...params:any[]):void;
    public dispatch(typeOrMsg:any, ...params:any[]):void
    {
        core.dispatch(typeOrMsg, ...params);
    }

    /**
     * 子类必须实现该方法
     * 
     * @abstract
     * @memberof Command
     */
    public abstract exec():void;
}