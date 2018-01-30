import IMessage from "../message/IMessage";
import ICommandConstructor from "../command/ICommandConstructor";
import IObservable from "./IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 *
 * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
*/
export default class Observable implements IObservable {
    private _listenerDict;
    /**
     * 获取到IObservable实体，若本身就是IObservable实体则返回本身
     *
     * @type {IObservable}
     * @memberof Observable
     */
    readonly observable: IObservable;
    /**
     * 获取到父级IObservable
     *
     * @type {IObservable}
     * @memberof Observable
     */
    parent: IObservable;
    constructor(parent?: IObservable);
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
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof Observable
     */
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    /**
     * 移除内核消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof Observable
     */
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
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
