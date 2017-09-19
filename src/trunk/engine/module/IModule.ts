import IDisposable from "../../core/interfaces/IDisposable";
import IMediator from "../../view/mediator/IMediator";
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
    /** 列出模块所需CSS资源URL */
    listStyleFiles():string[];
    /** 列出模块所需JS资源URL */
    listJsFiles():string[];
    /** 列出模块初始化请求 */
    listInitRequests():RequestData[];
    /** 当获取到所有消息返回后调用 */
    onGetResponses(responses:ResponseData[]):void;
    /** 打开模块时调用 */
    onOpen(data?:any):void;
    /** 关闭模块时调用 */
    onClose(data?:any):void;
    /** 模块切换到前台时调用（open之后或者其他模块被关闭时） */
    onActivate(from:IModuleConstructor|undefined, data?:any):void;
    /** 模块切换到后台是调用（close之后或者其他模块打开时） */
    onDeactivate(to:IModuleConstructor|undefined, data?:any):void;
}