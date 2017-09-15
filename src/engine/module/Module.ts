import {core} from "../../core/Core"
import IDispatcher from "../../core/interfaces/IDispatcher"
import IMessage from "../../core/message/IMessage"
import RequestData from "../net/RequestData"
import IModule from "./IModule"
import IModuleConstructor from "./IModuleConstructor"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * 模块基类
*/
export default abstract class Module implements IModule, IDispatcher
{
    /**
     * 列出模块所需CSS资源URL，可以重写
     * 
     * @returns {string[]} CSS资源列表
     * @memberof Module
     */
    public listStyleFiles():string[]
    {
        return null;
    }

    /**
     * 列出模块所需JS资源URL，可以重写
     * 
     * @returns {string[]} js资源列表
     * @memberof Module
     */
    public listJsFiles():string[]
    {
        return null;
    }

    /**
     * 列出模块初始化请求，可以重写
     * 
     * @returns {RequestData[]} 模块的初始化请求列表
     * @memberof Module
     */
    public listInitRequests():RequestData[]
    {
        return null;
    }

    /**
     * 获取模块名称，默认使用类名，可以重写
     * 
     * @returns {string} 模块名称
     * @memberof Module
     */
    public getName():string
    {
        var cls:any = this["constructor"];
        return cls && cls.name;
    }

    /**
     * 打开模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onOpen(data?:any):void
    {
    }

    /**
     * 关闭模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onClose(data?:any):void
    {
    }

    /**
     * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
     * 
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onActivate(from:IModuleConstructor|undefined, data?:any):void
    {
    }

    /**
     * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
     * 
     * @param {IModuleConstructor|undefined} to 要切换到哪个模块
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onDeactivate(to:IModuleConstructor|undefined, data?:any):void
    {
    }
    
    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    public dispatch(type:string, ...params:any[]):void;
    public dispatch(typeOrMsg:any, ...params:any[]):void
    {
        core.dispatch(typeOrMsg, ...params);
    }

    /**
     * 销毁模块，可以重写
     * 
     * @memberof Module
     */
    public dispose():void
    {
    }
}