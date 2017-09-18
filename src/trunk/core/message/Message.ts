import IMessage from "./IMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 框架内核消息基类
*/
export default class Message implements IMessage
{
    private _type:string;
    /**
     * 获取消息类型字符串
     * 
     * @returns {string} 消息类型字符串
     * @memberof Message
     */
    public getType():string
    {
        return this._type;
    }

    /**
     * 消息参数列表
     * 
     * @type {any[]}
     * @memberof Message
     */
    public params:any[];

    /**
     * Creates an instance of Message.
     * @param {string} type 消息类型
     * @param {...any[]} params 可能的消息参数列表
     * @memberof Message
     */
    public constructor(type:string, ...params:any[])
    {
        this._type = type;
        this.params = params;
    }
}