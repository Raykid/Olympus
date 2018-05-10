import { core } from "../../core/Core";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import IMessage from "../../core/message/IMessage";
import IObservable from "../../core/observable/IObservable";
import Observable from "../../core/observable/Observable";
import { unique } from "../../utils/ArrayUtil";
import { getConstructor } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { assetsManager } from "../assets/AssetsManager";
import { bindManager } from "../bind/BindManager";
import { mutate } from "../bind/Mutator";
import { bridgeManager } from '../bridge/BridgeManager';
import IBridge from "../bridge/IBridge";
import { maskManager } from "../mask/MaskManager";
import { netManager } from "../net/NetManager";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import { system } from "../system/System";
import IMediator from "./IMediator";
import IMediatorConstructor from "./IMediatorConstructor";
import { ModuleOpenStatus } from "./IMediatorModulePart";
import MediatorMessage from "./MediatorMessage";
import MediatorStatus from "./MediatorStatus";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 组件界面中介者基类
*/

/** 规定ModuleManager支持的模块参数类型 */
export type ModuleType = IMediatorConstructor | IMediator;

var moduleDict:{[name:string]:IMediatorConstructor} = {};
var moduleNameDict:Dictionary<IMediatorConstructor, string> = new Dictionary();

/**
 * 注册模块
 * 
 * @export
 * @param {string} moduleName 模块名
 * @param {IMediatorConstructor} cls 模块类型
 */
export function registerModule(moduleName:string, cls:IMediatorConstructor):void
{
    moduleDict[moduleName] = cls;
    moduleNameDict.set(cls, moduleName);
}

/**
 * 获取模块类型
 * 
 * @export
 * @param {string} moduleName 模块名
 * @returns {IMediatorConstructor} 
 */
export function getModule(moduleName:string):IMediatorConstructor
{
    return moduleDict[moduleName];
}

/**
 * 获取模块名
 * 
 * @export
 * @param {ModuleType} type 模块实例或模块类型
 * @returns {string} 模块名
 */
export function getModuleName(type:ModuleType):string
{
    var cls:IMediatorConstructor = <IMediatorConstructor>getConstructor(type instanceof Function ? type : <IMediatorConstructor>type.constructor);
    return moduleNameDict.get(cls);
}

export default class Mediator implements IMediator
{
    private _status:MediatorStatus = MediatorStatus.UNOPEN;
    /**
     * 获取中介者状态
     * 
     * @readonly
     * @type {MediatorStatus}
     * @memberof Mediator
     */
    public get status():MediatorStatus
    {
        return this._status;
    }

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

    private oriSkin:any;
    
