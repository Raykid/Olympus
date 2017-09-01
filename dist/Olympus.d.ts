/// <reference path="../src/core/declarations/Inject.d.ts" />
declare module "core/message/Message" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息接口
    */
    export interface IMessage {
        /**
         * 获取消息类型
         *
         * @returns {string} 消息类型
         * @memberof IContextMessage
         */
        getType(): string;
    }
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    export class Message implements IMessage {
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
    import { IMessage } from "core/message/Message";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令模块，内核命令在注册了消息后可以在消息派发时被执行
    */
    /**
     * 命令构造器接口
     *
     * @export
     * @interface CommandConstructor
     */
    export interface CommandConstructor {
        new (msg: IMessage): Command;
    }
    /**
     * 内和命令的类形式
     *
     * @export
     * @class Command
     */
    export class Command {
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
declare module "core/interfaces/Constructor" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 任意构造器接口
    */
    export interface Constructor extends Function {
        new (...args: any[]): any;
    }
}
declare module "core/context/Context" {
    import { IMessage } from "core/message/Message";
    import { CommandConstructor } from "core/command/Command";
    import { Constructor } from "core/interfaces/Constructor";
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
         * @param {Constructor} target 要注入的类型（注意不是实例）
         * @param {Constructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Context
         */
        mapInject(target: Constructor, type?: Constructor): void;
        /**
         * 获取注入的对象实例
         *
         * @param {(Constructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Context
         */
        getInject(type: Constructor): any;
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
         * @param {(CommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Context
         */
        mapCommand(type: string, cmd: CommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(CommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Context
         */
        unmapCommand(type: string, cmd: CommandConstructor): void;
    }
    /** 导出Context实例 */
    export const context: Context;
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
    export interface IView {
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
    import { context, Context } from "core/context/Context";
    import { IView } from "core/view/IView";
    import { IMessage, Message } from "core/message/Message";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * 这是Olympus框架的外观模块，绝大多数与Olympus框架的交互都可以通过这个模块解决
    */
    /**
     * 添加一个表现层实例到框架中
     *
     * @static
     * @param {IView} view 要添加的表现层实例
     * @param {string} [name] 为此表现层实例起名
     * @memberof Olympus
     */
    export function addView(view: IView, name?: string): void;
    /** 导出常用的对象 */
    export { context, Context, IView, IMessage, Message };
}
