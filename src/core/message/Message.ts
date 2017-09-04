import IMessage from "./IMessage"

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
    public getType():string
    {
        return this._type;
    }

    /**
     * 消息参数列表
     * 
     * @type {any[]}
     * @memberof ContextMessage
     */
    public params:any[];

    /**
     * Creates an instance of ContextMessage.
     * @param {string} type 消息类型
     * @param {...any[]} params 可能的消息参数列表
     * @memberof ContextMessage
     */
    public constructor(type:string, ...params:any[])
    {
        this._type = type;
        this.params = params;
    }
}