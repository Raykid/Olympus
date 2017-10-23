import { core } from "../../core/Core";
import IDispatcher from "../../core/interfaces/IDispatcher";
import IMessage from "../../core/message/IMessage";
import { getConstructor } from "../../utils/ConstructUtil";
import IMediator from "./IMediator";
import IBridge from "../bridge/IBridge";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 组件界面中介者基类
*/
export default class Mediator implements IMediator, IDispatcher
{
    /**
     * 表现层桥
     * 
     * @type {IBridge}
     * @memberof Mediator
     */
    public bridge:IBridge;

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
    }

    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        return null;
    }

    private _assetsLoaded:boolean = false;
    private _assetsLoading:boolean = false;
    private _loadAssetsHandlers:((err?:Error)=>void)[] = [];
    public loadAssets():void
    {
        if(this._assetsLoading) return;
        this._assetsLoading = true;
        var self:Mediator = this;
        this.bridge.loadAssets(this, function(err?:Error):void
        {
            // 设置标识符
            self._assetsLoaded = true;
            // 调用onLoadAssets接口
            self.onLoadAssets(err);
            // 通知所有监听者
            for(var i:number = 0, len:number = self._loadAssetsHandlers.length; i < len; i++)
            {
                self._loadAssetsHandlers.shift()(err);
            }
        });
    }

    /**
     * 加载完毕后回调指定方法，如果已经加载完毕则立即回调
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调
     * @memberof Mediator
     */
    public whenLoadAssets(handler:(err?:Error)=>void):void
    {
        if(this._assetsLoaded) handler();
        else this._loadAssetsHandlers.push(handler);
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
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        if(!this._disposed)
        {
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
            // 移除皮肤
            this.skin = null;
            // 设置已被销毁
            this._disposed = true;
        }
    }
}

interface ListenerData
{
    target:any;
    type:string;
    handler:Function;
    thisArg?:any;
}