import RequestData from "./RequestData";
import ResponseData, { IResponseDataConstructor } from "./ResponseData";
import IObservable from "../../core/observable/IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 *
 * 网络管理器
*/
export interface ResponseHandler {
    (response: ResponseData | Error, request?: RequestData): void;
}
export default class NetManager {
    constructor();
    private onMsgDispatched(msg);
    private _responseDict;
    /**
     * 注册一个返回结构体
     *
     * @param {string} type 返回类型
     * @param {IResponseDataConstructor} cls 返回结构体构造器
     * @memberof NetManager
     */
    registerResponse(cls: IResponseDataConstructor): void;
    private _responseListeners;
    /**
     * 添加一个通讯返回监听
     *
     * @param {(IResponseDataConstructor|string)} clsOrType 要监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    listenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean, observable?: IObservable): void;
    /**
     * 移除一个通讯返回监听
     *
     * @param {(IResponseDataConstructor|string)} clsOrType 要移除监听的返回结构构造器或者类型字符串
     * @param {ResponseHandler} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    unlistenResponse(clsOrType: IResponseDataConstructor | string, handler: ResponseHandler, thisArg?: any, once?: boolean, observable?: IObservable): void;
    /**
     * 发送多条请求，并且等待返回结果（如果有的话），调用回调
     *
     * @param {RequestData[]} [requests 要发送的请求列表
     * @param {(responses?:ResponseData[]|Error)=>void} [handler] 收到返回结果或错误后的回调函数
     * @param {*} [thisArg] this指向
     * @param {IObservable} [observable] 要发送到的内核
     * @memberof NetManager
     */
    sendMultiRequests(requests?: RequestData[], handler?: (responses?: ResponseData[] | Error) => void, thisArg?: any, observable?: IObservable): void;
    /** 这里导出不希望用户使用的方法，供框架内使用 */
    __onResponse(type: string, result: any, request?: RequestData): void | never;
    __onError(type: string, err: Error, request?: RequestData): void;
    private recurseResponse(type, response, request, observable);
}
/** 再额外导出一个单例 */
export declare const netManager: NetManager;
