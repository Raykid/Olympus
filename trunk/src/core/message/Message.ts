import IMessage from "./IMessage"
import IObservable from "../observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 消息基类
*/
export default abstract class Message implements IMessage
{
    private _type:string;
    /**
     * 获取消息类型字符串
     * 
     * @readonly
     * @type {string}
     * @memberof Message
     */
    public get __type():string
    {
        return this._type;
    }
    
    /**
     * 消息当前所属内核
     * 
     * @type {IObservable}
     * @memberof Message
     */
    public get __observable():IObservable
    {
        return this.__observables[0];
    }

    /**
     * 消息所属的原始内核（第一个派发到的内核）
     * 
     * @type {IObservable}
     * @memberof Message
     */
    public get __oriObservable():IObservable
    {
        return this.__observables[this.__observables.length - 1];
    }
    
    /**
     * 消息派发内核列表
     * 
     * @type {IObservable}
     * @memberof Message
     */
    public __observables:IObservable[] = [];

    public constructor(type:string)
    {
        this._type = type;
    }

    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     * 
     * @memberof Message
     */
    public redispatch():void
    {
        this.__oriObservable.dispatch(this);
    }
}