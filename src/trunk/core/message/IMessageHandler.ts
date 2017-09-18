import IMessage from "./IMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 框架消息处理函数接口
*/
export default interface IMessageHandler
{
    (msg:IMessage):void;
    (...args:any[]):void;
}