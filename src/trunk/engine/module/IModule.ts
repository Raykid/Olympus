import IDisposable from "../../core/interfaces/IDisposable";
import IMediator from "../mediator/IMediator";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IModuleConstructor from "./IModuleConstructor";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 业务模块接口
*/
export default interface IModule extends IDisposable
{
    /** 模块打开时的参数 */
    data:any;
    /** 模块初始消息的返回数据 */
    responses:ResponseData[];
    /** 获取所有已托管的中介者 */
    readonly delegatedMediators:IMediator[];
    /** 列出模块所需CSS资源URL */
    listStyleFiles():string[];
    /** 列出模块所需JS资源URL */
    listJsFiles():string[];
    /** 列出模块初始化请求 */
    listInitRequests():RequestData[];
    /** 将中介者托管给模块 */
    delegateMediator(mediator:IMediator):void;
    /** 反托管中介者 */
    undelegateMediator(mediator:IMediator):void;
    /** 判断指定中介者是否包含在该模块里 */
    constainsMediator(mediator:IMediator):boolean;
    /** 当模块资源加载完毕后调用 */
    onLoadAssets(err?:Error):void;
    /** 打开模块时调用 */
    onOpen(data?:any):void;
    /** 关闭模块时调用 */
    onClose(data?:any):void;
    /** 模块切换到前台时调用（open之后或者其他模块被关闭时） */
    onActivate(from:IModuleConstructor|undefined, data?:any):void;
    /** 模块切换到后台是调用（close之后或者其他模块打开时） */
    onDeactivate(to:IModuleConstructor|undefined, data?:any):void;
}