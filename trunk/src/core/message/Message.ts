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
    public get type():string
    {
        return this._type;
    }
    
    /**
     * 消息所属内核
     * 
     * @type {IObservable}
     * @memberof RequestData
     */
    public __observable:IObservable;

    public constructor(type:string)
    {
        this._type = type;
    }
}