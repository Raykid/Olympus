import IMessage from "./IMessage";
import IObservable from "../observable/IObservable";
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
    readonly __type: string;
    /**
     * 消息当前所属内核
     *
     * @type {IObservable}
     * @memberof Message
     */
    readonly __observable: IObservable;
    /**
     * 消息所属的原始内核（第一个派发到的内核）
     *
     * @type {IObservable}
     * @memberof Message
     */
    readonly __oriObservable: IObservable;
    /**
     * 消息派发内核列表
     *
     * @type {IObservable}
     * @memberof Message
     */
    __observables: IObservable[];
    constructor(type: string);
    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     *
     * @memberof Message
     */
    redispatch(): void;
}
