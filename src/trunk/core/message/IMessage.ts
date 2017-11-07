import IObservable from "../observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 框架内核消息接口
*/
export default interface IMessage
{
    /**
     * 获取消息类型
     * 
     * @readonly
     * @type {string}
     * @memberof IMessage
     */
    readonly type:string;
    /**
     * 消息所属内核
     * 
     * @type {IObservable}
     * @memberof IMessage
     */
    readonly __observable:IObservable;
}