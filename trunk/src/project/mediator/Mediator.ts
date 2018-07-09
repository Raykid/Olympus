import Component from '../../kernel/Component';
import ComponentStatus from '../../kernel/enums/ComponentStatus';
import IComponentConstructor from '../../kernel/interfaces/IComponentConstructor';
import ComponentMessageType from '../../kernel/messages/ComponentMessageType';
import { unique } from "../../utils/ArrayUtil";
import { getConstructor } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { assetsManager } from "../assets/AssetsManager";
import { bridgeManager } from '../bridge/BridgeManager';
import IBridgeExt from '../bridge/IBridgeExt';
import ICommandConstructor from '../core/command/ICommandConstructor';
import { core } from '../core/Core';
import IObservableExt from '../core/observable/IObservableExt';
import ObservableExt from '../core/observable/ObservableExt';
import { maskManager } from "../mask/MaskManager";
import { netManager } from "../net/NetManager";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "./IMediator";
import { ModuleOpenStatus } from "./IMediatorModulePart";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 组件界面中介者基类
*/

/** 规定ModuleManager支持的模块参数类型 */
export type ModuleType = IComponentConstructor | IMediator;

var moduleDict:{[name:string]:IComponentConstructor} = {};
var moduleNameDict:Dictionary<IComponentConstructor, string> = new Dictionary();

/**
 * 注册模块
 * 
 * @export
 * @param {string} moduleName 模块名
 * @param {IComponentConstructor} cls 模块类型
 */
export function registerModule(moduleName:string, cls:IComponentConstructor):void
{
    moduleDict[moduleName] = cls;
    moduleNameDict.set(cls, moduleName);
}

/**
 * 获取模块类型
 * 
 * @export
 * @param {string} moduleName 模块名
 * @returns {IComponentConstructor} 
 */
export function getModule(moduleName:string):IComponentConstructor
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
    var cls:IComponentConstructor = <IComponentConstructor>getConstructor(type instanceof Function ? type : <IComponentConstructor>type.constructor);
    return moduleNameDict.get(cls);
}

export default class Mediator extends Component implements IMediator
{
    /********************* 重写部分接口实现 *********************/
    public bridge:IBridgeExt;

    protected _children:IMediator[];
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
        for(var child of <IMediator[]>this._children)
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
        for(var child of <IMediator[]>this._children)
        {
            child.responses = value;
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
        super(skin);
        // 赋值模块名称
        this._moduleName = getModuleName(this);
        // 自动判断皮肤类型以赋值桥
        if(skin)
            this.bridge = <IBridgeExt>bridgeManager.getBridgeBySkin(skin);
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
        var children:IMediator[] = <IMediator[]>this._children.concat();
        var temp:(err?:Error)=>void = (err?:Error)=>{
            if(err || children.length <= 0)
            {
                // 调用onLoadAssets接口
                this.onLoadAssets(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的资源
                var child:IMediator = children.shift();
                child.loadAssets(temp);
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
        var children:IMediator[] = this._children.concat();
        var temp:(err?:Error)=>void = (err?:Error)=>{
            if(err || children.length <= 0)
            {
                // 调用onLoadStyleFiles接口
                this.onLoadStyleFiles(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的资源
                var child:IMediator = children.shift();
                child.loadStyleFiles(temp);
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
        var children:IMediator[] = this._children.concat();
        var temp:(results:string[]|Error)=>void = (err?:Error)=>{
            if(err || children.length <= 0)
            {
                // 调用onLoadJsFiles接口
                this.onLoadJsFiles(err);
                // 调用回调
                handler(err);
            }
            else
            {
                // 加载一个子中介者的js
                var child:IMediator = children.shift();
                child.loadJsFiles(temp);
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
        var children:IMediator[] = this._children.concat();
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
                if(children.length <= 0)
                {
                    // 调用onSendInitRequests接口
                    this.onSendInitRequests();
                    // 调用回调
                    handler();
                }
                else
                {
                    // 发送一个子中介者的初始化消息
                    var child:IMediator = children.shift();
                    child.sendInitRequests(temp);
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
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    public open(data?:any):any
    {
        // 判断状态
        if(this._status === ComponentStatus.UNOPEN)
        {
            // 修改状态
            this._status = ComponentStatus.OPENING;
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
                                            this.__beforeOnOpen(data);
                                            // 调用自身onOpen方法
                                            var result:any = this.onOpen(data);
                                            if(result !== undefined)
                                                this.data = data = result;
                                            // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
                                            if(!this._viewModel) this.viewModel = {};
                                            // 记录子中介者数量，并监听其开启完毕事件
                                            var subCount:number = this._children.length;
                                            if(subCount > 0)
                                            {
                                                // 调用所有已托管中介者的open方法
                                                for(var child of this._children)
                                                {
                                                    child.open(data);
                                                }
                                            }
                                            // 修改状态
                                            this._status = ComponentStatus.OPENED;
                                            // 调用模板方法
                                            this.__afterOnOpen(data);
                                            // 调用回调
                                            this.moduleOpenHandler && this.moduleOpenHandler(ModuleOpenStatus.AfterOpen);
                                            // 派发事件
                                            this.dispatch(ComponentMessageType.COMPONENT_OPENED, this);
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
        for(var child of this._children)
        {
            child.onWakeUp(from, data);
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
        for(var child of this._children)
        {
            child.onActivate(from, data);
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
        for(var child of this._children)
        {
            child.onDeactivate(to, data);
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

    /*********************** 下面是命令功能实现 ***********************/

    protected _observable:IObservableExt = new ObservableExt(core);

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
}