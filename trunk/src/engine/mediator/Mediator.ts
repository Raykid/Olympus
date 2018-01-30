import { core } from "../../core/Core";
import IMessage from "../../core/message/IMessage";
import IBridge from "../bridge/IBridge";
import { mutate } from "../bind/Mutator";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import IObservable from "../../core/observable/IObservable";
import Dictionary from "../../utils/Dictionary";
import { bindManager } from "../bind/BindManager";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "./IMediator";
import Observable from "../../core/observable/Observable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 组件界面中介者基类
*/
export default class Mediator implements IMediator
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
     * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
     * 
     * @type {Dictionary<any, any>[]}
     * @memberof Mediator
     */
    public bindTargets:Dictionary<any, any>[] = [];

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
    
    private _data:any;

    /**
     * 打开时传递的data对象
     * 
     * @type {*}
     * @memberof Mediator
     */
    public get data():any
    {
        return this._data;
    }
    public set data(value:any)
    {
        this._data = value;
        // 递归设置子中介者的data
        for(var mediator of this._children)
        {
            mediator.data = value;
        }
    }

    private _responses:ResponseData[];
    /**
     * 模块初始消息的返回数据
     * 
     * @type {ResponseData[]}
     * @memberof Mediator
     */
    public get responses():ResponseData[]
    {
        return this._responses;
    }
    public set responses(value:ResponseData[])
    {
        this._responses = value;
        // 递归设置子中介者的data
        for(var mediator of this._children)
        {
            mediator.responses = value;
        }
    }

    public constructor(skin?:any)
    {
        if(skin) this.skin = skin;
        // 初始化绑定
        bindManager.bind(this);
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
        this.bridge.loadAssets(this.listAssets(), this, (err?:Error)=>{
            // 调用onLoadAssets接口
            this.onLoadAssets(err);
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
        this.data = data;
        // 调用自身onOpen方法
        this.onOpen(data);
        // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
        if(!this._viewModel) this.viewModel = {};
        // 调用所有已托管中介者的open方法
        for(var mediator of this._children)
        {
            mediator.open(data);
        }
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
        // 调用所有已托管中介者的close方法
        for(var mediator of this._children.concat())
        {
            mediator.close(data);
        }
        // 调用自身onClose方法
        this.onClose(data);
        // 销毁自身
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
    
    private _disposeDict:Dictionary<IMediator, ()=>void> = new Dictionary();
    
    private disposeChild(mediator:IMediator, oriDispose:()=>void):void
    {
        // 调用原始销毁方法
        oriDispose.call(mediator);
        // 取消托管
        this.undelegateMediator(mediator);
    };

    /**
     * 父中介者
     * 
     * @type {IMediator}
     * @memberof Mediator
     */
    public parent:IMediator = null;

    private _children:IMediator[] = [];
    /**
     * 获取所有子中介者
     * 
     * @type {IMediator[]}
     * @memberof Mediator
     */
    public get children():IMediator[]
    {
        return this._children;
    }

    /**
     * 托管子中介者
     * 
     * @param {IMediator} mediator 要托管的中介者
     * @memberof Mediator
     */
    public delegateMediator(mediator:IMediator):void
    {
        if(this._children.indexOf(mediator) < 0)
        {
            // 托管新的中介者
            this._children.push(mediator);
            // 设置关系
            mediator.parent = this;
            // 设置observable关系
            mediator.observable.parent = this._observable;
            // 篡改dispose方法，以监听其dispose
            if(mediator.hasOwnProperty("dispose"))
                this._disposeDict.set(mediator, mediator.dispose);
            mediator.dispose = this.disposeChild.bind(this, mediator, mediator.dispose);
        }
    }

    /**
     * 取消托管子中介者
     * 
     * @param {IMediator} mediator 要取消托管的中介者
     * @memberof Mediator
     */
    public undelegateMediator(mediator:IMediator):void
    {
        var index:number = this._children.indexOf(mediator);
        if(index >= 0)
        {
            // 取消托管中介者
            this._children.splice(index, 1);
            // 移除关系
            mediator.parent = null;
            // 移除observable关系
            if(mediator.observable) mediator.observable.parent = null;
            // 恢复dispose方法，取消监听dispose
            var oriDispose:()=>void = this._disposeDict.get(mediator);
            if(oriDispose) mediator.dispose = oriDispose;
            else delete mediator.dispose;
            this._disposeDict.delete(mediator);
        }
    }
    
    /**
     * 判断指定中介者是否包含在该中介者里
     * 
     * @param {IMediator} mediator 要判断的中介者
     * @returns {boolean} 
     * @memberof Mediator
     */
    public constainsMediator(mediator:IMediator):boolean
    {
        return (this._children.indexOf(mediator) >= 0);
    }
    
    /**
     * 其他模块被关闭回到当前模块时调用
     * 
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public wakeUp(from:IMediator|undefined, data?:any):void
    {
        // 调用自身方法
        this.onWakeUp(from, data);
        // 递归调用子中介者方法
        for(var mediator of this._children)
        {
            mediator.onWakeUp(from, data);
        }
    }

    /**
     * 模块切换到前台时调用（与wakeUp的区别是open时activate会触发，但wakeUp不会）
     * 
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public activate(from:IMediator|undefined, data?:any):void
    {
        // 调用自身方法
        this.onActivate(from, data);
        // 递归调用子中介者方法
        for(var mediator of this._children)
        {
            mediator.onActivate(from, data);
        }
    }

    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     * 
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public deactivate(to:IMediator|undefined, data?:any):void
    {
        // 调用自身方法
        this.onDeactivate(to, data);
        // 递归调用子中介者方法
        for(var mediator of this._children)
        {
            mediator.onDeactivate(to, data);
        }
    }

    /**
     * 列出中介者所需的资源数组，不要手动调用或重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        // 获取自身所需资源
        var assets:string[] = this.onListAssets() || [];
        // 获取所有子中介者所需资源
        for(var mediator of this._children)
        {
            assets.push.apply(assets, mediator.listAssets());
        }
        return assets;
    }

    /**
     * 列出模块初始化请求，不要手动调用或重写
     * 
     * @returns {RequestData[]} 
     * @memberof Mediator
     */
    public listInitRequests():RequestData[]
    {
        // 获取自身初始化请求
        var requests:RequestData[] = this.onListInitRequests() || [];
        // 获取所有子中介者所需资源
        for(var mediator of this._children)
        {
            requests.push.apply(requests, mediator.listInitRequests());
        }
        return requests;
    }
    
    /**
     * 列出所需CSS资源URL，不要手动调用或重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listStyleFiles():string[]
    {
        // 获取自身URL
        var files:string[] = this.onListStyleFiles() || [];
        // 获取所有子中介者所需资源
        for(var mediator of this._children)
        {
            files.push.apply(files, mediator.listStyleFiles());
        }
        return files;
    }

    /**
     * 列出所需JS资源URL，不要手动调用或重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listJsFiles():string[]
    {
        // 获取自身URL
        var files:string[] = this.onListJsFiles() || [];
        // 获取所有子中介者所需资源
        for(var mediator of this._children)
        {
            files.push.apply(files, mediator.listJsFiles());
        }
        return files;
    }
    
    /**
     * 其他模块被关闭回到当前模块时调用
     * 
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public onWakeUp(from:IMediator|undefined, data?:any):void
    {
        // 可重写
    }

    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     * 
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public onActivate(from:IMediator|undefined, data?:any):void
    {
        // 可重写
    }

    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     * 
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    public onDeactivate(to:IMediator|undefined, data?:any):void
    {
        // 可重写
    }

    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    public onListAssets():string[]
    {
        return null;
    }

    /**
     * 列出模块初始化请求，可重写
     * 
     * @returns {RequestData[]} 
     * @memberof Mediator
     */
    public onListInitRequests():RequestData[]
    {
        return null;
    }

    /**
     * 列出所需CSS资源URL，可重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public onListStyleFiles():string[]
    {
        return null;
    }

    /**
     * 列出所需JS资源URL，可重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public onListJsFiles():string[]
    {
        return null;
    }

    /*********************** 下面是模块消息系统 ***********************/

    private _observable:IObservable = new Observable(core);
    /**
     * 暴露IObservable
     * 
     * @readonly
     * @type {IObservable}
     * @memberof Mediator
     */
    public get observable():IObservable
    {
        return this._observable;
    }
    
    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Mediator
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Mediator
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(...params:any[]):void
    {
        this._observable.dispatch.apply(this._observable, params);
    }

    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        this._observable.listen(type, handler, thisArg, once);
    }

    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        this._observable.unlisten(type, handler, thisArg, once);
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Mediator
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        this._observable.mapCommand(type, cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof Mediator
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        this._observable.unmapCommand(type, cmd);
    }

    /**
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        if(this._disposed) return;
        // 移除绑定
        bindManager.unbind(this);
        // 注销事件监听
        this.unmapAllListeners();
        // 调用模板方法
        this.onDispose();
        // 移除显示
        if(this.skin && this.bridge)
        {
            var parent:any = this.bridge.getParent(this.skin);
            if(parent) this.bridge.removeChild(parent, this.skin);
        }
        // 移除表现层桥
        this.bridge = null;
        // 移除ViewModel
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除皮肤
        this.skin = null;
        // 将所有子中介者销毁
        for(var i:number = 0, len:number = this._children.length; i < len; i++)
        {
            var mediator:IMediator = this._children.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 移除observable
        this._observable.dispose();
        this._observable = null;
        // 设置已被销毁
        this._disposed = true;
    }

    /**
     * 当销毁时调用
     * 
     * @memberof Mediator
     */
    public onDispose():void
    {
        // 可重写
    }
}

interface ListenerData
{
    target:any;
    type:string;
    handler:Function;
    thisArg?:any;
}