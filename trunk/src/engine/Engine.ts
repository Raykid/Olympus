import { core } from "../core/Core";
import { Injectable } from "../core/injector/Injector";
import * as CookieUtil from "../utils/CookieUtil";
import BridgeManager, { bridgeManager } from "./bridge/BridgeManager";
import BridgeMessage from "./bridge/BridgeMessage";
import PlatformManager from "./platform/PlatformManager"
import System from "./system/System";
import Model from "./model/Model";
import Mediator from "./mediator/Mediator";
import PanelManager from "./panel/PanelManager";
import PanelMediator from "./panel/PanelMediator";
import SceneManager from "./scene/SceneManager";
import SceneMediator from "./scene/SceneMediator";
import ModuleManager, {moduleManager} from "./module/ModuleManager";
import AssetsManager, { assetsManager } from "./assets/AssetsManager";
import AudioManager from "./audio/AudioManager";
import Environment, { environment } from "./env/Environment";
import Explorer from "./env/Explorer";
import WindowExternal from "./env/WindowExternal";
import Hash, { hash, IHashModuleData } from "./env/Hash";
import Query from "./env/Query";
import Shell from "./env/Shell";
import Version, { version } from "./version/Version";
import MaskManager from "./mask/MaskManager";
import NetManager, { netManager } from "./net/NetManager";
import { HTTPRequestPolicy } from "./net/policies/HTTPRequestPolicy";
import { IResponseDataConstructor } from "./net/ResponseData";
import BindManager from "./bind/BindManager";
import ModuleMessage from "./module/ModuleMessage";
import IBridge from "./bridge/IBridge";
import IPlugin from "./plugin/IPlugin";
import * as Injector from "./injector/Injector";
import EngineMessage from "./message/EngineMessage";
import IMediatorConstructor from "./mediator/IMediatorConstructor";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
@Injectable
export default class Engine
{
    private _initParams:IInitParams;
    private _loadElement:Element;

    /**
     * 初始化Engine
     * 
     * @param {IInitParams} params 初始化参数
     * @memberof Engine
     */
    public initialize(params:IInitParams):void
    {
        var self:Engine = this;
        // 调用进度回调，初始化为0%
        params.onInitProgress && params.onInitProgress(0, InitStep.ReadyToInit);
        // 执行初始化
        if(document.readyState == "loading") document.addEventListener("readystatechange", doInitialize);
        else doInitialize();

        function doInitialize():void
        {
            // 调用进度回调，开始初始化为10%
            params.onInitProgress && params.onInitProgress(0.1, InitStep.StartInit);
            // 移除事件
            if(this == document) document.removeEventListener("readystatechange", doInitialize);
            // 要判断document是否初始化完毕
            self._initParams = params;
            // 加载页
            self._loadElement = (typeof params.loadElement == "string" ? document.querySelector(params.loadElement) : params.loadElement);
            // 监听错误事件
            if(params.onError) self.listenError(params.onError);
            // 初始化环境参数
            environment.initialize(params.env, params.hostsDict, params.cdnsDict);
            // 初始化版本号工具
            version.initialize(()=>{
                // 调用进度回调，版本号初始化完毕为20%
                params.onInitProgress && params.onInitProgress(0.2, InitStep.VersionInited);
                // 监听Bridge初始化完毕事件，显示第一个模块
                core.listen(BridgeMessage.BRIDGE_ALL_INIT, self.onAllBridgesInit, self);
                // 注册并初始化表现层桥实例
                bridgeManager.registerBridge(...params.bridges);
            }, params.version);
        }
    }

    /**
     * 添加错误监听函数
     * 
     * @param {(evt?:ErrorEvent)=>void} handler 错误监听函数
     * @memberof Engine
     */
    public listenError(handler:(evt?:ErrorEvent)=>void):void
    {
        if(handler) window.addEventListener("error", handler);
    }

