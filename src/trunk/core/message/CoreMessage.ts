import IMessage from "./IMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 核心事件类型
*/
export default class CoreMessage implements IMessage
{
    /**
     * 任何消息派发到框架后都会派发这个消息
     * 
     * @static
     * @type {string}
     * @memberof CoreMessage
     */
    public static MESSAGE_DISPATCHED:string = "messageDispatched";

    private _type:string;
    /**
     * 获取事件类型
     * 
     * @returns {string} 
     * @memberof CoreMessage
     */
    public getType():string
    {
        return this._type;
    }

    private _message:IMessage;
    /**
     * 获取发送到框架内核的消息体
     * 
     * @returns {IMessage} 
     * @memberof CoreMessage
     */
    public getMessage():IMessage
    {
        return this._message;
    }

    public constructor(type:string, message:IMessage)
    {
        this._type = type;
        this._message = message;
    }
}