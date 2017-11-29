import { core } from "../../core/Core";
import IMessage from "../../core/message/IMessage";
import { getConstructor } from "../../utils/ConstructUtil";
import IModuleMediator from "./IModuleMediator";
import IBridge from "../bridge/IBridge";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";
import { mutate } from "../bind/Mutator";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import { bindManager } from "../bind/BindManager";
import IObservable from "../../core/observable/IObservable";
import ResponseData from "../net/ResponseData";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 组件界面中介者基类
*/
export default class Mediator implements IModuleMediator
{
    /**
     * 表现层桥
     * 
     * @type {IBridge}
     * @memberof Mediator
     */
    public bridge:IBridge;
    
    private _viewModel:any;
    /**
     * 获取或设置ViewModel
     * 
     * @type {*}
     * @memberof Mediator
     */
    public get viewModel():any
    {
        return this._viewModel;
    }
    public set viewModel(value:any)
    {
        // 设置的时候进行一次变异
        this._viewModel = mutate(value);
        // 更新绑定
        bindManager.bind(this);
    }

    /**
     * 皮肤
     * 
     * @type {*}
     * @memberof Mediator
     */
    public skin:any;
    
    private _disposed:boolean = false;
    /**
     * 获取中介者是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    public get disposed():boolean
    {
        return this._disposed;
    }
    
    private _dependModuleInstance:IModule;
    /**
     * 所属的模块引用，需要配合@DelegateMediator使用
     * 
     * @readonly
     * @type {IModule}
     * @memberof IMediator
     */
    public get dependModuleInstance():IModule
    {
        return this._dependModuleInstance;
    }
    
    private _dependModule:IModuleConstructor;
    /**
     * 所属的模块类型，需要配合@DelegateMediator使用
     * 
     * @readonly
     * @type {IModuleConstructor}
     * @memberof IMediator
     */
    public get dependModule():IModuleConstructor
    {
        return this._dependModule;
    }

    /**
     * 便捷获取被托管到的模块的初始化消息数组
     * 
     * @type {ResponseData[]}
     * @memberof IModuleMediator
     */
    public get initResponses():ResponseData[]
    {
        return (this._dependModuleInstance ? this._dependModuleInstance.responses : []);
    }

    private _data:any;

    /**
     * 打开时传递的data对象
     * 
     * @readonly
     * @type {*}
     * @memberof Mediator
     */
    public get data():any
    {
        return this._data;
    }

    public constructor(skin?:any)
    {
        if(skin) this.skin = skin;
        // 初始化绑定
        bindManager.bind(this);
    }

    /**
     * 列出中介者所需的资源数组，可重写
     * 但如果Mediator没有被托管在Module中则该方法不应该被重写，否则可能会有问题
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        return null;
    }

    /**
     * 加载从listAssets中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @returns {void} 
     * @memberof Mediator
     */
    public loadAssets(handler:(err?:Error)=>void):void
    {
        var self:Mediator = this;
        this.bridge.loadAssets(this.listAssets(), this, function(err?:Error):void
        {
            // 调用onLoadAssets接口
            self.onLoadAssets(err);
            // 调用回调
            handler(err);
        });
    }

    /**
     * 当所需资源加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    public onLoadAssets(err?:Error):void
    {
    }

    /**
     * 打开，为了实现IOpenClose接口
     * 
     * @param {*} [data] 
     * @returns {*} 
     * @memberof Mediator
     */
    public open(data?:any):any
    {
        this._data = data;
        this.onOpen(data);
        // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
        if(!this._viewModel) this.viewModel = {};
        return this;
    }

    /**
     * 关闭，为了实现IOpenClose接口
     * 
     * @param {*} [data] 
     * @returns {*} 
     * @memberof Mediator
     */
    public close(data?:any):any
    {
        this.onClose(data);
        this.dispose();
        return this;
    }
    
    /**
     * 当打开时调用
     * 
     * @param {*} [data] 可能的打开参数
     * @memberof Mediator
     */
    public onOpen(data?:any):void
    {
        // 可重写
    }

    /**
     * 当关闭时调用
     * 
     * @param {*} [data] 可能的关闭参数
     * @memberof Mediator
     */
    public onClose(data?:any):void
    {
        // 可重写
    }

    private _listeners:ListenerData[] = [];
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Mediator
     */
    public mapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners[i];
            if(data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg)
            {
                // 已经存在一样的监听，不再监听
                return;
            }
        }
        // 记录监听
        this._listeners.push({target: target, type: type, handler: handler, thisArg: thisArg});
        // 调用桥接口
        this.bridge.mapListener(target, type, handler, thisArg);
    }
    
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Mediator
     */
    public unmapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners[i];
            if(data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg)
            {
                // 调用桥接口
                this.bridge.unmapListener(target, type, handler, thisArg);
                // 移除记录
                this._listeners.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 注销所有注册在当前中介者上的事件监听
     * 
     * @memberof Mediator
     */
    public unmapAllListeners():void
    {
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners.pop();
            // 调用桥接口
            this.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
        }
    }

    /*********************** 下面是模块消息系统 ***********************/

    /**
     * 暴露IObservable
     * 
     * @readonly
     * @type {IObservable}
     * @memberof Mediator
     */
    public get observable():IObservable
    {
        return (this._dependModuleInstance || core).observable;
    }
    
    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof IModuleObservable
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof IModuleObservable
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(...params:any[]):void
    {
        var observable:IObservable = this.observable;
        observable.dispatch.apply(observable, params);
    }

    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this.observable.listen(type, handler, thisArg);
    }

    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this.observable.unlisten(type, handler,thisArg);
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IModuleObservable
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        this.observable.mapCommand(type, cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof IModuleObservable
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        this.observable.unmapCommand(type, cmd);
    }

    /**
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        if(this._disposed) return;
        // 移除显示
        if(this.skin && this.bridge)
        {
            var parent:any = this.bridge.getParent(this.skin);
            if(parent) this.bridge.removeChild(parent, this.skin);
        }
        // 注销事件监听
        this.unmapAllListeners();
        // 移除表现层桥
        this.bridge = null;
        // 移除绑定
        bindManager.unbind(this);
        // 移除ViewModel
        this._viewModel = null;
        // 移除皮肤
        this.skin = null;
        // 设置已被销毁
        this._disposed = true;
    }
}

interface ListenerData
{
    target:any;
    type:string;
    handler:Function;
    thisArg?:any;
}