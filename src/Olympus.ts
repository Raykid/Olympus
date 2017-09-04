import {context, Context} from "core/context/Context"
import {IView} from "core/view/IView"
import {IMessage, Message} from "core/message/Message"
import {CommandConstructor, Command} from "core/command/Command"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 这是Olympus框架的外观模块，绝大多数与Olympus框架的交互都可以通过这个模块解决
*/

/**
 * 派发内核消息
 * 
 * @param {IMessage} msg 内核消息实例
 * @memberof Context
 */
export function dispatch(msg:IMessage):void;
/**
 * 派发内核消息，消息会转变为ContextMessage类型对象
 * 
 * @param {string} type 消息类型
 * @param {...any[]} params 消息参数列表
 * @memberof Context
 */
export function dispatch(type:string, ...params:any[]):void;
/** dispatch方法实现 */
export function dispatch(typeOrMsg:string|IMessage, ...params:any[]):void
{
    context.dispatch.call(context, arguments);
}

/**
 * 监听内核消息
 * 
 * @param {string} type 消息类型
 * @param {(msg:IContextMessage)=>void} handler 消息处理函数
 * @param {*} [thisArg] 消息this指向
 * @memberof Context
 */
export function listen(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
{
    context.listen(type, handler, thisArg);
}

/**
 * 移除内核消息监听
 * 
 * @param {string} type 消息类型
 * @param {(msg:IContextMessage)=>void} handler 消息处理函数
 * @param {*} [thisArg] 消息this指向
 * @memberof Context
 */
export function unlisten(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
{
    context.unlisten(type, handler, thisArg);
}

/**
 * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
 * 
 * @param {string} type 要注册的消息类型
 * @param {(CommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
 * @memberof Context
 */
export function mapCommand(type:string, cmd:CommandConstructor):void
{
    context.mapCommand(type, cmd);
}

/**
 * 注销命令
 * 
 * @param {string} type 要注销的消息类型
 * @param {(CommandConstructor)} cmd 命令处理器
 * @returns {void} 
 * @memberof Context
 */
export function unmapCommand(type:string, cmd:CommandConstructor):void
{
    context.unmapCommand(type, cmd);
}

/** 导出常用的对象 */
export {
    context,
    Context,
    IView,
    IMessage,
    Message,
    CommandConstructor,
    Command
}