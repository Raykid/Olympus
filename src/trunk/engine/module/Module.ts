import { core } from "../../core/Core";
import IDispatcher from "../../core/interfaces/IDispatcher";
import IMessage from "../../core/message/IMessage";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "../mediator/IMediator";
import IModule from "./IModule";
import IModuleConstructor from "./IModuleConstructor";
import Dictionary from "../../utils/Dictionary";
import { moduleManager } from "./ModuleManager";
import { getConstructor } from "../../utils/ConstructUtil";

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
    private _disposed:boolean = false;
    /**
     * 获取是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Module
     */
    public get disposed():boolean
    {
        return this._disposed;
    }

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

    private _mediators:IMediator[] = [];

    private _disposeDict:Dictionary<IMediator, ()=>void> = new Dictionary();
    private disposeMediator(mediator:IMediator):void
    {
        // 取消托管
        this.undelegateMediator(mediator);
        // 调用原始销毁方法
        mediator.dispose();
        // 如果所有已托管的中介者都已经被销毁，则销毁当前模块
        if(this._mediators.length <= 0) this.dispose();
    };
    /**
     * 托管中介者
     * 
     * @param {IMediator} mediator 中介者
     * @memberof Module
     */
    public delegateMediator(mediator:IMediator):void
    {
        if(this._mediators.indexOf(mediator) < 0)
        {
            // 托管新的中介者
            this._mediators.push(mediator);
            // 篡改dispose方法，以监听其dispose
            if(mediator.hasOwnProperty("dispose"))
                this._disposeDict.set(mediator, mediator.dispose);
            mediator.dispose = this.disposeMediator.bind(this, mediator);
        }
    }

    /**
     * 取消托管中介者
     * 
     * @param {IMediator} mediator 中介者
     * @memberof Module
     */
    public undelegateMediator(mediator:IMediator):void
    {
        var index:number = this._mediators.indexOf(mediator);
        if(index >= 0)
        {
            // 取消托管中介者
            this._mediators.splice(index, 1);
            // 恢复dispose方法，取消监听dispose
            var oriDispose:()=>void = this._disposeDict.get(mediator);
            if(oriDispose) mediator.dispose = oriDispose;
            else delete mediator.dispose;
            this._disposeDict.delete(mediator);
        }
    }

    /**
     * 获取所有已托管的中介者
     * 
     * @returns {IMediator[]} 已托管的中介者
     * @memberof Module
     */
    public getDelegatedMediators():IMediator[]
    {
        return this._mediators;
    }

    /**
     * 当模块资源加载完毕后调用
     * 
     * @param {Error} [err] 任何一个Mediator资源加载出错会给出该错误对象，没错则不给
     * @memberof Module
     */
    public onLoadAssets(err?:Error):void
    {
    }

    /**
     * 当获取到所有消息返回（如果有的话）后调用，建议使用@Handler处理消息返回，可以重写
     * 
     * @param {ResponseData[]} responses 收到的所有返回体（如果请求有返回的话）
     * @memberof Module
     */
    public onGetResponses(responses:ResponseData[]):void
    {
    }

    /**
     * 打开模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onOpen(data?:any):void
    {
        // 调用所有已托管中介者的open方法
        for(var mediator of this._mediators)
        {
            mediator.open(data);
        }
    }

    /**
     * 关闭模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onClose(data?:any):void
    {
        // 调用所有已托管中介者的close方法
        for(var mediator of this._mediators)
        {
            mediator.close(data);
        }
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
        // 关闭自身
        var cls:IModuleConstructor = <IModuleConstructor>getConstructor(<IModuleConstructor>this.constructor);
        moduleManager.close(cls);
        // 如果没关上则不销毁
        if(moduleManager.isOpened(cls)) return;
        // 将所有已托管的中介者销毁
        for(var i:number = 0, len:number = this._mediators.length; i < len; i++)
        {
            var mediator:IMediator = this._mediators.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 记录
        this._disposed = true;
    }
}