import IDisposable from "../../core/interfaces/IDisposable"
import RequestData from "../net/RequestData"

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
    /** 列出模块儿所需CSS资源URL */
    listStyleFiles():string[];
    /** 列出模块儿所需JS资源URL */
    listJsFiles():string[];
    /** 列出模块儿初始化请求 */
    listInitRequests():RequestData[];
    /** 获取模块儿名称 */
    getName():string;
    /** 打开模块儿时调用 */
    open(data?:any):void;
    /** 关闭模块儿时调用 */
    close(data?:any):void;
    /** 模块儿切换到前台时调用（open之后或者其他模块儿被关闭时） */
    onActivate(from:IModule, data?:any):void;
    /** 模块儿掐环岛后台是调用（close之后或者其他模块儿打开时 */
    onDeactivate(to:IModule, data?:any):void;
}