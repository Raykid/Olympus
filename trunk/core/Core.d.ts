import IMessage from "./message/IMessage";
import ICommandConstructor from "./command/ICommandConstructor";
import IObservable from "./observable/IObservable";
import "reflect-metadata";
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
 * 核心上下文对象，负责内核消息转发、对象注入等核心功能的实现
 *
 * @export
 * @class Core
 */
export default class Core implements IObservable {
    private static _instance;
    /**
     * Core的disposed属性没有任何作用，仅为了实现接口，始终会返回false
     *
     * @readonly
     * @type {boolean}
     * @memberof Core
     */
    readonly disposed: boolean;
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
     * 获取到父级IObservable
     *
     * @type {IObservable}
     * @memberof Core
     */
    readonly parent: IObservable;
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
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Core
     */
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Core
     */
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
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
    /**
     * Core的dispose方法没有任何作用，仅为了实现接口
     *
     * @memberof Core
     */
    dispose(): void;
}
/** 再额外导出一个单例 */
export declare const core: Core;
