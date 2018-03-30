import IMessage from "../../core/message/IMessage";
import IRequestPolicy from "./IRequestPolicy";
import { IResponseDataConstructor } from "./ResponseData";
import IObservable from "../../core/observable/IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 通讯发送消息基类
*/
export interface IRequestParams {
    /**
     * 消息名
     *
     * @type {string}
     * @memberof IRequestParams
     */
    type: string;
    /**
     * 消息路径
     *
     * @type {string}
     * @memberof IRequestParams
     */
    path: string;
    /**
     * 消息数据
     *
     * @type {*}
     * @memberof IRequestParams
     */
    data: any;
    /**
     * 协议类型
     *
     * @type {string}
     * @memberof IRequestParams
     */
    protocol: string;
    /**
     * 返回类型，如果消息没有返回类型或不确定是否有返回类型，则此处可以不定义（如Socket消息）
     *
     * @type {IResponseDataConstructor}
     * @memberof IRequestParams
     */
    response?: IResponseDataConstructor;
    /**
     * 其他可能需要的参数
     *
     * @type {*}
     * @memberof IRequestParams
     */
    [key: string]: any;
}
export default abstract class RequestData implements IMessage {
    /**
     * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
     *
     * @type {*}
     * @memberof RequestData
     */
    __userData: any;
    /**
     * 是否在接到返回前使用loading类型遮罩覆盖全屏，防止用户操作，默认是true
     *
     * @type {boolean}
     * @memberof RequestData
     */
    __useMask: boolean;
    /**
     * 消息派发内核列表
     *
     * @type {IObservable}
     * @memberof RequestData
     */
    __observables: IObservable[];
    /**
     * 消息当前所属内核
     *
     * @type {IObservable}
     * @memberof RequestData
     */
    readonly __observable: IObservable;
    /**
     * 消息所属的原始内核（第一个派发到的内核）
     *
     * @type {IObservable}
     * @memberof RequestData
     */
    readonly __oriObservable: IObservable;
    /**
     * 请求参数，可以运行时修改
     *
     * @abstract
     * @type {IRequestParams}
     * @memberof RequestData
     */
    abstract __params: IRequestParams;
    /**
     * 消息发送接收策略
     *
     * @abstract
     * @type {IRequestPolicy}
     * @memberof RequestData
     */
    abstract __policy: IRequestPolicy;
    /**
     * 获取请求消息类型字符串
     *
     * @readonly
     * @type {string}
     * @memberof RequestData
     */
    readonly __type: string;
    constructor();
    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     *
     * @memberof RequestData
     */
    redispatch(): void;
}
/** 导出公共消息参数对象 */
export declare var commonData: any;
