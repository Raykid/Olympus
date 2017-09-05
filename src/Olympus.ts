import core, {Core} from "core/Core"
import IConstructor from "core/interfaces/IConstructor"
import IView from "core/view/IView"
import IMessage from "core/message/IMessage"
import Message from "core/message/Message"
import ICommandConstructor from "core/command/ICommandConstructor"
import Command from "core/command/Command"

/*********************** 下面是Core模组的常用接口 ***********************/

/**
 * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
 * 
 * @param {IConstructor} target 要注入的类型（注意不是实例）
 * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
 * @memberof Core
 */
export function mapInject(target:IConstructor, type?:IConstructor):void
{
    core.mapInject(target, type);
}

/**
 * 获取注入的对象实例
 * 
 * @param {(IConstructor)} type 注入对象的类型
 * @returns {*} 注入的对象实例
 * @memberof Core
 */
export function getInject(type:IConstructor):any
{
    return core.getInject(type);
}

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
 * @memberof Core
 */
export function dispatch(msg:IMessage):void;
/**
 * 派发内核消息，消息会转变为Message类型对象
 * 
 * @param {string} type 消息类型
 * @param {...any[]} params 消息参数列表
 * @memberof Core
 */
export function dispatch(type:string, ...params:any[]):void;
/** dispatch方法实现 */
export function dispatch(typeOrMsg:string|IMessage, ...params:any[]):void
{
    core.dispatch.apply(core, arguments);
}

/**
 * 监听内核消息
 * 
 * @param {string} type 消息类型
 * @param {(msg:IMessage)=>void} handler 消息处理函数
 * @param {*} [thisArg] 消息this指向
 * @memberof Core
 */
export function listen(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
{
    core.listen(type, handler, thisArg);
}

/**
 * 移除内核消息监听
 * 
 * @param {string} type 消息类型
 * @param {(msg:IMessage)=>void} handler 消息处理函数
 * @param {*} [thisArg] 消息this指向
 * @memberof Core
 */
export function unlisten(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
{
    core.unlisten(type, handler, thisArg);
}

/**
 * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
 * 
 * @param {string} type 要注册的消息类型
 * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
 * @memberof Core
 */
export function mapCommand(type:string, cmd:ICommandConstructor):void
{
    core.mapCommand(type, cmd);
}

/**
 * 注销命令
 * 
 * @param {string} type 要注销的消息类型
 * @param {(ICommandConstructor)} cmd 命令处理器
 * @returns {void} 
 * @memberof Core
 */
export function unmapCommand(type:string, cmd:ICommandConstructor):void
{
    core.unmapCommand(type, cmd);
}

/** 导出常用的对象 */
export {
    core,
    Core,
    IConstructor,
    IView,
    IMessage,
    Message,
    ICommandConstructor,
    Command
}