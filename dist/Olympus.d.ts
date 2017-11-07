/// <reference path="../src/trunk/libs/Reflect.d.ts" />
declare module "utils/ObjectUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 对象工具集
    */
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    export function extendObject(target: any, ...sources: any[]): any;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    export function cloneObject(target: any, deep?: boolean): any;
    /**
     * 生成一个随机ID
     */
    export function getGUID(): string;
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    export function getAutoIncId(type: string): string;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    export function isEmpty(obj: any): boolean;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    export function trimData(data: any): any;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    export var extendsClass: (child: any, parent: any) => void;
    /**
     * 获取一个对象的对象哈希字符串
     *
     * @export
     * @param {*} target 任意对象，可以是基础类型或null
     * @returns {string} 哈希值
     */
    export function getObjectHash(target: any): string;
    /**
     * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
     *
     * @export
     * @param {...any[]} targets 希望获取哈希值的对象列表
     * @returns {string} 多个对象共同作用下的哈希值
     */
    export function getObjectHashs(...targets: any[]): string;
}
declare module "utils/Dictionary" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-15
     * @modify date 2017-09-15
     *
     * 字典，支持key为任意类型的对象
    */
    export default class Dictionary<K, V> {
        private _keyDict;
        private _valueDict;
        /**
         * 获取字典内的元素数量
         *
         * @readonly
         * @type {number}
         * @memberof Dictionary
         */
        readonly size: number;
        /**
         * 设置一个键值对
         *
         * @param {K} key 键
         * @param {V} value 值
         * @memberof Dictionary
         */
        set(key: K, value: V): void;
        /**
         * 获取一个值
         *
         * @param {K} key 键
         * @returns {V} 值
         * @memberof Dictionary
         */
        get(key: K): V;
        /**
         * 删除一个键值对
         *
         * @param {K} key 键
         * @memberof Dictionary
         */
        delete(key: K): void;
        /**
         * 遍历字典
         *
         * @param {(key:K, value:V)=>void} callback 每次遍历的回调
         * @memberof Dictionary
         */
        forEach(callback: (key: K, value: V) => void): void;
    }
}
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 这个文件是给全局设置一个IConstructor接口而设计的
*/
interface IConstructor extends Function {
    new (...args: any[]): any;
}
declare module "core/interfaces/IConstructor" {
    export default IConstructor;
}
declare module "core/command/Command" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
    */
    export default abstract class Command {
        /**
         * 触发该Command运行的Message实例
         *
         * @type {IMessage}
         * @memberof Command
         */
        msg: IMessage;
        constructor(msg: IMessage);
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 子类必须实现该方法
         *
         * @abstract
         * @memberof Command
         */
        abstract exec(): void;
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
declare module "core/observable/IObservable" {
    import IConstructor from "core/interfaces/IConstructor";
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-31
     * @modify date 2017-10-31
     *
     * 可观察接口
    */
    export default interface IObservable {
        /**
         * 派发消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof IObservable
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof IObservable
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IObservable
         */
        listen(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IObservable
         */
        unlisten(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof IObservable
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof IObservable
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
    }
}
declare module "core/message/IMessage" {
    import IObservable from "core/observable/IObservable";
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
         * @readonly
         * @type {string}
         * @memberof IMessage
         */
        readonly type: string;
        /**
         * 消息所属内核
         *
         * @type {IObservable}
         * @memberof IMessage
         */
        readonly __observable: IObservable;
    }
}
declare module "core/interfaces/IDisposable" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 可回收接口
    */
    export default interface IDisposable {
        /** 是否已经被销毁 */
        readonly disposed: boolean;
        /** 销毁 */
        dispose(): void;
    }
}
declare module "core/message/Message" {
    import IMessage from "core/message/IMessage";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 消息基类
    */
    export default abstract class Message implements IMessage {
        private _type;
        /**
         * 获取消息类型字符串
         *
         * @readonly
         * @type {string}
         * @memberof Message
         */
        readonly type: string;
        /**
         * 消息所属内核
         *
         * @type {IObservable}
         * @memberof RequestData
         */
        __observable: IObservable;
        constructor(type: string);
    }
}
declare module "core/message/CommonMessage" {
    import Message from "core/message/Message";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核通用消息
    */
    export default class CommonMessage extends Message {
        /**
         * 消息参数列表
         *
         * @type {any[]}
         * @memberof Message
         */
        params: any[];
        /**
         * Creates an instance of Message.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof Message
         */
        constructor(type: string, ...params: any[]);
    }
}
declare module "core/message/CoreMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-13
     * @modify date 2017-09-13
     *
     * 核心事件类型
    */
    export default class CoreMessage {
        /**
         * 任何消息派发到框架后都会派发这个消息
         *
         * @static
         * @type {string}
         * @memberof CoreMessage
         */
        static MESSAGE_DISPATCHED: string;
    }
}
declare module "core/observable/Observable" {
    import IDisposable from "core/interfaces/IDisposable";
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-31
     * @modify date 2017-10-31
     *
     * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
    */
    export default class Observable implements IObservable, IDisposable {
        private _listenerDict;
        private handleMessages(msg);
        private doDispatch(msg);
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Observable
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为CommonMessage类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Observable
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Observable
         */
        listen(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Observable
         */
        unlisten(type: IConstructor | string, handler: Function, thisArg?: any): void;
        private _commandDict;
        private handleCommands(msg);
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Observable
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Observable
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
        private _disposed;
        /** 是否已经被销毁 */
        readonly disposed: boolean;
        /** 销毁 */
        dispose(): void;
    }
}
declare module "core/Core" {
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * Core模组是Olympus框架的核心模组，负责实现框架内消息转发、对象注入等核心功能
     * Core模组是一切其他模组实现的基础和围绕的核心
    */
    export interface IInjectableParams {
        type: IConstructor | string;
    }
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Core
     */
    export default class Core implements IObservable {
        private static _instance;
        constructor();
        /*********************** 下面是内核消息系统 ***********************/
        private _observable;
        /**
         * 将IObservable暴露出来
         *
         * @readonly
         * @type {IObservable}
         * @memberof Core
         */
        readonly observable: IObservable;
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为CommonMessage类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        listen(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        unlisten(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Core
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Core
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
        /*********************** 下面是依赖注入系统 ***********************/
        /**
         * 记录已经注入过的对象单例
         *
         * @private
         * @type {Dictionary<Function, any>}
         * @memberof Core
         */
        private _injectDict;
        /**
         * 注入字符串类型字典，记录注入字符串和类型构造函数的映射
         *
         * @private
         * @type {Dictionary<any, IConstructor>}
         * @memberof Core
         */
        private _injectStrDict;
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {*} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Core
         */
        mapInject(target: IConstructor, type?: any): void;
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {*} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @memberof Core
         */
        mapInjectValue(value: any, type?: any): void;
        /**
         * 移除类型注入
         *
         * @param {*} type 要移除注入的类型
         * @memberof Core
         */
        unmapInject(type: any): void;
        /**
         * 获取注入的对象实例
         *
         * @param {*} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Core
         */
        getInject(type: any): any;
    }
    /** 再额外导出一个单例 */
    export const core: Core;
}
declare module "utils/ConstructUtil" {
    import IConstructor from "core/interfaces/IConstructor";
    /**
     * 包装一个类型，监听类型的实例化操作
     *
     * @export
     * @param {IConstructor} cls 要监听构造的类型构造器
     * @returns {IConstructor} 新的构造函数
     */
    export function wrapConstruct(cls: IConstructor): IConstructor;
    /**
     * 如果传入的类有包装类，则返回包装类，否则返回其本身
     *
     * @export
     * @param {IConstructor} cls 要获取包装类的类构造函数
     * @returns {IConstructor}
     */
    export function getConstructor(cls: IConstructor): IConstructor;
    /**
     * 监听类型的实例化
     *
     * @export
     * @param {IConstructor} cls 要监听实例化的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    export function listenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
    /**
     * 移除实例化监听
     *
     * @export
     * @param {IConstructor} cls 要移除监听实例化的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    export function unlistenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
    /**
     * 监听类型销毁（如果能够销毁的话，需要类型具有dispose方法），该监听不需要移除
     *
     * @export
     * @param {IConstructor} cls 要监听销毁的类
     * @param {(instance?:any)=>void} handler 处理函数
     */
    export function listenDispose(cls: IConstructor, handler: (instance?: any) => void): void;
}
declare module "core/injector/Injector" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * Core模组的装饰器注入模块
    */
    /** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
    export function Injectable(...args: any[]): any;
    /** 赋值注入的实例 */
    export function Inject(prototype: any, propertyKey: string): void;
    export function Inject(cls: any): PropertyDecorator;
    /** 处理内核消息 */
    export function MessageHandler(prototype: any, propertyKey: string): void;
    export function MessageHandler(type: string): MethodDecorator;
}
declare module "engine/net/DataType" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 请求或返回数据结构体
    */
    export default abstract class DataType {
        /**
         * 原始数据
         *
         * @type {*}
         * @memberof DataType
         */
        __rawData: any;
        /**
         * 解析后端返回的JSON对象，生成结构体
         *
         * @param {any} data 后端返回的JSON对象
         * @returns {DataType} 结构体对象
         * @memberof DataType
         */
        parse(data: any): DataType;
        /**
         * 解析逻辑，需要子类实现
         *
         * @protected
         * @abstract
         * @param {*} data JSON对象
         * @return {*} 处理过后的原始数据要还给框架记录
         * @memberof DataType
         */
        protected abstract doParse(data: any): any;
        /**
         * 打包数据成为一个Object，需要子类实现
         *
         * @returns {*} 打包后的数据
         * @memberof DataType
         */
        abstract pack(): any;
    }
}
declare module "engine/net/IRequestPolicy" {
    import RequestData from "engine/net/RequestData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 请求策略，根据使用的策略不同，请求的行为也会有所不同，例如使用HTTP或者Socket
    */
    export default interface IRequestPolicy {
        /**
         * 发送请求逻辑
         *
         * @param {RequestData} request 请求
         * @memberof IRequestPolicy
         */
        sendRequest(request: RequestData): void;
    }
}
declare module "engine/net/RequestData" {
    import IMessage from "core/message/IMessage";
    import IRequestPolicy from "engine/net/IRequestPolicy";
    import { IResponseDataConstructor } from "engine/net/ResponseData";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯发送消息基类
    */
    export interface IRequestParams {
        /**
         * 消息名
         *
         * @type {string}
         * @memberof IRequestParams
         */
        type: string;
        /**
         * 消息路径
         *
         * @type {string}
         * @memberof IRequestParams
         */
        path: string;
        /**
         * 消息数据
         *
         * @type {*}
         * @memberof IRequestParams
         */
        data: any;
        /**
         * 协议类型
         *
         * @type {string}
         * @memberof IRequestParams
         */
        protocol: string;
        /**
         * 返回类型，如果消息没有返回类型或不确定是否有返回类型，则此处可以不定义（如Socket消息）
         *
         * @type {IResponseDataConstructor}
         * @memberof IRequestParams
         */
        response?: IResponseDataConstructor;
        /**
         * 其他可能需要的参数
         *
         * @type {*}
         * @memberof IRequestParams
         */
        [key: string]: any;
    }
    export default abstract class RequestData implements IMessage {
        /**
         * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
         *
         * @type {*}
         * @memberof RequestData
         */
        __userData: any;
        /**
         * 请求所属内核
         *
         * @type {IObservable}
         * @memberof RequestData
         */
        __observable: IObservable;
        /**
         * 请求参数，可以运行时修改
         *
         * @abstract
         * @type {IRequestParams}
         * @memberof RequestData
         */
        abstract __params: IRequestParams;
        /**
         * 消息发送接收策略
         *
         * @abstract
         * @type {IRequestPolicy}
         * @memberof RequestData
         */
        abstract __policy: IRequestPolicy;
        /**
         * 获取请求消息类型字符串
         *
         * @readonly
         * @type {string}
         * @memberof RequestData
         */
        readonly type: string;
    }
    /** 导出公共消息参数对象 */
    export var commonData: any;
}
declare module "engine/net/ResponseData" {
    import DataType from "engine/net/DataType";
    import RequestData from "engine/net/RequestData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯返回消息基类
    */
    export interface IResponseParams {
        type: string;
        request?: RequestData;
        [key: string]: any;
    }
    export default abstract class ResponseData extends DataType {
        /**
         * 返回参数
         *
         * @abstract
         * @type {IResponseParams}
         * @memberof ResponseType
         */
        abstract __params: IResponseParams;
    }
    export interface IResponseDataConstructor {
        new (): ResponseData;
        readonly type: string;
    }
}
declare module "engine/net/NetMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 通讯相关的消息
    */
    export default class NetMessage {
        /**
         * 发送网络请求消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_REQUEST: string;
        /**
         * 接受网络返回消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_RESPONSE: string;
        /**
         * 网络请求错误消息
         *
         * @static
         * @type {string}
         * @memberof NetMessage
         */
        static NET_ERROR: string;
    }
}
declare module "engine/net/NetUtil" {
    import DataType from "engine/net/DataType";
    export function packArray(arr: any[]): any[];
    export function parseArray(arr: any[], cls?: DataTypeClass): any[];
    export function packMap(map: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    export function parseMap(map: {
        [key: string]: any;
    }, cls?: DataTypeClass): {
        [key: string]: any;
    };
    export interface DataTypeClass {
        new (): DataType;
    }
}
declare module "engine/panel/IPromptPanel" {
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 通用弹窗的各种接口
    */
    export enum ButtonType {
        normal = 0,
        important = 1,
    }
    export interface IPromptParams {
        msg: string;
        style?: any;
        title?: string;
        handlers?: IPromptHandler[];
    }
    export interface IPromptHandler {
        /** 与按钮绑定的数据 */
        data: any;
        /** 按钮上显示的文本，不传递则默认使用data的字符串值 */
        text?: string;
        /** 回调函数，当前按钮被点击时调用，参数为data对象 */
        handler?: (data?: any) => void;
        /** 按钮类型，默认为normal */
        buttonType?: ButtonType;
    }
    export interface IPromptPanelConstructor {
        new (): IPromptPanel;
    }
    export default interface IPromptPanel extends IPanel {
        /**
         * 更新通用提示窗显示
         * @param params 弹窗数据
         */
        update(params: IPromptParams): void;
    }
}
declare module "engine/panel/IPanelPolicy" {
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗动画策略，负责将弹窗动画与弹窗实体解耦
    */
    export default interface IPanelPolicy {
        /**
         * 添加显示前准备阶段调用
         * @param panel 弹出框对象
         */
        prepare?(panel: IPanel): void;
        /**
         * 显示时调用
         * @param panel 弹出框对象
         * @param callback 完成回调，必须调用
         * @param from 动画起始点
         */
        pop(panel: IPanel, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        /**
         * 关闭时调用
         * @param panel 弹出框对象
         * @param callback 完成回调，必须调用
         * @param to 动画完结点
         */
        drop(panel: IPanel, callback: () => void, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "core/interfaces/IOpenClose" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * 可开关的接口
    */
    export default interface IOpenClose {
        /** 开 */
        open(data?: any, ...args: any[]): any;
        /** 关 */
        close(data?: any, ...args: any[]): any;
    }
}
declare module "engine/scene/IScene" {
    import IDisposable from "core/interfaces/IDisposable";
    import IHasBridge from "engine/bridge/IHasBridge";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IOpenClose from "core/interfaces/IOpenClose";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景接口
    */
    export default interface IScene extends IHasBridge, IOpenClose, IDisposable {
        /** 显示对象 */
        skin: any;
        /** 切换策略 */
        policy: IScenePolicy;
        /** 打开当前场景（相当于调用SceneManager.push方法） */
        open(data?: any): IScene;
        /** 打开当前场景（只能由SceneManager调用） */
        __open(data?: any): void;
        /** 关闭当前场景（相当于调用SceneManager.pop方法） */
        close(data?: any): IScene;
        /** 关闭当前场景（只能由SceneManager调用） */
        __close(data?: any): void;
        /**
         * 切入场景开始前调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onBeforeIn(fromScene: IScene, data?: any): void;
        /**
         * 切入场景开始后调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onAfterIn(fromScene: IScene, data?: any): void;
        /**
         * 切出场景开始前调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onBeforeOut(toScene: IScene, data?: any): void;
        /**
         * 切出场景开始后调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onAfterOut(toScene: IScene, data?: any): void;
    }
}
declare module "engine/scene/IScenePolicy" {
    import IScene from "engine/scene/IScene";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景动画策略，负责将场景动画与场景实体解耦
    */
    export default interface IScenePolicy {
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        prepareSwitch?(from: IScene, to: IScene): void;
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        switch(from: IScene, to: IScene, callback: () => void): void;
        /**
         * 准备Push场景时调度，如果没有定义该方法则套用PrepareSwitch
         * @param from 切出的场景
         * @param to 切入的场景
         */
        preparePush?(from: IScene, to: IScene): void;
        /**
         * Push场景时调度，如果没有定义该方法则套用switch
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        push?(from: IScene, to: IScene, callback: () => void): void;
        /**
         * 准备Pop场景时调度，如果没有定义该方法则套用PrepareSwitch
         * @param from 切出的场景
         * @param to 切入的场景
         */
        preparePop?(from: IScene, to: IScene): void;
        /**
         * Pop场景时调度，如果没有定义该方法则套用switch
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        pop?(from: IScene, to: IScene, callback: () => void): void;
    }
}
declare module "engine/module/IModuleObservable" {
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-31
     * @modify date 2017-10-31
     *
     * 模块可观察接口
    */
    export default interface IModuleObservable {
        /**
         * 将内部的IObservable暴露出来
         *
         * @type {IObservable}
         * @memberof IModuleObservable
         */
        readonly observable: IObservable;
        /**
         * 监听消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        listenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        unlistenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof IModuleObservable
         */
        mapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof IModuleObservable
         */
        unmapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 派发消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof IModuleObservable
         */
        dispatchModule(msg: IMessage): void;
        /**
         * 派发消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof IModuleObservable
         */
        dispatchModule(type: string, ...params: any[]): void;
    }
}
declare module "engine/module/IModuleConstructor" {
    import IModule from "engine/module/IModule";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * 模块构造器接口
    */
    export default interface IModuleConstructor {
        new (): IModule;
    }
}
declare module "engine/module/IModuleDependent" {
    import IModule from "engine/module/IModule";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-31
     * @modify date 2017-10-31
     *
     * 模块依赖者接口
    */
    export default interface IModuleDependent {
        /**
         * 所属的模块引用
         *
         * @memberof IModuleDependent
         */
        readonly dependModuleInstance: IModule;
        /**
         * 所属的模块类型
         *
         * @memberof IModuleDependent
         */
        readonly dependModule: IModuleConstructor;
    }
}
declare module "engine/mediator/IModuleMediator" {
    import IModuleObservable from "engine/module/IModuleObservable";
    import IModuleDependent from "engine/module/IModuleDependent";
    import IMediator from "engine/mediator/IMediator";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-24
     * @modify date 2017-10-24
     *
     * 托管到模块的中介者所具有的接口
    */
    export default interface IModuleMediator extends IMediator, IModuleObservable, IModuleDependent {
        /**
         * 列出中介者所需的资源数组，可重写
         *
         * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
         * @memberof IModuleMediator
         */
        listAssets(): string[];
        /**
         * 加载从listAssets中获取到的所有资源
         *
         * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
         * @memberof IModuleMediator
         */
        loadAssets(handler: (err?: Error) => void): void;
        /**
         * 当所需资源加载完毕后调用
         *
         * @param {Error} [err] 加载出错会给出错误对象，没错则不给
         * @memberof IModuleMediator
         */
        onLoadAssets(err?: Error): void;
    }
}
declare module "engine/module/IModule" {
    import IDisposable from "core/interfaces/IDisposable";
    import IModuleMediator from "engine/mediator/IModuleMediator";
    import RequestData from "engine/net/RequestData";
    import ResponseData from "engine/net/ResponseData";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    import IModuleObservable from "engine/module/IModuleObservable";
    import IModuleDependent from "engine/module/IModuleDependent";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 业务模块接口
    */
    export default interface IModule extends IDisposable, IModuleObservable, IModuleDependent {
        /** 模块打开时的参数 */
        data: any;
        /** 模块初始消息的返回数据 */
        responses: ResponseData[];
        /** 获取背景音乐URL */
        readonly bgMusic: string;
        /** 获取所有已托管的中介者 */
        readonly delegatedMediators: IModuleMediator[];
        /** 列出模块所需CSS资源URL */
        listStyleFiles(): string[];
        /** 列出模块所需JS资源URL */
        listJsFiles(): string[];
        /** 列出模块初始化请求 */
        listInitRequests(): RequestData[];
        /** 将中介者托管给模块 */
        delegateMediator(mediator: IModuleMediator): void;
        /** 反托管中介者 */
        undelegateMediator(mediator: IModuleMediator): void;
        /** 判断指定中介者是否包含在该模块里 */
        constainsMediator(mediator: IModuleMediator): boolean;
        /** 当模块资源加载完毕后调用 */
        onLoadAssets(err?: Error): void;
        /** 打开模块时调用 */
        onOpen(data?: any): void;
        /** 关闭模块时调用 */
        onClose(data?: any): void;
        /** 模块切换到前台时调用（open之后或者其他模块被关闭时） */
        onActivate(from: IModuleConstructor | undefined, data?: any): void;
        /** 模块切换到后台是调用（close之后或者其他模块打开时） */
        onDeactivate(to: IModuleConstructor | undefined, data?: any): void;
    }
}
declare module "engine/mediator/IMediator" {
    import IHasBridge from "engine/bridge/IHasBridge";
    import IOpenClose from "core/interfaces/IOpenClose";
    import IDisposable from "core/interfaces/IDisposable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 界面中介者接口
    */
    export default interface IMediator extends IHasBridge, IOpenClose, IDisposable {
        /**
         * 获取中介者是否已被销毁
         *
         * @memberof IMediator
         */
        readonly disposed: boolean;
        /**
         * 打开时传递的data对象
         *
         * @memberof IMediator
         */
        readonly data: any;
        /**
         * ViewModel引用
         *
         * @type {*}
         * @memberof IMediator
         */
        readonly viewModel: any;
        /**
         * 皮肤
         *
         * @readonly
         * @type {*}
         * @memberof IMediator
         */
        skin: any;
        /**
         * 当打开时调用
         *
         * @param {*} [data] 可能的打开参数
         * @memberof IMediator
         */
        onOpen(data?: any): void;
        /**
         * 当关闭时调用
         *
         * @param {*} [data] 可能的关闭参数
         * @memberof IMediator
         */
        onClose(data?: any): void;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof IMediator
         */
        unmapAllListeners(): void;
    }
}
declare module "engine/bridge/IBridge" {
    import { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IMediator from "engine/mediator/IMediator";
    import { IMaskEntity } from "engine/mask/MaskManager";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
    */
    export default interface IBridge {
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof IBridge
         */
        readonly type: string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly htmlWrapper: HTMLElement;
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly root: any;
        /**
         * 获取舞台引用
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly stage: any;
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly bgLayer: any;
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly sceneLayer: any;
        /**
         * 获取框架容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly frameLayer: any;
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly panelLayer: any;
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly maskLayer: any;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {*}
         * @memberof IBridge
         */
        readonly topLayer: any;
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof IBridge
         */
        readonly promptClass: IPromptPanelConstructor;
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof IBridge
         */
        readonly maskEntity: IMaskEntity;
        /**
         * 获取或设置默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof IBridge
         */
        defaultPanelPolicy: IPanelPolicy;
        /**
         * 获取或设置场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof IBridge
         */
        defaultScenePolicy: IScenePolicy;
        /**
         * 判断传入的skin是否是属于该表现层桥的
         *
         * @param {*} skin 皮肤实例
         * @return {boolean} 是否数据该表现层桥
         * @memberof IBridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 创建一个空的显示对象
         *
         * @returns {*}
         * @memberof IBridge
         */
        createEmptyDisplay(): any;
        /**
         * 添加显示
         *
         * @param {*} parent 要添加到的父容器
         * @param {*} target 被添加的显示对象
         * @return {*} 返回被添加的显示对象
         * @memberof IBridge
         */
        addChild(parent: any, target: any): any;
        /**
         * 按索引添加显示
         *
         * @param {*} parent 要添加到的父容器
         * @param {*} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {*} 返回被添加的显示对象
         * @memberof IBridge
         */
        addChildAt(parent: any, target: any, index: number): any;
        /**
         * 移除显示对象
         *
         * @param {*} parent 父容器
         * @param {*} target 被移除的显示对象
         * @return {*} 返回被移除的显示对象
         * @memberof IBridge
         */
        removeChild(parent: any, target: any): any;
        /**
         * 按索引移除显示
         *
         * @param {*} parent 父容器
         * @param {number} index 索引
         * @return {*} 返回被移除的显示对象
         * @memberof IBridge
         */
        removeChildAt(parent: any, index: number): any;
        /**
         * 移除所有显示对象
         *
         * @param {*} parent 父容器
         * @memberof IBridge
         */
        removeChildren(parent: any): void;
        /**
         * 获取父容器
         *
         * @param {*} target 指定显示对象
         * @return {*} 父容器
         * @memberof IBridge
         */
        getParent(target: any): any;
        /**
         * 获取指定索引处的显示对象
         *
         * @param {*} parent 父容器
         * @param {number} index 指定父级索引
         * @return {*} 索引处的显示对象
         * @memberof IBridge
         */
        getChildAt(parent: any, index: number): any;
        /**
         * 获取显示索引
         *
         * @param {*} parent 父容器
         * @param {*} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof IBridge
         */
        getChildIndex(parent: any, target: any): number;
        /**
         * 通过名称获取显示对象
         *
         * @param {*} parent 父容器
         * @param {string} name 对象名称
         * @return {*} 显示对象
         * @memberof IBridge
         */
        getChildByName(parent: any, name: string): any;
        /**
         * 获取子显示对象数量
         *
         * @param {*} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof IBridge
         */
        getChildCount(parent: any): number;
        /**
         * 加载资源
         *
         * @param {string[]} assets 资源数组
         * @param {IMediator} mediator 要加载资源的中介者
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof IBridge
         */
        loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         *
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof IBridge
         */
        init?(complete: (bridge: IBridge) => void): void;
    }
}
declare module "engine/bridge/IHasBridge" {
    import IBridge from "engine/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 标识拥有表现层桥的接口
    */
    export default interface IHasMediatorBridge {
        /**
         * 表现层桥
         */
        bridge: IBridge;
    }
}
declare module "engine/panel/IPanel" {
    import IDisposable from "core/interfaces/IDisposable";
    import IHasBridge from "engine/bridge/IHasBridge";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IOpenClose from "core/interfaces/IOpenClose";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗接口
    */
    export default interface IPanel extends IHasBridge, IOpenClose, IDisposable {
        /** 实际显示对象 */
        skin: any;
        /** 弹出策略 */
        policy: IPanelPolicy;
        /** 弹出当前弹窗（等同于调用PanelManager.pop方法） */
        open(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): IPanel;
        /** 弹出当前弹窗（只能由PanelManager调用） */
        __open(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 关闭当前弹窗（等同于调用PanelManager.drop方法） */
        close(data?: any, to?: {
            x: number;
            y: number;
        }): IPanel;
        /** 关闭当前弹窗（只能由PanelManager调用） */
        __close(data?: any, to?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出前调用的方法 */
        onBeforePop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出后调用的方法 */
        onAfterPop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭前调用的方法 */
        onBeforeDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭后调用的方法 */
        onAfterDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/bridge/BridgeMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 表现层消息
    */
    export default class BridgeMessage {
        /**
         * 初始化表现层实例前的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static BRIDGE_BEFORE_INIT: string;
        /**
         * 初始化表现层实例后的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static BRIDGE_AFTER_INIT: string;
        /**
         * 所有表现层实例都初始化完毕的消息
         *
         * @static
         * @type {string}
         * @memberof ViewMessage
         */
        static BRIDGE_ALL_INIT: string;
    }
}
declare module "engine/panel/NonePanelPolicy" {
    import IPanel from "engine/panel/IPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 无任何动画的弹出策略，可应用于任何显示层实现
    */
    export class NonePanelPolicy implements IPanelPolicy {
        pop(panel: IPanel, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        drop(panel: IPanel, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
    }
    const _default: NonePanelPolicy;
    export default _default;
}
declare module "engine/panel/PanelMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗相关的消息
    */
    export default class PanelMessage {
        /**
         * 打开弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        static PANEL_BEFORE_POP: string;
        /**
         * 打开弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        static PANEL_AFTER_POP: string;
        /**
         * 关闭弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        static PANEL_BEFORE_DROP: string;
        /**
         * 关闭弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PanelMessage
         */
        static PANEL_AFTER_DROP: string;
    }
}
declare module "engine/system/System" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
    */
    export default class System {
        private _nextFrameList;
        private _timer;
        /**
         * 获取从程序运行到当前所经过的毫秒数
         *
         * @returns {number} 毫秒数
         * @memberof System
         */
        getTimer(): number;
        constructor();
        private tick();
        /**
         * 在下一帧执行某个方法
         *
         * @param {Function} handler 希望在下一帧执行的某个方法
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 方法参数列表
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        nextFrame(handler: Function, thisArg?: any, ...args: any[]): ICancelable;
        /**
         * 设置延迟回调
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        setTimeout(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
        /**
         * 设置延时间隔
         *
         * @param {number} duration 延迟毫秒值
         * @param {Function} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {...any[]} args 要传递的参数
         * @returns {ICancelable} 可取消的句柄
         * @memberof System
         */
        setInterval(duration: number, handler: Function, thisArg?: any, ...args: any[]): ICancelable;
    }
    export interface ICancelable {
        cancel(): void;
    }
    /** 再额外导出一个单例 */
    export const system: System;
}
declare module "engine/panel/PanelManager" {
    import IConstructor from "core/interfaces/IConstructor";
    import IPanel from "engine/panel/IPanel";
    import IPromptPanel, { IPromptParams, IPromptHandler, IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
    */
    export default class PanelManager {
        private _panels;
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPanel[]} 已打开弹窗数组
         * @memberof PanelManager
         */
        getOpened(cls?: IConstructor): IPanel[];
        /**
         * 获取弹窗是否已开启
         *
         * @param {IPanel} panel 弹窗对象
         * @returns {boolean} 是否已经开启
         * @memberof PanelManager
         */
        isOpened(panel: IPanel): boolean;
        /**
         * 打开一个弹窗
         *
         * @param {IPanel} panel 要打开的弹窗
         * @param {*} [data] 数据
         * @param {boolean} [isModal=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        pop(panel: IPanel, data?: any, isModal?: boolean, from?: {
            x: number;
            y: number;
        }): IPanel;
        /**
         * 关闭一个弹窗
         *
         * @param {IPanel} panel 要关闭的弹窗
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPanel} 返回弹窗对象
         * @memberof PanelManager
         */
        drop(panel: IPanel, data?: any, to?: {
            x: number;
            y: number;
        }): IPanel;
        /************************ 下面是通用弹窗的逻辑 ************************/
        private _promptDict;
        /**
         * 注册通用弹窗
         *
         * @param {string} type 通用弹窗要注册到的表现层类型
         * @param {IPromptPanelConstructor} prompt 通用弹窗类型
         * @memberof PanelManager
         */
        registerPrompt(type: string, prompt: IPromptPanelConstructor): void;
        /**
         * 取消注册通用弹窗
         *
         * @param {string} type 要取消注册通用弹窗的表现层类型
         * @memberof PanelManager
         */
        unregisterPrompt(type: string): void;
        /**
         * 显示提示窗口
         *
         * @param {string} msg 要显示的文本
         * @param {...IPromptHandler[]} handlers 按钮回调数组
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        prompt(msg: string, ...handlers: IPromptHandler[]): IPromptPanel;
        /**
         * 显示提示窗口
         *
         * @param {IPromptParams} params 弹窗数据
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        prompt(params: IPromptParams): IPromptPanel;
        /**
         * 显示警告窗口（只有一个确定按钮）
         *
         * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
         * @param {()=>void} [okHandler] 确定按钮点击回调
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        alert(msgOrParams: string | IPromptParams, okHandler?: () => void): IPromptPanel;
        /**
         * 显示确认窗口（有一个确定按钮和一个取消按钮）
         *
         * @param {(string|IPromptParams)} msgOrParams 要显示的文本，或者弹窗数据
         * @param {()=>void} [okHandler] 确定按钮点击回调
         * @param {()=>void} [cancelHandler] 取消按钮点击回调
         * @returns {IPromptPanel} 返回弹窗实体
         * @memberof PanelManager
         */
        confirm(msgOrParams: string | IPromptParams, okHandler?: () => void, cancelHandler?: () => void): IPromptPanel;
    }
    /** 再额外导出一个单例 */
    export const panelManager: PanelManager;
}
declare module "engine/module/ModuleMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 模块消息
    */
    export default class ModuleMessage {
        /**
         * 切换模块消息
         *
         * @static
         * @type {string}
         * @memberof ModuleMessage
         */
        static MODULE_CHANGE: string;
        /**
         * 加载模块失败消息
         *
         * @static
         * @type {string}
         * @memberof ModuleMessage
         */
        static MODULE_LOAD_ASSETS_ERROR: string;
    }
}
declare module "utils/URLUtil" {
    /**
     * 规整url
     * @param url
     */
    export function trimURL(url: string): string;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    export function isAbsolutePath(url: string): boolean;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    export function validateProtocol(url: string): string;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    export function wrapHost(url: string, host: string, forced?: boolean): string;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    export function wrapAbsolutePath(relativePath: string, host?: string): string;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    export function getHostAndPathname(url: string): string;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    export function getPath(url: string): string;
    /**
     * 获取URL的文件名
     * @param url 要分析的URL
     */
    export function getName(url: string): string;
    /**
     * 解析URL
     * @param url 要被解析的URL字符串
     * @returns {any} 解析后的URLLocation结构体
     */
    export function parseUrl(url: string): URLLocation;
    /**
     * 解析url查询参数
     * @TODO 添加对jquery编码方式的支持
     * @param url url
     */
    export function getQueryParams(url: string): {
        [key: string]: string;
    };
    /**
     * 将参数连接到指定URL后面
     * @param url url
     * @param params 一个map，包含要连接的参数
     * @return string 连接后的URL地址
     */
    export function joinQueryParams(url: string, params: Object): string;
    /**
     * 将参数链接到URL的hash后面
     * @param url 如果传入的url没有注明hash模块，则不会进行操作
     * @param params 一个map，包含要连接的参数
     */
    export function joinHashParams(url: string, params: Object): string;
    export interface URLLocation {
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
    }
}
declare module "engine/env/Environment" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 环境参数
    */
    export default class Environment {
        protected _env: string;
        /**
         * 获取当前环境字符串
         *
         * @readonly
         * @type {string}
         * @memberof Environment
         */
        readonly env: string;
        private _hostsDict;
        /**
         * 获取域名字典
         *
         * @readonly
         * @type {{[env:string]:string[]}}
         * @memberof Environment
         */
        readonly hostsDict: {
            [env: string]: string[];
        };
        /**
         * 获取当前环境下某索引处的消息域名
         *
         * @param {number} [index=0] 域名字典索引，默认是0
         * @returns {string} 域名字符串，如果取不到则使用当前域名
         * @memberof Environment
         */
        getHost(index?: number): string;
        private _cdnsDict;
        /**
         * 获取CDN字典
         *
         * @readonly
         * @type {{[env:string]:string[]}}
         * @memberof Environment
         */
        readonly cdnsDict: {
            [env: string]: string[];
        };
        private _curCDNIndex;
        /**
         * 获取当前使用的CDN域名
         *
         * @readonly
         * @type {string}
         * @memberof Environment
         */
        readonly curCDNHost: string;
        /**
         * 切换下一个CDN
         *
         * @returns {boolean} 是否已经到达CDN列表的终点，回到了起点
         * @memberof Environment
         */
        nextCDN(): boolean;
        /**
         * 初始化Environment对象，因为该对象保存的数据基本来自项目初始参数，所以必须有initialize方法
         *
         * @param {string} [env] 当前所属环境字符串
         * @param {{[env:string]:string[]}} [hostsDict] host数组字典
         * @param {{[env:string]:string[]}} [cdnsDict] cdn数组字典
         * @memberof Environment
         */
        initialize(env?: string, hostsDict?: {
            [env: string]: string[];
        }, cdnsDict?: {
            [env: string]: string[];
        }): void;
        /**
         * 让url的域名变成消息域名
         *
         * @param {string} url 要转变的url
         * @param {number} [index=0] host索引，默认0
         * @returns {string} 转变后的url
         * @memberof Environment
         */
        toHostURL(url: string, index?: number): string;
        /**
         * 让url的域名变成CDN域名
         *
         * @param {string} url 要转变的url
         * @param {boolean} [forced=false] 是否强制替换host
         * @param {boolean} [infix=true] 是否加入路径中缀，即host之后，index.html之前的部分，默认加入
         * @returns {string} 转变后的url
         * @memberof Environment
         */
        toCDNHostURL(url: string, forced?: boolean, infix?: boolean): string;
    }
    /** 再额外导出一个单例 */
    export const environment: Environment;
}
declare module "utils/HTTPUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-12
     * @modify date 2017-10-12
     *
     * HTTP请求工具
    */
    export type HTTPMethod = "GET" | "POST";
    export interface IHTTPRequestParams {
        /**
         * url地址或者url地址数组
         *
         * @type {string|string[]}
         * @memberof HTTPRequestPolicy
         */
        url: string | string[];
        /**
         * 要发送的数据
         *
         * @type {*}
         * @memberof IHTTPRequestParams
         */
        data?: any;
        /**
         * 是否使用CDN域名和CDN切换机制，默认是false
         *
         * @type {boolean}
         * @memberof IHTTPRequestParams
         */
        useCDN?: boolean;
        /**
         * HTTP方法类型，默认是GET
         *
         * @type {HTTPMethod}
         * @memberof HTTPRequestPolicy
         */
        method?: HTTPMethod;
        /**
         * HTTP返回值类型，从XMLHttpRequestResponseType查找枚举值
         *
         * @type {XMLHttpRequestResponseType}
         * @memberof IHTTPRequestParams
         */
        responseType?: XMLHttpRequestResponseType;
        /**
         * HTTP请求头字典，如果有需要的请求头则放在这里
         *
         * @type {{[key:string]:string}}
         * @memberof IHTTPRequestParams
         */
        headerDict?: {
            [key: string]: string;
        };
        /**
         * 失败重试次数，默认重试2次
         *
         * @type {number}
         * @memberof HTTPRequestPolicy
         */
        retryTimes?: number;
        /**
         * 超时时间，毫秒，默认10000，即10秒
         *
         * @type {number}
         * @memberof HTTPRequestPolicy
         */
        timeout?: number;
        /**
         * 成功回调，只加一个地址时返回结果，一次加载多个地址时返回结果数组
         *
         * @memberof IHTTPRequestParams
         */
        onResponse?: (result?: any | any[]) => void;
        /**
         * 失败回调
         *
         * @memberof IHTTPRequestParams
         */
        onError?: (err: Error) => void;
    }
    /**
     * 发送一个或多个HTTP请求
     *
     * @export
     * @param {IHTTPRequestParams} params 请求参数
     */
    export function load(params: IHTTPRequestParams): void;
}
declare module "engine/version/Version" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 管理文件哈希版本号
    */
    export default class Version {
        private _hashDict;
        /**
         * 初始化哈希版本工具
         *
         * @param {()=>void} handler 回调
         * @memberof Version
         */
        initialize(handler: () => void): void;
        /**
         * 获取文件哈希值，如果没有文件哈希值则返回null
         *
         * @param {string} url 文件的URL
         * @returns {string} 文件的哈希值，或者null
         * @memberof Version
         */
        getHash(url: string): string;
        /**
         * 将url转换为哈希版本url
         *
         * @param {string} url 原始url
         * @returns {string} 哈希版本url
         * @memberof Version
         */
        wrapHashUrl(url: string): string;
        /**
         * 添加-r_XXX形式版本号
         *
         * @param {string} url
         * @param {string} version 版本号，以数字和小写字母组成
         * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
         * @memberof Version
         */
        joinVersion(url: string, version: string): string;
        /**
         * 移除-r_XXX形式版本号
         *
         * @param {string} url url
         * @returns {string} 移除版本号后的url
         * @memberof Version
         */
        removeVersion(url: string): string;
    }
    /** 再额外导出一个单例 */
    export const version: Version;
}
declare module "engine/assets/AssetsManager" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-26
     * @modify date 2017-10-26
     *
     * 资源管理器
    */
    export default class AssetsManager {
        private _keyDict;
        /**
         * 为路径配置短名称
         *
         * @param {string} key 路径短名称
         * @param {string} path 路径
         * @memberof AssetsManager
         */
        configPath(key: string, path: string): void;
        /**
         * 为路径配置短名称
         *
         * @param {{[key:string]:string}} params 路径短名称字典
         * @memberof AssetsManager
         */
        configPath(params: {
            [key: string]: string;
        }): void;
        private _assetsDict;
        /**
         * 获取资源，同步的，且如果找不到资源并不会触发加载
         *
         * @param {string} keyOrPath 资源的短名称或路径
         * @returns {*}
         * @memberof AssetsManager
         */
        getAssets(keyOrPath: string): any;
        /**
         * 加载资源，如果已加载过则同步回调，如果未加载则加载后异步回调
         *
         * @param {string|string[]} keyOrPath 资源短名称或资源路径
         * @param {(assets?:any|any[])=>void} complete 完成回调，如果加载失败则参数是个Error对象
         * @param {XMLHttpRequestResponseType} [responseType] 加载类型
         * @returns {void}
         * @memberof AssetsManager
         */
        loadAssets(keyOrPath: string | string[], complete: (assets?: any | any[]) => void, responseType?: XMLHttpRequestResponseType): void;
    }
    /** 再额外导出一个单例 */
    export const assetsManager: AssetsManager;
}
declare module "engine/env/Shell" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-23
     * @modify date 2017-10-23
     *
     * 外壳接口，该类既作为外壳接口的注入基类，也作为标准浏览器的实现使用
    */
    export default class Shell {
        /**
         * 获取当前外壳类型
         *
         * @readonly
         * @type {string}
         * @memberof Shell
         */
        readonly type: string;
        /*************************** 下面是页面跳转接口 ***************************/
        /**
         * 刷新页面
         *
         * @param {{
         *         forcedReload?:boolean, // false表示允许从缓存取，true表示强制从服务器取，默认是false
         *         url?:string, // 传递则使用新URL刷新页面
         *         replace?:boolean // 如果有新url，则表示是否要替换当前浏览历史
         *     }} [params]
         * @memberof Shell
         */
        reload(params?: {
            forcedReload?: boolean;
            url?: string;
            replace?: boolean;
        }): void;
        /**
         * 打开一个新页面
         *
         * @param {{
         *         url?:string, // 新页面地址，不传则不更新地址
         *         name?:string, // 给新页面命名，或导航到已有页面
         *         replace?:boolean, // 是否替换当前浏览历史条目，默认false
         *         features:{[key:string]:any} // 其他可能的参数
         *     }} [params]
         * @memberof Shell
         */
        open(params?: {
            url?: string;
            name?: string;
            replace?: boolean;
            features: {
                [key: string]: any;
            };
        }): void;
        /**
         * 关闭窗口
         *
         * @memberof Shell
         */
        close(): void;
        /*************************** 下面是本地存储接口 ***************************/
        /**
         * 获取本地存储
         *
         * @param {string} key 要获取值的键
         * @returns {string} 获取的值
         * @memberof Shell
         */
        localStorageGet(key: string): string;
        /**
         * 设置本地存储
         *
         * @param {string} key 要设置的键
         * @param {string} value 要设置的值
         * @memberof Shell
         */
        localStorageSet(key: string, value: string): void;
        /**
         * 移除本地存储
         *
         * @param {string} key 要移除的键
         * @memberof Shell
         */
        localStorageRemove(key: string): void;
        /**
         * 清空本地存储
         *
         * @memberof Shell
         */
        localStorageClear(): void;
        /** 此项代表外壳接口可根据实际情况扩展基类没有的方法或属性 */
        [name: string]: any;
    }
    /** 再额外导出一个单例 */
    export var shell: Shell;
}
declare module "engine/audio/IAudio" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-30
     * @modify date 2017-10-30
     *
     * 音频接口
    */
    export default interface IAudio {
        /**
         * 加载音频
         *
         * @param {string} url 音频URL
         * @memberof IAudio
         */
        load(url: string): void;
        /**
         * 播放音频，如果音频没有加载则先加载再播放
         *
         * @param {AudioPlayParams} params 音频播放参数
         * @returns {void}
         * @memberof IAudio
         */
        play(params: AudioPlayParams): void;
        /**
         * 暂停音频（不会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof IAudio
         */
        pause(url: string): void;
        /**
         * 停止音频（会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof IAudio
         */
        stop(url: string): void;
        /**
         * 停止所有音频
         *
         * @memberof IAudio
         */
        stopAll(): void;
        /**
         * 跳转音频进度
         *
         * @param {string} url 音频URL
         * @param {number} time 要跳转到的音频位置，毫秒值
         * @memberof IAudio
         */
        seek(url: string, time: number): void;
    }
    export interface AudioPlayParams {
        /**
         * 音频地址
         *
         * @type {string}
         * @memberof AudioPlayParams
         */
        url: string;
        /**
         * 播放启动的时间戳
         *
         * @type {number}
         * @memberof AudioPlayParams
         */
        time?: number;
        /**
         * 是否循环，默认为false
         *
         * @type {boolean}
         * @memberof AudioPlayParams
         */
        loop?: boolean;
        /**
         * 是否播放前关闭其他声音，默认为false，与important无法同时为true
         *
         * @type {boolean}
         * @memberof AudioPlayParams
         */
        stopOthers?: boolean;
    }
}
declare module "engine/audio/AudioMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-30
     * @modify date 2017-10-30
     *
     * 音频消息
    */
    export default class AudioMessage {
        /**
         * 音频播放开始事件
         *
         * @static
         * @type {string}
         * @memberof AudioMessage
         */
        static AUDIO_PLAY_STARTED: string;
        /**
         * 音频播放停止事件
         *
         * @static
         * @type {string}
         * @memberof AudioMessage
         */
        static AUDIO_PLAY_STOPPED: string;
        /**
         * 音频播放完毕事件
         *
         * @static
         * @type {string}
         * @memberof AudioMessage
         */
        static AUDIO_PLAY_ENDED: string;
    }
}
declare module "engine/audio/AudioTagImpl" {
    import IAudio, { AudioPlayParams } from "engine/audio/IAudio";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-30
     * @modify date 2017-10-30
     *
     * 使用Audio标签实现IAudio接口的实现类
    */
    export default class AudioTagImpl implements IAudio {
        private _audioCache;
        /**
         * 加载音频
         *
         * @param {string} url 音频地址
         * @memberof AudioTagImpl
         */
        load(url: string): void;
        /**
         * 播放音频，如果音频没有加载则先加载再播放
         *
         * @param {AudioPlayParams} params 音频播放参数
         * @returns {void}
         * @memberof AudioTagImpl
         */
        play(params: AudioPlayParams): void;
        private _doStop(url, time?);
        /**
         * 暂停音频（不会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof AudioTagImpl
         */
        pause(url: string): void;
        /**
         * 停止音频（会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof AudioTagImpl
         */
        stop(url: string): void;
        /**
         * 停止所有音频
         *
         * @memberof AudioTagImpl
         */
        stopAll(): void;
        /**
         * 跳转音频进度
         *
         * @param {string} url 音频URL
         * @param {number} time 要跳转到的音频位置，毫秒值
         * @memberof AudioTagImpl
         */
        seek(url: string, time: number): void;
    }
}
declare module "engine/audio/AudioContextImpl" {
    import IAudio, { AudioPlayParams } from "engine/audio/IAudio";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-30
     * @modify date 2017-10-30
     *
     * 使用AudioContext实现IAudio接口的实现类
    */
    export default class AudioContextImpl implements IAudio {
        private _context;
        private _inited;
        private _audioCache;
        constructor();
        /**
         * 加载音频
         *
         * @param {string} url 音频地址
         * @memberof AudioContextImpl
         */
        load(url: string): void;
        /**
         * 播放音频，如果音频没有加载则先加载再播放
         *
         * @param {AudioPlayParams} params 音频播放参数
         * @returns {void}
         * @memberof AudioContextImpl
         */
        play(params: AudioPlayParams): void;
        private _doStop(url, time?);
        /**
         * 暂停音频（不会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof AudioContextImpl
         */
        pause(url: string): void;
        /**
         * 停止音频（会重置进度）
         *
         * @param {string} url 音频URL
         * @memberof AudioContextImpl
         */
        stop(url: string): void;
        /**
         * 停止所有音频
         *
         * @memberof AudioContextImpl
         */
        stopAll(): void;
        /**
         * 跳转音频进度
         *
         * @param {string} url 音频URL
         * @param {number} time 要跳转到的音频位置，毫秒值
         * @memberof AudioContextImpl
         */
        seek(url: string, time: number): void;
    }
}
declare module "engine/audio/AudioManager" {
    import IAudio, { AudioPlayParams } from "engine/audio/IAudio";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-30
     * @modify date 2017-10-30
     *
     * 音频管理器，音频接口被强行分为两部分：Sound和Music。
     * Sound：使用Audio标签播放，可以跨域播放但可能会被某些浏览器限制，必须在点击事件处理函数中播放
     * Music：使用AudioContext播放，可以一定程度上越过点击事件检查，但无法跨域播放，适合播放背景音乐
    */
    export default class AudioManager {
        private _soundImpl;
        /**
         * 注册Sound音频实现对象
         *
         * @param {IAudio} soundImpl Sound音频实现对象
         * @memberof AudioManager
         */
        registerSoundImpl(soundImpl: IAudio): void;
        /**
         * 加载Sound音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        loadSound(url: string): void;
        /**
         * 播放Sound音频，如果没有加载则会先行加载
         *
         * @param {AudioPlayParams} params 音频播放参数
         * @memberof AudioManager
         */
        playSound(params: AudioPlayParams): void;
        /**
         * 停止Sound音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        stopSound(url: string): void;
        /**
         * 暂停Sound音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        pauseSound(url: string): void;
        /**
         * 停止所有Sound音频
         *
         * @memberof AudioManager
         */
        stopAllSound(): void;
        private _musicImpl;
        /**
         * 注册Music音频实现对象
         *
         * @param {IAudio} musicImpl Music音频实现对象
         * @memberof AudioManager
         */
        registerMusicImpl(musicImpl: IAudio): void;
        /**
         * 加载Music音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        loadMusic(url: string): void;
        /**
         * 播放Music音频，如果没有加载则会先行加载
         *
         * @param {AudioPlayParams} [params] 音频参数
         * @memberof AudioManager
         */
        playMusic(params: AudioPlayParams): void;
        /**
         * 停止Music音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        stopMusic(url: string): void;
        /**
         * 暂停Music音频
         *
         * @param {string} url 音频地址
         * @memberof AudioManager
         */
        pauseMusic(url: string): void;
        /**
         * 停止所有Music音频
         *
         * @memberof AudioManager
         */
        stopAllMusics(): void;
    }
    /** 再额外导出一个单例 */
    export const audioManager: AudioManager;
}
declare module "engine/module/ModuleManager" {
    import IModule from "engine/module/IModule";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-15
     *
     * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
    */
    export default class ModuleManager {
        private _moduleDict;
        private _moduleStack;
        private _openCache;
        private _opening;
        /**
         * 获取是否有模块正在打开中
         *
         * @readonly
         * @type {boolean}
         * @memberof ModuleManager
         */
        readonly opening: boolean;
        /**
         * 获取当前模块
         *
         * @readonly
         * @type {IModuleConstructor|undefined}
         * @memberof ModuleManager
         */
        readonly currentModule: IModuleConstructor | undefined;
        /**
         * 获取当前模块的实例
         *
         * @readonly
         * @type {(IModule|undefined)}
         * @memberof ModuleManager
         */
        readonly currentModuleInstance: IModule | undefined;
        /**
         * 获取活动模块数量
         *
         * @readonly
         * @type {number}
         * @memberof ModuleManager
         */
        readonly activeCount: number;
        /**
         * 获取模块在栈中的索引
         *
         * @param {IModuleConstructor} cls 模块类型
         * @returns {number} 索引值
         * @memberof ModuleManager
         */
        getIndex(cls: IModuleConstructor): number;
        /**
         * 获取索引处模块类型
         *
         * @param {number} index 模块索引值
         * @returns {IModuleConstructor} 模块类型
         * @memberof ModuleManager
         */
        getModule(index: number): IModuleConstructor;
        private getAfter(cls);
        private getCurrent();
        registerModule(cls: IModuleConstructor): void;
        /**
         * 获取模块是否开启中
         *
         * @param {IModuleConstructor} cls 要判断的模块类型
         * @returns {boolean} 是否开启
         * @memberof ModuleManager
         */
        isOpened(cls: IModuleConstructor): boolean;
        private activateModule(module, from, data);
        private deactivateModule(module, to, data);
        /**
         * 打开模块
         *
         * @param {IModuleConstructor|string} clsOrName 模块类型或名称
         * @param {*} [data] 参数
         * @param {boolean} [replace=false] 是否替换当前模块
         * @memberof ModuleManager
         */
        open(clsOrName: IModuleConstructor | string, data?: any, replace?: boolean): void;
        /**
         * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发onClose
         *
         * @param {IModuleConstructor|string} clsOrName 模块类型或名称
         * @param {*} [data] 参数
         * @memberof ModuleManager
         */
        close(clsOrName: IModuleConstructor | string, data?: any): void;
    }
    /** 再额外导出一个单例 */
    export const moduleManager: ModuleManager;
}
declare module "engine/bridge/BridgeManager" {
    import IBridge from "engine/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 用来管理所有表现层对象
    */
    export default class BridgeManager {
        private _bridgeDict;
        private _bridgeList;
        /**
         * 获取当前的表现层桥实例（规则是取当前模块的第一个拥有bridge属性的Mediator的bridge）
         *
         * @readonly
         * @type {IBridge}
         * @memberof BridgeManager
         */
        readonly currentBridge: IBridge;
        /**
         * 获取表现层桥实例
         *
         * @param {string} type 表现层类型
         * @returns {IBridge} 表现层桥实例
         * @memberof BridgeManager
         */
        getBridge(type: string): IBridge;
        /**
         * 通过给出一个显示对象皮肤实例来获取合适的表现层桥实例
         *
         * @param {*} skin 皮肤实例
         * @returns {IBridge|null} 皮肤所属表现层桥实例
         * @memberof BridgeManager
         */
        getBridgeBySkin(skin: any): IBridge | null;
        /**
         * 注册一个表现层桥实例到框架中
         *
         * @param {...IBridge[]} bridges 要注册的所有表现层桥
         * @memberof BridgeManager
         */
        registerBridge(...bridges: IBridge[]): void;
        private testAllInit();
    }
    /** 再额外导出一个单例 */
    export const bridgeManager: BridgeManager;
}
declare module "engine/mask/IMaskData" {
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-02
     * @modify date 2017-11-02
     *
     * 遮罩数据接口
    */
    export default interface IMaskData {
        onShowMask?(): void;
        onHideMask?(): void;
        onShowLoading?(skin: any): void;
        onHideLoading?(skin: any): void;
        onShowModalMask?(popup: IPanel): void;
        onHideModalMask?(popup: IPanel): void;
    }
}
declare module "engine/mask/MaskManager" {
    import IPanel from "engine/panel/IPanel";
    import IMaskData from "engine/mask/IMaskData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * 遮罩管理器
    */
    export default class MaskManager {
        private _entityDict;
        private _loadingMaskDict;
        private getLoadingMaskCount();
        private plusLoadingMaskCount(key);
        private minusLoadingMaskCount(key);
        /**
         * 初始化MaskUtil
         * @param type 所属表现层桥
         * @param entity 遮罩实体
         */
        registerMask(type: string, entity: IMaskEntity): void;
        /**
         * 显示遮罩
         */
        showMask(alpha?: number): void;
        /**
         * 隐藏遮罩
         */
        hideMask(): void;
        /**当前是否在显示遮罩*/
        isShowingMask(): boolean;
        /**
         * 显示加载图
         */
        showLoading(alpha?: number, key?: string): void;
        /**
         * 隐藏加载图
         */
        hideLoading(key?: string): void;
        /**当前是否在显示loading*/
        isShowingLoading(): boolean;
        /** 显示模态窗口遮罩 */
        showModalMask(popup: IPanel, alpha?: number): void;
        /** 隐藏模态窗口遮罩 */
        hideModalMask(popup: IPanel): void;
        /** 当前是否在显示模态窗口遮罩 */
        isShowingModalMask(popup: IPanel): boolean;
    }
    export interface IMaskEntity {
        readonly maskData: IMaskData;
        readonly loadingSkin: any;
        showMask(alpha?: number): void;
        hideMask(): void;
        isShowingMask(): boolean;
        showLoading(alpha?: number): void;
        hideLoading(): void;
        isShowingLoading(): boolean;
        showModalMask(popup: IPanel, alpha?: number): void;
        hideModalMask(popup: IPanel): void;
        isShowingModalMask(popup: IPanel): boolean;
    }
    /** 再额外导出一个单例 */
    export const maskManager: MaskManager;
}
declare module "engine/net/NetManager" {
    import RequestData from "engine/net/RequestData";
    import ResponseData, { IResponseDataConstructor } from "engine/net/ResponseData";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-12
     * @modify date 2017-09-12
     *
     * 网络管理器
    */
    export interface ResponseHandler {
        (response: ResponseData, request?: RequestData): void;
    }
    export default class NetManager {
        constructor();
        private onMsgDispatched(msg);
        /**
         * 添加内核消息监听，遇到通讯消息则发送到后端，接到返回值后会将其发送到指定内核里
         *
         * @param {IObservable} observable 内核
         * @memberof NetManager
         */
        listenRequest(observable: IObservable): void;
        private _responseDict;
        /**
         * 注册一个返回结构体
         *
         * @param {string} type 返回类型
         * @param {IResponseDataConstructor} cls 返回结构体构造器
         * @memberof NetManager
         */
        registerResponse(cls: IResponseDataConstructor): void;
        private _responseListeners;
        /**
         * 添加一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @param {IObservable} [observable] 要发送到的内核
         * @memberof NetManager
         */
        listenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean, observable?: IObservable): void;
        /**
         * 移除一个通讯返回监听
         *
         * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
         * @param {ResponseHandler} handler 回调函数
         * @param {*} [thisArg] this指向
         * @param {boolean} [once=false] 是否一次性监听
         * @param {IObservable} [observable] 要发送到的内核
         * @memberof NetManager
         */
        unlistenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean, observable?: IObservable): void;
        /**
         * 发送多条请求，并且等待返回结果（如果有的话），调用回调
         *
         * @param {RequestData[]} [requests 要发送的请求列表
         * @param {(responses?:ResponseData[])=>void} [handler] 收到返回结果后的回调函数
         * @param {*} [thisArg] this指向
         * @param {IObservable} [observable] 要发送到的内核
         * @memberof NetManager
         */
        sendMultiRequests(requests?: RequestData[], handler?: (responses?: ResponseData[]) => void, thisArg?: any, observable?: IObservable): void;
        /** 这里导出不希望用户使用的方法，供框架内使用 */
        __onResponse(type: string, result: any, request?: RequestData): void | never;
        __onError(err: Error, request?: RequestData): void;
    }
    /** 再额外导出一个单例 */
    export const netManager: NetManager;
}
declare module "engine/bind/Utils" {
    /**
     * 创建一个表达式求值方法，用于未来执行
     *
     * @export
     * @param {string} exp 表达式
     * @param {number} [scopeCount=0] 所需的域的数量
     * @returns {(...scopes:any[])=>any} 创建的方法
     */
    export function createEvalFunc(exp: string, scopeCount?: number): (...scopes: any[]) => any;
    /**
     * 表达式求值，无法执行多条语句
     *
     * @export
     * @param {string} exp 表达式
     * @param {...any[]} scopes 表达式的作用域列表
     * @returns {*} 返回值
     */
    export function evalExp(exp: string, ...scopes: any[]): any;
    /**
     * 创建一个执行方法，用于未来执行
     *
     * @export
     * @param {string} exp 表达式
     * @returns {(...scopes:any[])=>any} 创建的方法
     */
    export function createRunFunc(exp: string): (...scopes: any[]) => any;
    /**
     * 直接执行表达式，不求值。该方法可以执行多条语句
     *
     * @export
     * @param {string} exp 表达式
     * @param {...any[]} scopes 表达式的作用域列表
     */
    export function runExp(exp: string, ...scopes: any[]): void;
}
declare module "engine/bind/Bind" {
    import IMediator from "engine/mediator/IMediator";
    import { IWatcher, WatcherCallback } from "engine/bind/Watcher";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-06
     * @modify date 2017-11-06
     *
     * 一个绑定
    */
    export default class Bind {
        private _watcherDict;
        private _mediator;
        /**
         * 获取已绑定的中介者实例
         *
         * @readonly
         * @type {IMediator}
         * @memberof Bind
         */
        readonly mediator: IMediator;
        constructor(mediator: IMediator);
        /**
         * 创建一个观察者，在数值变更时会通知回调进行更新
         *
         * @param {*} target 作用目标，指表达式所在的显示对象
         * @param {string} exp 表达式
         * @param {*} scope 作用域
         * @param {WatcherCallback} callback 订阅器回调
         * @returns {IWatcher} 返回观察者本身
         * @memberof Bind
         */
        createWatcher(target: any, exp: string, scope: any, callback: WatcherCallback): IWatcher;
    }
}
declare module "engine/bind/Watcher" {
    import Bind from "engine/bind/Bind";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-06
     * @modify date 2017-11-06
     *
     * 数据更新订阅者，当依赖的数据有更新时会触发callback通知外面
    */
    export default class Watcher implements IWatcher {
        /** 记录当前正在执行update方法的Watcher引用 */
        static updating: Watcher;
        private static _uid;
        private _value;
        private _bind;
        private _target;
        private _exp;
        private _scope;
        private _expFunc;
        private _callback;
        private _disposed;
        constructor(bind: Bind, target: any, exp: string, scope: any, callback: WatcherCallback);
        /**
         * 获取到表达式当前最新值
         * @returns {any} 最新值
         */
        getValue(): any;
        /**
         * 当依赖的数据有更新时调用该方法
         * @param extra 可能的额外数据
         */
        update(extra?: any): void;
        /** 销毁订阅者 */
        dispose(): void;
        /**
         * 是否相等，包括基础类型和对象/数组的对比
         */
        private static isEqual(a, b);
        /**
         * 是否为对象(包括数组、正则等)
         */
        private static isObject(obj);
        /**
         * 复制对象，若为对象则深度复制
         */
        private static deepCopy(from);
    }
    export interface IWatcher {
        /**
         * 获取到表达式当前最新值
         * @returns {any} 最新值
         */
        getValue(): any;
        /**
         * 当依赖的数据有更新时调用该方法
         * @param extra 可能的额外数据
         */
        update(extra?: any): void;
        /** 销毁订阅者 */
        dispose(): void;
    }
    export interface WatcherCallback {
        (newValue?: any, oldValue?: any, extra?: any): void;
    }
}
declare module "engine/bind/Dep" {
    import Watcher from "engine/bind/Watcher";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-06
     * @modify date 2017-11-06
     *
     * 定义一个依赖，一个观察者实现
    */
    export default class Dep {
        private _map;
        /**
         * 添加数据变更订阅者
         * @param watcher 数据变更订阅者
         */
        watch(watcher: Watcher): void;
        /**
         * 数据变更，通知所有订阅者
         * @param extra 可能的额外数据
         */
        notify(extra?: any): void;
    }
}
declare module "engine/bind/Mutator" {
    /**
     * 将用户传进来的数据“变异”成为具有截获数据变更能力的数据
     * @param data 原始数据
     * @returns {any} 变异后的数据
     */
    export function mutate(data: any): any;
}
declare module "engine/bind/BindManager" {
    import IMediator from "engine/mediator/IMediator";
    import Bind from "engine/bind/Bind";
    import { IResponseDataConstructor } from "engine/net/ResponseData";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-06
     * @modify date 2017-11-06
     *
     * 绑定管理器，可以将数据和显示对象绑定到一起，MVVM书写界面
    */
    export default class BindManager {
        private _bindDict;
        /**
         * 绑定数据到UI上
         *
         * @param {IMediator} mediator 中介者
         * @returns {Bind} 返回绑定实例
         * @memberof BindManager
         */
        bind(mediator: IMediator): Bind;
        /**
         * 移除绑定
         *
         * @param {IMediator} mediator
         * @returns {Bind}
         * @memberof BindManager
         */
        unbind(mediator: IMediator): Bind;
        private search(values, ui, callback);
        private delaySearch(mediator, values, ui, callback);
        /**
         * 绑定属性值
         *
         * @param {IMediator} mediator 中介者
         * @param {{[name:string]:string}} uiDict ui属性字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        bindValue(mediator: IMediator, uiDict: {
            [name: string]: string;
        }, ui: any): void;
        /**
         * 绑定事件
         *
         * @param {IMediator} mediator 中介者
         * @param {{[type:string]:string}} evtDict 事件字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        bindOn(mediator: IMediator, evtDict: {
            [type: string]: string;
        }, ui: any): void;
        private replaceDisplay(bridge, ori, cur);
        /**
         * 绑定显示
         *
         * @param {IMediator} mediator 中介者
         * @param {{[name:string]:string}} uiDict 判断字典
         * @param {*} ui 绑定到的ui实体对象
         * @memberof BindManager
         */
        bindIf(mediator: IMediator, uiDict: {
            [name: string]: string;
        }, ui: any): void;
        /**
         * 绑定全局Message
         *
         * @param {IMediator} mediator 中介者
         * @param {IConstructor|string} type 绑定的消息类型字符串
         * @param {{[name:string]:string}} uiDict ui表达式字典
         * @param {*} ui 绑定到的ui实体对象
         * @param {IObservable} [observable] 绑定的消息内核，默认是core
         * @memberof BindManager
         */
        bindMessage(mediator: IMediator, type: IConstructor | string, uiDict: {
            [name: string]: string;
        }, ui: any, observable?: IObservable): void;
        /**
         * 绑定全局Response
         *
         * @param {IMediator} mediator 中介者
         * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
         * @param {{[name:string]:string}} uiDict ui表达式字典
         * @param {*} ui 绑定到的ui实体对象
         * @param {IObservable} [observable] 绑定的消息内核，默认是core
         * @memberof BindManager
         */
        bindResponse(mediator: IMediator, type: IResponseDataConstructor | string, uiDict: {
            [name: string]: string;
        }, ui: any, observable?: IObservable): void;
    }
    /** 再额外导出一个单例 */
    export const bindManager: BindManager;
}
declare module "engine/mediator/Mediator" {
    import IMessage from "core/message/IMessage";
    import IModuleMediator from "engine/mediator/IModuleMediator";
    import IBridge from "engine/bridge/IBridge";
    import IModule from "engine/module/IModule";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 组件界面中介者基类
    */
    export default class Mediator implements IModuleMediator {
        /**
         * 表现层桥
         *
         * @type {IBridge}
         * @memberof Mediator
         */
        bridge: IBridge;
        private _viewModel;
        /**
         * 获取或设置ViewModel
         *
         * @type {*}
         * @memberof Mediator
         */
        viewModel: any;
        /**
         * 皮肤
         *
         * @type {*}
         * @memberof Mediator
         */
        skin: any;
        private _disposed;
        /**
         * 获取中介者是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Mediator
         */
        readonly disposed: boolean;
        private _dependModuleInstance;
        /**
         * 所属的模块引用，需要配合@DelegateMediator使用
         *
         * @readonly
         * @type {IModule}
         * @memberof IMediator
         */
        readonly dependModuleInstance: IModule;
        private _dependModule;
        /**
         * 所属的模块类型，需要配合@DelegateMediator使用
         *
         * @readonly
         * @type {IModuleConstructor}
         * @memberof IMediator
         */
        readonly dependModule: IModuleConstructor;
        private _data;
        /**
         * 打开时传递的data对象
         *
         * @readonly
         * @type {*}
         * @memberof Mediator
         */
        readonly data: any;
        constructor(skin?: any);
        /**
         * 列出中介者所需的资源数组，可重写
         * 但如果Mediator没有被托管在Module中则该方法不应该被重写，否则可能会有问题
         *
         * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
         * @memberof Mediator
         */
        listAssets(): string[];
        /**
         * 加载从listAssets中获取到的所有资源
         *
         * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
         * @returns {void}
         * @memberof Mediator
         */
        loadAssets(handler: (err?: Error) => void): void;
        /**
         * 当所需资源加载完毕后调用
         *
         * @param {Error} [err] 加载出错会给出错误对象，没错则不给
         * @memberof Mediator
         */
        onLoadAssets(err?: Error): void;
        /**
         * 打开，为了实现IOpenClose接口
         *
         * @param {*} [data]
         * @returns {*}
         * @memberof Mediator
         */
        open(data?: any): any;
        /**
         * 关闭，为了实现IOpenClose接口
         *
         * @param {*} [data]
         * @returns {*}
         * @memberof Mediator
         */
        close(data?: any): any;
        /**
         * 当打开时调用
         *
         * @param {*} [data] 可能的打开参数
         * @memberof Mediator
         */
        onOpen(data?: any): void;
        /**
         * 当关闭时调用
         *
         * @param {*} [data] 可能的关闭参数
         * @memberof Mediator
         */
        onClose(data?: any): void;
        private _listeners;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        unmapAllListeners(): void;
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /*********************** 下面是模块消息系统 ***********************/
        /**
         * 暴露IObservable
         *
         * @readonly
         * @type {IObservable}
         * @memberof Mediator
         */
        readonly observable: IObservable;
        /**
         * 监听消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        listenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        unlistenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof IModuleObservable
         */
        mapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof IModuleObservable
         */
        unmapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 派发消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof IModuleObservable
         */
        dispatchModule(msg: IMessage): void;
        /**
         * 派发消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof IModuleObservable
         */
        dispatchModule(type: string, ...params: any[]): void;
        /**
         * 销毁中介者
         *
         * @memberof Mediator
         */
        dispose(): void;
    }
}
declare module "engine/injector/Injector" {
    import { IResponseDataConstructor } from "engine/net/ResponseData";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 负责注入的模块
    */
    /** 定义数据模型，支持实例注入，并且自身也会被注入 */
    export function ModelClass(...args: any[]): any;
    /** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
    export function MediatorClass(cls: IConstructor): IConstructor;
    /** 定义模块，支持实例注入 */
    export function ModuleClass(cls: IModuleConstructor): IConstructor;
    /** 处理模块消息 */
    export function ModuleMessageHandler(prototype: any, propertyKey: string): void;
    export function ModuleMessageHandler(type: string): MethodDecorator;
    /** 处理通讯消息返回 */
    export function ResponseHandler(prototype: any, propertyKey: string): void;
    export function ResponseHandler(cls: IResponseDataConstructor): MethodDecorator;
    /** 在Module内托管Mediator */
    export function DelegateMediator(prototype: any, propertyKey: string): any;
    /**
     * 一次绑定多个属性
     *
     * @export
     * @param {{[name:string]:string}} uiDict ui属性和表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindValue(uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定一个属性
     *
     * @export
     * @param {string} name ui属性名称
     * @param {string} exp 表达式
     * @returns {PropertyDecorator}
     */
    export function BindValue(name: string, exp: string): PropertyDecorator;
    /**
     * 一次绑定多个事件
     *
     * @export
     * @param {{[type:string]:string}} evtDict 事件类型和表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindOn(evtDict: {
        [type: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定一个事件
     *
     * @export
     * @param {string} type 事件类型
     * @param {string} exp 表达式
     * @returns {PropertyDecorator}
     */
    export function BindOn(type: string, exp: string): PropertyDecorator;
    /**
     * 一次绑定多个显示判断，如果要指定当前显示对象请使用$target作为key
     *
     * @export
     * @param {{[name:string]:string}} uiDict ui属性和表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindIf(uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定一个显示判断
     *
     * @export
     * @param {string} name ui属性名称
     * @param {string} exp 表达式
     * @returns {PropertyDecorator}
     */
    export function BindIf(name: string, exp: string): PropertyDecorator;
    /**
     * 绑定当前对象的显示判断
     *
     * @export
     * @param {string} exp 表达式
     * @returns {PropertyDecorator}
     */
    export function BindIf(exp: string): PropertyDecorator;
    /**
     * 一次绑定多个全局消息
     *
     * @export
     * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindMessage(msgDict: {
        [type: string]: {
            [name: string]: string;
        };
    }): PropertyDecorator;
    /**
     * 一次绑定一个全局消息
     *
     * @export
     * @param {IConstructor|string} type 消息类型或消息类型名称
     * @param {string} uiDict ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindMessage(type: IConstructor | string, uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定多个模块消息
     *
     * @export
     * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindModuleMessage(msgDict: {
        [type: string]: {
            [name: string]: string;
        };
    }): PropertyDecorator;
    /**
     * 一次绑定一个模块消息
     *
     * @export
     * @param {IConstructor|string} type 消息类型或消息类型名称
     * @param {string} uiDict ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindModuleMessage(type: IConstructor | string, uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定多个全局通讯消息
     *
     * @export
     * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindResponse(resDict: {
        [type: string]: {
            [name: string]: string;
        };
    }): PropertyDecorator;
    /**
     * 一次绑定一个全局通讯消息
     *
     * @export
     * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
     * @param {string} uiDict ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindResponse(type: IResponseDataConstructor | string, uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
    /**
     * 一次绑定多个模块通讯消息
     *
     * @export
     * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindModuleResponse(resDict: {
        [type: string]: {
            [name: string]: string;
        };
    }): PropertyDecorator;
    /**
     * 一次绑定一个模块通讯消息
     *
     * @export
     * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
     * @param {string} uiDict ui表达式字典
     * @returns {PropertyDecorator}
     */
    export function BindModuleResponse(type: IResponseDataConstructor | string, uiDict: {
        [name: string]: string;
    }): PropertyDecorator;
}
declare module "engine/platform/IPlatform" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 平台接口
    */
    export default interface IPlatform {
        /**
         * 刷新当前页面
         *
         * @memberof IPlatform
         */
        reload(): void;
    }
}
declare module "engine/platform/WebPlatform" {
    import IPlatform from "engine/platform/IPlatform";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 网页平台接口实现类，也是平台接口的默认类
    */
    export default class WebPlatform implements IPlatform {
        reload(): void;
    }
}
declare module "engine/platform/PlatformManager" {
    import IPlatform from "engine/platform/IPlatform";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 平台接口管理器，通过桥接模式统一不同平台的不同接口，从而实现对框架其他模块透明化
    */
    export default class PlatformManager implements IPlatform {
        /**
         * 平台接口实现对象，默认是普通网页平台，也可以根据需要定制
         *
         * @type {IPlatform}
         * @memberof PlatformManager
         */
        platform: IPlatform;
        /**
         * 刷新当前页面
         *
         * @memberof PlatformManager
         */
        reload(): void;
    }
    /** 再额外导出一个单例 */
    export const platformManager: PlatformManager;
}
declare module "engine/model/Model" {
    import IMessage from "core/message/IMessage";
    import IObservable from "core/observable/IObservable";
    import ICommandConstructor from "core/command/ICommandConstructor";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * Model的基类，也可以不继承该基类，因为Model是很随意的东西
    */
    export default abstract class Model implements IObservable {
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Model
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Model
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Model
         */
        listen(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Model
         */
        unlisten(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Model
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Model
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
    }
}
declare module "engine/panel/PanelMediator" {
    import Mediator from "engine/mediator/Mediator";
    import IPanel from "engine/panel/IPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 实现了IPanel接口的弹窗中介者基类
    */
    export default class PanelMediator extends Mediator implements IPanel {
        /**
         * 弹出策略
         *
         * @type {IPanelPolicy}
         * @memberof PanelMediator
         */
        policy: IPanelPolicy;
        constructor(skin?: any, policy?: IPanelPolicy);
        /**
         * 弹出当前弹窗（等同于调用PanelManager.pop方法）
         *
         * @param {*} [data] 数据
         * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
         * @param {{x:number, y:number}} [from] 弹出点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        open(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): IPanel;
        /**
         * 弹出当前弹窗（只能由PanelManager调用）
         *
         * @param {*} [data] 数据
         * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
         * @param {{x:number, y:number}} [from] 弹出点坐标
         * @memberof PanelMediator
         */
        __open(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /**
         * 关闭当前弹窗（等同于调用PanelManager.drop方法）
         *
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        close(data?: any, to?: {
            x: number;
            y: number;
        }): IPanel;
        /**
         * 关闭当前弹窗（只能由PanelManager调用）
         *
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭点坐标
         * @memberof PanelMediator
         */
        __close(data?: any, to?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出前调用的方法 */
        onBeforePop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出后调用的方法 */
        onAfterPop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭前调用的方法 */
        onBeforeDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭后调用的方法 */
        onAfterDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/scene/NoneScenePolicy" {
    import IScene from "engine/scene/IScene";
    import IScenePolicy from "engine/scene/IScenePolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 无任何动画的场景策略，可应用于任何显示层实现
    */
    export class NoneScenePolicy implements IScenePolicy {
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        prepareSwitch(from: IScene, to: IScene): void;
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        switch(from: IScene, to: IScene, callback: () => void): void;
    }
    const _default: NoneScenePolicy;
    export default _default;
}
declare module "engine/scene/SceneMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 场景相关的消息
    */
    export default class SceneMessage {
        /**
         * 切换场景前的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        static SCENE_BEFORE_CHANGE: string;
        /**
         * 切换场景后的消息
         *
         * @static
         * @type {string}
         * @memberof SceneMessage
         */
        static SCENE_AFTER_CHANGE: string;
    }
}
declare module "utils/SyncUtil" {
    /**
     * 判断是否正在进行操作
     *
     * @export
     * @param {string} name 队列名
     * @returns {boolean} 队列是否正在操作
     */
    export function isOperating(name: string): boolean;
    /**
     * 开始同步操作，所有传递了相同name的操作会被以队列方式顺序执行
     *
     * @export
     * @param name 一个队列的名字
     * @param {Function} fn 要执行的方法
     * @param {*} [thisArg] 方法this对象
     * @param {...any[]} [args] 方法参数
     */
    export function wait(name: string, fn: Function, thisArg?: any, ...args: any[]): void;
    /**
     * 完成一步操作并唤醒后续操作
     *
     * @export
     * @param {string} name 队列名字
     * @returns {void}
     */
    export function notify(name: string): void;
}
declare module "engine/scene/SceneManager" {
    import IScene from "engine/scene/IScene";
    export default class SceneManager {
        private _sceneStack;
        /**
         * 获取当前场景
         *
         * @readonly
         * @type {IScene}
         * @memberof SceneManager
         */
        readonly currentScene: IScene;
        /**
         * 获取活动场景个数
         *
         * @readonly
         * @type {number}
         * @memberof SceneManager
         */
        readonly activeCount: number;
        /**
         * 获取场景是否已经开启
         *
         * @param {IScene} scene 场景对象
         * @returns {boolean} 是否已经开启
         * @memberof SceneManager
         */
        isOpened(scene: IScene): boolean;
        /**
         * 切换场景，替换当前场景，当前场景会被销毁
         *
         * @param {IScene} scene 要切换到的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        switch(scene: IScene, data?: any): IScene;
        /**
         * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
         *
         * @param {IScene} scene 要推入的场景
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        push(scene: IScene, data?: any): IScene;
        /**
         * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
         *
         * @param {IScene} scene 要切换出的场景，如果传入的场景不是当前场景则仅移除指定场景，不会进行切换操作
         * @param {*} [data] 要携带给下一个场景的数据
         * @returns {IScene} 场景本体
         * @memberof SceneManager
         */
        pop(scene: IScene, data?: any): IScene;
        private doPop(scene, data);
        private doChange(from, to, data, policy, type, begin?, complete?);
    }
    /** 再额外导出一个单例 */
    export const sceneManager: SceneManager;
}
declare module "engine/scene/SceneMediator" {
    import Mediator from "engine/mediator/Mediator";
    import IScene from "engine/scene/IScene";
    import IScenePolicy from "engine/scene/IScenePolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-08
     * @modify date 2017-09-08
     *
     * 实现了IScene接口的场景中介者基类
    */
    export default class SceneMediator extends Mediator implements IScene {
        /**
         * 切换策略
         *
         * @type {IScenePolicy}
         * @memberof SceneMediator
         */
        policy: IScenePolicy;
        constructor(skin?: any, policy?: IScenePolicy);
        /**
         * 打开当前场景（相当于调用SceneManager.push方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        open(data?: any): IScene;
        /**
         * 打开当前场景（只能由SceneManager调用）
         *
         * @param {*} [data] 数据
         * @memberof SceneMediator
         */
        __open(data?: any): void;
        /**
         * 关闭当前场景（相当于调用SceneManager.pop方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        close(data?: any): IScene;
        /**
         * 关闭当前场景（只能由SceneManager调用）
         *
         * @param {*} [data] 数据
         * @memberof SceneMediator
         */
        __close(data?: any): void;
        /**
         * 切入场景开始前调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onBeforeIn(fromScene: IScene, data?: any): void;
        /**
         * 切入场景开始后调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onAfterIn(fromScene: IScene, data?: any): void;
        /**
         * 切出场景开始前调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onBeforeOut(toScene: IScene, data?: any): void;
        /**
         * 切出场景开始后调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onAfterOut(toScene: IScene, data?: any): void;
    }
}
declare module "engine/module/Module" {
    import IMessage from "core/message/IMessage";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import RequestData from "engine/net/RequestData";
    import ResponseData from "engine/net/ResponseData";
    import IModuleMediator from "engine/mediator/IModuleMediator";
    import IModuleConstructor from "engine/module/IModuleConstructor";
    import IModule from "engine/module/IModule";
    import IObservable from "core/observable/IObservable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * 模块基类
    */
    export default abstract class Module implements IModule {
        /**
         * 打开时传入的参数
         *
         * @type {*}
         * @memberof Module
         */
        data: any;
        /**
         * 模块初始消息的返回数据
         *
         * @type {ResponseData[]}
         * @memberof Module
         */
        responses: ResponseData[];
        private _disposed;
        /**
         * 获取是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Module
         */
        readonly disposed: boolean;
        /**
         * 获取背景音乐URL
         *
         * @readonly
         * @type {string}
         * @memberof Module
         */
        readonly bgMusic: string;
        /**
         * 所属的模块引用
         *
         * @readonly
         * @type {IModule}
         * @memberof IMediator
         */
        readonly dependModuleInstance: IModule;
        /**
         * 所属的模块类型
         *
         * @readonly
         * @type {IModuleConstructor}
         * @memberof IMediator
         */
        readonly dependModule: IModuleConstructor;
        private _mediators;
        /**
         * 获取所有已托管的中介者
         *
         * @returns {IModuleMediator[]} 已托管的中介者
         * @memberof Module
         */
        readonly delegatedMediators: IModuleMediator[];
        private _disposeDict;
        private disposeMediator(mediator);
        /**
         * 托管中介者
         *
         * @param {IModuleMediator} mediator 中介者
         * @memberof Module
         */
        delegateMediator(mediator: IModuleMediator): void;
        /**
         * 取消托管中介者
         *
         * @param {IModuleMediator} mediator 中介者
         * @memberof Module
         */
        undelegateMediator(mediator: IModuleMediator): void;
        /**
         * 判断指定中介者是否包含在该模块里
         *
         * @param {IModuleMediator} mediator 要判断的中介者
         * @returns {boolean} 是否包含在该模块里
         * @memberof Module
         */
        constainsMediator(mediator: IModuleMediator): boolean;
        /**
         * 列出模块所需CSS资源URL，可以重写
         *
         * @returns {string[]} CSS资源列表
         * @memberof Module
         */
        listStyleFiles(): string[];
        /**
         * 列出模块所需JS资源URL，可以重写
         *
         * @returns {string[]} js资源列表
         * @memberof Module
         */
        listJsFiles(): string[];
        /**
         * 列出模块初始化请求，可以重写
         *
         * @returns {RequestData[]} 模块的初始化请求列表
         * @memberof Module
         */
        listInitRequests(): RequestData[];
        /**
         * 当模块资源加载完毕后调用
         *
         * @param {Error} [err] 任何一个Mediator资源加载出错会给出该错误对象，没错则不给
         * @memberof Module
         */
        onLoadAssets(err?: Error): void;
        /**
         * 打开模块时调用，可以重写
         *
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        onOpen(data?: any): void;
        /**
         * 关闭模块时调用，可以重写
         *
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        onClose(data?: any): void;
        /**
         * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
         *
         * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        onActivate(from: IModuleConstructor | undefined, data?: any): void;
        /**
         * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
         *
         * @param {IModuleConstructor|undefined} to 要切换到哪个模块
         * @param {*} [data] 传递给模块的数据
         * @memberof Module
         */
        onDeactivate(to: IModuleConstructor | undefined, data?: any): void;
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /*********************** 下面是模块消息系统 ***********************/
        private _observable;
        /**
         * 暴露IObservable接口
         *
         * @readonly
         * @type {IObservable}
         * @memberof Module
         */
        readonly observable: IObservable;
        /**
         * 监听消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        listenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 移除消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof IModuleObservable
         */
        unlistenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof IModuleObservable
         */
        mapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof IModuleObservable
         */
        unmapCommandModule(type: string, cmd: ICommandConstructor): void;
        /**
         * 派发消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof IModuleObservable
         */
        dispatchModule(msg: IMessage): void;
        /**
         * 派发消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof IModuleObservable
         */
        dispatchModule(type: string, ...params: any[]): void;
        /**
         * 销毁模块，可以重写
         *
         * @memberof Module
         */
        dispose(): void;
    }
}
declare module "engine/env/Explorer" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Explorer类记录浏览器相关数据
    */
    /**
     * 浏览器类型枚举
     *
     * @enum {number}
     */
    export enum ExplorerType {
        IE = 0,
        EDGE = 1,
        OPERA = 2,
        FIREFOX = 3,
        SAFARI = 4,
        CHROME = 5,
        OTHERS = 6,
    }
    export default class Explorer {
        private _type;
        /**
         * 获取浏览器类型枚举值
         *
         * @readonly
         * @type {ExplorerType}
         * @memberof Explorer
         */
        readonly type: ExplorerType;
        private _typeStr;
        /**
         * 获取浏览器类型字符串
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        readonly typeStr: string;
        private _version;
        /**
         * 获取浏览器版本
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        readonly version: string;
        private _bigVersion;
        /**
         * 获取浏览器大版本
         *
         * @readonly
         * @type {string}
         * @memberof Explorer
         */
        readonly bigVersion: string;
        constructor();
    }
    /** 再额外导出一个单例 */
    export const explorer: Explorer;
}
declare module "engine/env/WindowExternal" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * External类为window.external参数字典包装类
    */
    export default class WindowExternal {
        private _params;
        /**
         * 获取全部window.external参数
         *
         * @readonly
         * @type {{[key:string]:string}}
         * @memberof WindowExternal
         */
        readonly params: {
            [key: string]: string;
        };
        constructor();
        /**
         * 获取window.external中的参数
         *
         * @param {string} key 参数名
         * @returns {*} 参数值
         * @memberof External
         */
        getParam(key: string): any;
    }
    /** 再额外导出一个单例 */
    export const windowExternal: WindowExternal;
}
declare module "engine/env/Hash" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
    */
    export default class Hash {
        private _hash;
        /**
         * 获取原始的哈希字符串
         *
         * @readonly
         * @type {string}
         * @memberof Hash
         */
        readonly hash: string;
        private _moduleName;
        /**
         * 获取模块名
         *
         * @readonly
         * @type {string}
         * @memberof Hash
         */
        readonly moduleName: string;
        private _params;
        /**
         * 获取传递给模块的参数
         *
         * @readonly
         * @type {{[key:string]:string}}
         * @memberof Hash
         */
        readonly params: {
            [key: string]: string;
        };
        private _direct;
        /**
         * 获取是否直接跳转模块
         *
         * @readonly
         * @type {boolean}
         * @memberof Hash
         */
        readonly direct: boolean;
        private _keepHash;
        /**
         * 获取是否保持哈希值
         *
         * @readonly
         * @type {boolean}
         * @memberof Hash
         */
        readonly keepHash: boolean;
        constructor();
        /**
         * 获取指定哈希参数
         *
         * @param {string} key 参数名
         * @returns {string} 参数值
         * @memberof Hash
         */
        getParam(key: string): string;
    }
    /** 再额外导出一个单例 */
    export const hash: Hash;
}
declare module "engine/env/Query" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Query类记录通过GET参数传递给框架的参数字典
    */
    export default class Query {
        private _params;
        /**
         * 获取全部Query参数
         *
         * @readonly
         * @type {{[key:string]:string}}
         * @memberof Query
         */
        readonly params: {
            [key: string]: string;
        };
        constructor();
        /**
         * 获取GET参数
         *
         * @param {string} key 参数key
         * @returns {string} 参数值
         * @memberof Query
         */
        getParam(key: string): string;
    }
    /** 再额外导出一个单例 */
    export const query: Query;
}
declare module "engine/net/policies/HTTPRequestPolicy" {
    import IRequestPolicy from "engine/net/IRequestPolicy";
    import RequestData from "engine/net/RequestData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * HTTP请求策略
    */
    export class HTTPRequestPolicy implements IRequestPolicy {
        /**
         * 发送请求逻辑
         *
         * @param {RequestData} request 请求数据
         * @memberof HTTPRequestPolicy
         */
        sendRequest(request: RequestData): void;
    }
    const _default: HTTPRequestPolicy;
    export default _default;
}
declare module "engine/plugin/IPlugin" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * 插件接口
    */
    export default interface IPlugin {
        /** 初始化插件，插件会在框架初始化完毕，首个模块打开前调用 */
        initPlugin(): void;
    }
}
declare module "utils/CookieUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-01
     * @modify date 2017-11-01
     *
     * Cookie工具
    */
    /**
     * 获取cookie值
     *
     * @export
     * @param {string} name cookie名称
     * @returns {string} cookie值
     */
    export function getCookie(name: string): string;
    /**
     * 获取cookie值
     *
     * @export
     * @param {string} name cookie名称
     * @param {*} value cookie值
     * @param {number} [expire] 有效期时长（毫秒）
     */
    export function setCookie(name: string, value: any, expire?: number): void;
}
declare module "engine/Engine" {
    import IModuleConstructor from "engine/module/IModuleConstructor";
    import IBridge from "engine/bridge/IBridge";
    import IPlugin from "engine/plugin/IPlugin";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
     * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
    */
    export default class Engine {
        private _initParams;
        private _loadElement;
        /**
         * 初始化Engine
         *
         * @param {IInitParams} params 初始化参数
         * @memberof Engine
         */
        initialize(params: IInitParams): void;
        private onAllBridgesInit();
        private onPreloadOK();
        private onModuleChange(from);
    }
    /** 再额外导出一个单例 */
    export const engine: Engine;
    export interface IInitParams {
        /**
         * 表现层桥数组，所有可能用到的表现层桥都要在此实例化并传入
         *
         * @type {IBridge[]}
         * @memberof OlympusInitParams
         */
        bridges: IBridge[];
        /**
         * 首模块类型，框架初始化完毕后进入的模块
         *
         * @type {IModuleConstructor}
         * @memberof OlympusInitParams
         */
        firstModule: IModuleConstructor;
        /**
         * 会在首个模块被显示出来后从页面中移除
         *
         * @type {(Element|string)}
         * @memberof OlympusInitParams
         */
        loadElement?: Element | string;
        /**
         * 环境字符串，默认为"dev"
         *
         * @type {string}
         * @memberof IInitParams
         */
        env?: string;
        /**
         * 消息域名字典数组，首个字典会被当做默认字典，没传递则会用当前域名代替
         *
         * @type {{[env:string]:string[]}}
         * @memberof IInitParams
         */
        hostsDict?: {
            [env: string]: string[];
        };
        /**
         * CDN域名列表，若没有提供则使用host代替
         *
         * @type {{[env:string]:string[]}}
         * @memberof IInitParams
         */
        cdnsDict?: {
            [env: string]: string[];
        };
        /**
         * 插件列表
         *
         * @type {IPlugin[]}
         * @memberof IInitParams
         */
        plugins?: IPlugin[];
        /**
         * 短名称路径字典，key是短名称，value是路径
         *
         * @type {{[key:string]:string}}
         * @memberof IInitParams
         */
        pathDict?: {
            [key: string]: string;
        };
        /**
         * 预加载数组或字典，如果是字典则key为短名称，value为资源路径
         * 会在表现层桥初始化完毕后、框架初始化完毕前加载，加载结果会保存在AssetsManager中
         *
         * @type {string[]}
         * @memberof IInitParams
         */
        preloads?: string[];
        /**
         * 框架初始化完毕时调用
         *
         * @type {()=>void}
         * @memberof IInitParams
         */
        onInited?: () => void;
    }
}
declare module "Olympus" {
    import { IInitParams } from "engine/Engine";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * Olympus框架便捷启动与框架外观模块
    */
    export default class Olympus {
        /**
         * 启动Olympus框架
         *
         * @static
         * @param {IInitParams} params 启动参数
         * @memberof Olympus
         */
        static startup(params: IInitParams): void;
    }
}