    private onAllBridgesInit():void
    {
        // 调用进度回调，表现层桥初始化完毕为30%
        this._initParams.onInitProgress && this._initParams.onInitProgress(0.3, InitStep.BridgesInited);
        // 注销监听
        core.unlisten(BridgeMessage.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
        // 初始化插件
        if(this._initParams.plugins)
        {
            for(var plugin of this._initParams.plugins)
            {
                plugin.initPlugin();
            }
        }
        // 注册短名称
        assetsManager.configPath(this._initParams.pathDict);
        // 开始预加载过程
        var preloads:string[] = this._initParams.preloads;
        if(preloads)
        {
            // 去加载
            var curIndex:number = 0;
            var totalCount:number = preloads.length;
            assetsManager.loadAssets(preloads, this.onPreloadOK.bind(this), null, (key:string, value:any)=>{
                curIndex ++;
                // 调用进度回调，每个预加载文件平分30%-90%的进度
                var progress:number = 0.3 + 0.6 * curIndex / totalCount;
                // 保留2位小数
                progress = Math.round(progress * 100) * 0.01;
                this._initParams.onInitProgress && this._initParams.onInitProgress(progress, InitStep.Preload, key, value);
            });
        }
        else
        {
            // 没有预加载，直接完成
            this.onPreloadOK();
        }
    }

    private onPreloadOK():void
    {
        // 调用进度回调，打开首个模块为90%
        this._initParams.onInitProgress && this._initParams.onInitProgress(0.9, InitStep.OpenFirstModule);
        // 派发事件
        core.dispatch(EngineMessage.INITIALIZED);
        // 调用初始化完成回调
        this._initParams.onInited && this._initParams.onInited();
        // 监听首个模块开启
        core.listen(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 打开首个模块
        moduleManager.open(this._initParams.firstModule, hash.firstModuleParams);
        // 如果有哈希模块则打开之
        for(var i in hash.moduleDatas)
        {
            var data:IHashModuleData = hash.moduleDatas[i];
            // 如果模块没有名字则不进行操作
            if(data.name)
                moduleManager.open(data.name, data.params, data.direct);
        }
    }

    private onModuleChange(from:IMediatorConstructor):void
    {
        // 调用进度回调，全部过程完毕，100%
        this._initParams.onInitProgress && this._initParams.onInitProgress(1, InitStep.Inited);
        // 注销监听
        core.unlisten(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 移除loadElement显示
        if(this._loadElement)
        {
            var parent:Element = this._loadElement.parentElement;
            parent && parent.removeChild(this._loadElement);
        }
    }
}
/** 再额外导出一个单例 */
export const engine:Engine = core.getInject(Engine);

export enum InitStep
{
    /** 框架已准备好初始化 */
    ReadyToInit,
    /** 开始执行初始化 */
    StartInit,
    /** 版本号系统初始化完毕 */
    VersionInited,
    /** 表现层桥初始化完毕 */
    BridgesInited,
    /** 预加载，可能会触发多次，每次传递两个参数：预加载文件名或路径、预加载文件内容 */
    Preload,
    /** 开始打开首个模块 */
    OpenFirstModule,
    /** 首个模块打开完毕，初始化流程完毕 */
    Inited
}

export interface IInitParams
{
    /**
     * 表现层桥数组，所有可能用到的表现层桥都要在此实例化并传入
     * 
     * @type {IBridge[]}
     * @memberof OlympusInitParams
     */
    bridges:IBridge[];
    /**
     * 首模块类型，框架初始化完毕后进入的模块
     * 
     * @type {IMediatorConstructor}
     * @memberof OlympusInitParams
     */
    firstModule:IMediatorConstructor;
    /**
     * 会在首个模块被显示出来后从页面中移除
     * 
     * @type {(Element|string)}
     * @memberof OlympusInitParams
     */
    loadElement?:Element|string;
    /**
     * 环境字符串，默认为"dev"
     * 
     * @type {string}
     * @memberof IInitParams
     */
    env?:string;
    /**
     * 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     * 
     * @type {string}
     * @memberof IInitParams
     */
    version?:string;
    /**
     * 消息域名字典数组，首个字典会被当做默认字典，没传递则会用当前域名代替
     * 
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    hostsDict?:{[env:string]:string[]};
    /**
     * CDN域名列表，若没有提供则使用host代替
     * 
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    cdnsDict?:{[env:string]:string[]};
    /**
     * 插件列表
     * 
     * @type {IPlugin[]}
     * @memberof IInitParams
     */
    plugins?:IPlugin[];
    /**
     * 短名称路径字典，key是短名称，value是路径
     * 
     * @type {{[key:string]:string}}
     * @memberof IInitParams
     */
    pathDict?:{[key:string]:string},
    /**
     * 预加载数组或字典，如果是字典则key为短名称，value为资源路径
     * 会在表现层桥初始化完毕后、框架初始化完毕前加载，加载结果会保存在AssetsManager中
     * 
     * @type {string[]}
     * @memberof IInitParams
     */
    preloads?:string[];
    /**
     * 初始化进度变化时调用，第一个参数为进度数值，范围是[0, 1]；第二个参数是所在步骤枚举值；第三个参数是步骤提供的参数列表
     * 
     * @memberof IInitParams
     */
    onInitProgress?:(progress?:number, step?:InitStep, ...args:any[])=>void;
    /**
     * 框架初始化完毕时调用
     * 
     * @type {()=>void}
     * @memberof IInitParams
     */
    onInited?:()=>void;
    /**
     * 项目出现报错时调用，提供Error对象和ErrorEvent对象
     * 
     * @memberof IInitParams
     */
    onError?:(evt?:ErrorEvent)=>void;
}