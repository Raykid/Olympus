import IMessage from '../interfaces/IMessage';
import IObservable from "../interfaces/IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 *
 * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
*/
export default class Observable implements IObservable {
    protected _listenerDict: {
        [type: string]: IMessageData[];
    };
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
    protected handleMessages(msg: IMessage): void;
    protected doDispatch(msg: IMessage): void;
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
    protected _disposed: boolean;
    /** 是否已经被销毁 */
    readonly disposed: boolean;
    /** 销毁 */
    dispose(): void;
}
/**
 * 上下文模块内部使用的记录转发数据的接口
 *
 * @export
 * @interface IMessageData
 */
export interface IMessageData {
    handler: Function;
    thisArg: any;
    once: boolean;
}
