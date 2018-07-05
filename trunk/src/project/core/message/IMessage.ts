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
    readonly __type:string;
    /**
     * 消息所属内核
     * 
     * @type {IObservable}
     * @memberof IMessage
     */
    readonly __observable:IObservable;
    /**
     * 消息所属的原始内核（第一个派发到的内核）
     * 
     * @type {IObservable}
     * @memberof IMessage
     */
    readonly __oriObservable:IObservable;
    /**
     * 消息派发内核列表
     * 
     * @type {IObservable}
     * @memberof IMessage
     */
    readonly __observables:IObservable[];

    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     * 
     * @memberof IMessage
     */
    redispatch():void;
}