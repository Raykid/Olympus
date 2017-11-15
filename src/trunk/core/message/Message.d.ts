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
