import IMessage from "../message/IMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * 具有派发系统消息的便捷接口
*/
export default interface IDispatcher
{
    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    dispatch(msg:IMessage):void;
    
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    dispatch(type:string, ...params:any[]):void;
}