    /**
     * 获取中介者是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    public get disposed():boolean
    {
        return (this._status === MediatorStatus.DISPOSED);
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

    private _openMask:boolean = true;
    /**
     * 开启时是否触发全屏遮罩，防止用户操作，设置操作会影响所有子孙中介者。默认是true
     * 
     * @type {boolean}
     * @memberof Mediator
     */
    public get openMask():boolean
    {
        return this._openMask;
    }
    public set openMask(value:boolean)
    {
        this._openMask = value;
        // 递归设置所有子中介者的openMask
        for(var child of this._children)
        {
            child.openMask = value;
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

    private _moduleName:string;
    /**
     * 获取模块名
     * 
     * @readonly
     * @type {string}
     * @memberof Mediator
     */
    public get moduleName():string
    {
        return this._moduleName;
    }

    /**
     * 模块打开结果回调函数，由moduleManager调用，不要手动调用
     * 
     * @memberof Mediator
     */
    public moduleOpenHandler:(status:ModuleOpenStatus, err?:Error)=>void;

    public constructor(skin?:any)
    {
        // 赋值模块名称
        this._moduleName = getModuleName(this);
        // 赋值皮肤
        if(skin)
        {
            this.skin = skin;
            // 赋值桥
            this.bridge = bridgeManager.getBridgeBySkin(skin);
        }
        this.oriSkin = skin;
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
        var mediators:IMediator[] = this._children.concat();
        var temp:(err?:Error)=>void = (err?:Error)=>{
            if(err || mediators.length <= 0)
            {
                // 调用onLoadAssets接口
                this.onLoadAssets(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的资源
                var mediator:IMediator = mediators.shift();
                mediator.loadAssets(temp);
            }
        };
        // 加载自身资源
        let assets:string[] = this.listAssets();
        if(assets && assets.length > 0)
        {
            // 去重
            assets = unique(assets);
            // 开始加载
            this.bridge.loadAssets(assets, this, temp);
        }
        else
        {
            // 没有资源，直接调用回调
            handler();
        }
    }
    
    /**
     * 加载从listStyleFiles中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    public loadStyleFiles(handler:(err?:Error)=>void):void
    {
        var mediators:IMediator[] = this._children.concat();
        var temp:(err?:Error)=>void = (err?:Error)=>{
            if(err || mediators.length <= 0)
            {
                // 调用onLoadStyleFiles接口
                this.onLoadStyleFiles(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的资源
                var mediator:IMediator = mediators.shift();
                mediator.loadStyleFiles(temp);
            }
        };
        // 开始加载css文件
        var cssFiles:string[] = this.listStyleFiles();
        // 去重
        cssFiles = unique(cssFiles);
        // 加载
        assetsManager.loadStyleFiles(cssFiles, temp);
    }
    
    /**
     * 加载从listJsFiles中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    public loadJsFiles(handler:(err?:Error)=>void):void
    {
        var mediators:IMediator[] = this._children.concat();
        var temp:(results:string[]|Error)=>void = (err?:Error)=>{
            if(err || mediators.length <= 0)
            {
                // 调用onLoadJsFiles接口
                this.onLoadJsFiles(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的js
                var mediator:IMediator = mediators.shift();
                mediator.loadJsFiles(temp);
            }
        };
        // 开始加载js文件
        var jsFiles:string[] = this.listJsFiles();
        // 去重
        jsFiles = unique(jsFiles);
        // 加载
        assetsManager.loadJsFiles(jsFiles, temp);
    }
    
    /**
     * 发送从listInitRequests中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    public sendInitRequests(handler:(err?:Error)=>void):void
    {
        var mediators:IMediator[] = this._children.concat();
        var temp:(responses:ResponseData[]|Error)=>void = (responses:ResponseData[]|Error)=>{
            if(responses instanceof Error)
            {
                var err:Error = responses instanceof Error ? responses : undefined;
                // 调用onSendInitRequests接口
                this.onSendInitRequests(err);
                // 调用回调
                handler(err);
            }
            else
            {
                if(isMine)
                {
                    isMine = false;
                    // 赋值返回值
                    this.responses = responses;
                    // 调用回调
                    var stop:boolean = this.onGetResponses(responses);
                    if(stop)
                    {
                        var err:Error = new Error("用户中止打开模块操作")
                        // 调用onSendInitRequests接口
                        this.onSendInitRequests(err);
                        // 调用回调
                        handler(err);
                        return;
                    }
                }
                if(mediators.length <= 0)
                {
                    // 调用onSendInitRequests接口
                    this.onSendInitRequests();
                    // 调用回调
                    handler();
                }
                else
                {
                    // 发送一个子中介者的初始化消息
                    var mediator:IMediator = mediators.shift();
                    mediator.sendInitRequests(temp);
                }
            }
        };
        // 发送所有模块消息，模块消息默认发送全局内核
        var isMine:boolean = true;
        netManager.sendMultiRequests(this.listInitRequests(), temp, this, this.observable);
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
     * 当所需CSS加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    public onLoadStyleFiles(err?:Error):void
    {
    }
    
    /**
     * 当所需js加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    public onLoadJsFiles(err?:Error):void
    {
    }
    
    /**
     * 当所需资源加载完毕后调用
     * 
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    public onSendInitRequests(err?:Error):void
    {
    }

    /**
     * 当获取到所有初始化请求返回时调用，可以通过返回一个true来阻止模块的打开
     * 
     * @param {ResponseData[]} responses 返回结构数组
     * @returns {boolean} 返回true则表示停止模块打开
     * @memberof Mediator
     */
    public onGetResponses(responses:ResponseData[]):boolean
    {
        return false;
    }

    /**
     * 打开，为了实现IOpenClose接口
     * 
     * @param {*} [data] 开启数据
     * @param {...any[]} args 其他数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    public open(data?:any, ...args:any[]):any
    {
        // 判断状态
        if(this._status === MediatorStatus.UNOPEN)
        {
            // 修改状态
            this._status = MediatorStatus.OPENING;
            // 赋值参数
            this.data = data;
            // 记一个是否需要遮罩的flag
            var maskFlag:boolean = this.openMask;
            // 发送初始化消息
            this.sendInitRequests((err?:Error)=>{
                if(err)
                {
                    // 移除遮罩
                    hideMask();
                    // 调用回调
                    this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                }
                else
                {
                    // 加载所有已托管中介者的资源
                    this.loadAssets((err?:Error)=>{
                        if(err)
                        {
                            // 移除遮罩
                            hideMask();
                            // 调用回调
                            this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                        }
                        else
                        {
                            // 加载css文件
                            this.loadStyleFiles((err?:Error)=>{
                                if(err)
                                {
                                    // 移除遮罩
                                    hideMask();
                                    // 调用回调
                                    this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                }
                                else
                                {
                                    // 加载js文件
                                    this.loadJsFiles((err?:Error)=>{
                                        // 移除遮罩
                                        hideMask();
                                        // 判断错误
                                        if(err)
                                        {
                                            // 调用回调
                                            this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.Stop, err);
                                        }
                                        else
                                        {
                                            // 要先开启自身，再开启子中介者
                                            // 调用回调
                                            this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.BeforeOpen);
                                            // 调用模板方法
                                            this.__beforeOnOpen(data, ...args);
                                            // 调用自身onOpen方法
                                            var result:any = this.onOpen(data, ...args);
                                            if(result !== undefined)
                                                this.data = data = result;
                                            // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
                                            if(!this._viewModel) this.viewModel = {};
                                            // 记录子中介者数量，并监听其开启完毕事件
                                            var subCount:number = this._children.length;
                                            if(subCount > 0)
                                            {
                                                // 调用所有已托管中介者的open方法
                                                for(var mediator of this._children)
                                                {
                                                    mediator.open(data);
                                                }
                                            }
                                            // 修改状态
                                            this._status = MediatorStatus.OPENED;
                                            // 调用模板方法
                                            this.__afterOnOpen(data, ...args);
                                            // 调用回调
                                            this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.AfterOpen);
                                            // 派发事件
                                            this.dispatch(MediatorMessage.MEDIATOR_OPENED, this);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            // 显示Loading
            if(maskFlag)
            {
                maskManager.showLoading(null, "mediatorOpen");
                maskFlag = false;
            }
        }
        // 返回自身引用
        return this;

        function hideMask():void
        {
            // 隐藏Loading
            if(!maskFlag) maskManager.hideLoading("mediatorOpen");
            maskFlag = false;
        }
    }

    protected __beforeOnOpen(data?:any, ...args:any[]):void
    {
        // 给子类用的模板方法
    }

    protected __afterOnOpen(data?:any, ...args:any[]):void
    {
        // 给子类用的模板方法
    }

    /**
     * 关闭，为了实现IOpenClose接口
     * 
     * @param {*} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    public close(data?:any, ...args:any[]):any
    {
        if(this._status === MediatorStatus.OPENED)
        {
            var doClose:()=>void = ()=>{
                // 调用模板方法
                this.__beforeOnClose(data, ...args);
                // 修改状态
                this._status = MediatorStatus.CLOSING;
                // 调用自身onClose方法
                this.onClose(data, ...args);
                // 修改状态
                this._status = MediatorStatus.CLOSED;
                // 调用模板方法
                this.__afterOnClose(data, ...args);
            };
            var subCount:number = this._children.length;
            if(subCount > 0)
            {
                var handler:(mediator:IMediator)=>void = (mediator:IMediator)=>{
                    if(this._children.indexOf(mediator) >= 0 && --subCount === 0)
                    {
                        // 取消监听
                        this.unlisten(MediatorMessage.MEDIATOR_CLOSED, handler);
                        // 执行关闭
                        doClose();
                    }
                };
                this.listen(MediatorMessage.MEDIATOR_CLOSED, handler);
                // 调用所有已托管中介者的close方法
                for(var mediator of this._children.concat())
                {
                    mediator.close(data);
                }
            }
            else
            {
                // 没有子中介者，直接执行
                doClose();
            }
        }
        // 返回自身引用
        return this;
    }

    protected __beforeOnClose(data?:any, ...args:any[]):void
    {
        // 给子类用的模板方法
    }

    protected __afterOnClose(data?:any, ...args:any[]):void
    {
        // 派发关闭事件
        this.dispatch(MediatorMessage.MEDIATOR_CLOSED, this);
        // 给子类用的模板方法
        this.dispose();
    }
    
    /**
     * 当打开时调用
     * 
     * @param {*} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    public onOpen(data?:any, ...args:any[]):any
    {
        // 可重写
    }

    /**
     * 当关闭时调用
     * 
     * @param {*} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof Mediator
     */
    public onClose(data?:any, ...args:any[]):void
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

    /**
     * 获取根级中介者（当做模块直接被打开的中介者）
     * 
     * @type {IMediator}
     * @memberof IMediator
     */
    public get root():IMediator
    {
        return (this.parent ? this.parent.root : this);
    }

    protected _children:IMediator[] = [];
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
     * 判断指定中介者是否包含在该中介者里（判断范围包括当前中介者和子孙级中介者）
     * 
     * @param {IMediator} mediator 要判断的中介者
     * @returns {boolean} 
     * @memberof Mediator
     */
    public containsMediator(mediator:IMediator):boolean
    {
        // 首先判断自身
        if(mediator === this) return true;
        // 判断子中介者
        var contains:boolean = false;
        for(var child of this._children)
        {
            if(child.containsMediator(mediator))
            {
                contains = true;
                break;
            }
        }
        return contains;
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
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        return null;
    }
    
    /**
     * 列出所需CSS资源URL，可重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listStyleFiles():string[]
    {
        return null;
    }

    /**
     * 列出所需JS资源URL，可重写
     * 
     * @returns {string[]} 
     * @memberof Mediator
     */
    public listJsFiles():string[]
    {
        return null;
    }

    /**
     * 列出模块初始化请求，可重写
     * 
     * @returns {RequestData[]} 
     * @memberof Mediator
     */
    public listInitRequests():RequestData[]
    {
        return null;
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
        // 判断状态
        if(this.status >= MediatorStatus.DISPOSING) return;
        // 修改状态
        this._status = MediatorStatus.DISPOSING;
        // 移除绑定
        bindManager.unbind(this);
        // 注销事件监听
        this.unmapAllListeners();
        // 调用模板方法
        this.onDispose();
        // 移除显示，只移除没有原始皮肤的，因为如果有原始皮肤，其原始parent可能不希望子节点被移除
        if(!this.oriSkin)
        {
            if(this.skin && this.bridge)
            {
                var parent:any = this.bridge.getParent(this.skin);
                if(parent) this.bridge.removeChild(parent, this.skin);
            }
        }
        // 移除表现层桥
        this.bridge = null;
        // 移除ViewModel
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除皮肤
        this.skin = null;
        this.oriSkin = null;
        // 将所有子中介者销毁
        for(var i:number = 0, len:number = this._children.length; i < len; i++)
        {
            var mediator:IMediator = this._children.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 将observable的销毁拖延到下一帧，因为虽然执行了销毁，但有可能这之后还会使用observable发送消息
        system.nextFrame(()=>{
            // 移除observable
            this._observable.dispose();
            this._observable = null;
            // 修改状态
            this._status = MediatorStatus.DISPOSED;
        });
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