/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
declare function Inject(cls: IConstructor): PropertyDecorator;
declare function Injectable(cls: IConstructor): void;
declare function Injectable(cls: IInjectableParams): ClassDecorator;
interface IConstructor extends Function {
    new (...args: any[]): any;
}
interface IInjectableParams {
    type: IConstructor;
}
declare module "core/interfaces/IConstructor" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 任意构造器接口
    */
    export default interface IConstructor extends Function {
        new (...args: any[]): any;
    }
}
declare module "core/message/IMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息接口
    */
    export default interface IMessage {
        /**
         * 获取消息类型
         *
         * @returns {string} 消息类型
         * @memberof IContextMessage
         */
        getType(): string;
    }
}
declare module "core/message/Message" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    export default class Message implements IMessage {
        private _type;
        getType(): string;
        /**
         * 消息参数列表
         *
         * @type {any[]}
         * @memberof ContextMessage
         */
        params: any[];
        /**
         * Creates an instance of ContextMessage.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof ContextMessage
         */
        constructor(type: string, ...params: any[]);
    }
}
declare module "core/command/Command" {
    import { Context } from "core/context/Context";
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
    */
    export default class Command {
        /**
         * 触发该Command运行的Message实例
         *
         * @type {IMessage}
         * @memberof Command
         */
        msg: IMessage;
        /**
         * 内核上下文实例
         *
         * @type {Context}
         * @memberof Command
         */
        context: Context;
        constructor(msg: IMessage);
        exec(): void;
    }
}
declare module "core/command/ICommandConstructor" {
    import IMessage from "core/message/IMessage";
    import Command from "core/command/Command";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令接口
    */
    export default interface ICommandConstructor {
        new (msg: IMessage): Command;
    }
}
declare module "core/context/Context" {
    import IConstructor from "core/interfaces/IConstructor";
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Context
     */
    export class Context {
        private static _instance;
        constructor();
        /*********************** 下面是依赖注入系统 ***********************/
        private _injectDict;
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Context
         */
        mapInject(target: IConstructor, type?: IConstructor): void;
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Context
         */
        getInject(type: IConstructor): any;
        /*********************** 下面是内核消息系统 ***********************/
        private _listenerDict;
        private handleMessages(msg);
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Context
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为ContextMessage类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Context
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        listen(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        unlisten(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /*********************** 下面是内核命令系统 ***********************/
        private _commandDict;
        private handleCommands(msg);
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Context
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Context
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
    }
    const _default: Context;
    export default _default;
}
declare module "core/view/IView" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是表现层接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
    */
    export default interface IView {
        /**
         * 获取表现层类型名称
         * @return {string} 一个字符串，代表表现层类型名称
         */
        getType(): string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
         */
        getHTMLWrapper(): HTMLElement;
        /**
         * 初始化表现层
         * @param {()=>void} complete 初始化完毕后的回调
         */
        initView(complete: () => void): void;
    }
}
declare module "Olympus" {
    import context, { Context } from "core/context/Context";
    import IConstructor from "core/interfaces/IConstructor";
    import IView from "core/view/IView";
    import IMessage from "core/message/IMessage";
    import Message from "core/message/Message";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import Command from "core/command/Command";
    /**
     * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
     *
     * @param {IConstructor} target 要注入的类型（注意不是实例）
     * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
     * @memberof Context
     */
    export function mapInject(target: IConstructor, type?: IConstructor): void;
    /**
     * 获取注入的对象实例
     *
     * @param {(IConstructor)} type 注入对象的类型
     * @returns {*} 注入的对象实例
     * @memberof Context
     */
    export function getInject(type: IConstructor): any;
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
    export function dispatch(msg: IMessage): void;
    /**
     * 派发内核消息，消息会转变为ContextMessage类型对象
     *
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Context
     */
    export function dispatch(type: string, ...params: any[]): void;
    /**
     * 监听内核消息
     *
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    export function listen(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Context
     */
    export function unlisten(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Context
     */
    export function mapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Context
     */
    export function unmapCommand(type: string, cmd: ICommandConstructor): void;
    /** 导出常用的对象 */
    export { context, Context, IConstructor, IView, IMessage, Message, ICommandConstructor, Command };
}
