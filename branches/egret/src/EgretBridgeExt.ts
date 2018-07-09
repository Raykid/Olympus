/// <amd-module name="EgretBridgeExt"/>

import IBridgeExt from 'olympus-r/project/bridge/IBridgeExt';
import { core } from "olympus-r/project/core/Core";
import { environment } from 'olympus-r/project/env/Environment';
import { IMaskEntity } from 'olympus-r/project/mask/MaskManager';
import IMediator from 'olympus-r/project/mediator/IMediator';
import ModuleMessageType from "olympus-r/project/module/ModuleMessageType";
import IPanelPolicy from 'olympus-r/project/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/project/panel/IPromptPanel';
import IScenePolicy from 'olympus-r/project/scene/IScenePolicy';
import SceneMessageType from "olympus-r/project/scene/SceneMessageType";
import { version } from 'olympus-r/project/version/Version';
import { load } from 'olympus-r/utils/HTTPUtil';
import { wrapAbsolutePath } from 'olympus-r/utils/URLUtil';
import AssetsLoader, { IResourceDict } from "./egret/AssetsLoader";
import UpdateScreenSizeCommand from "./egret/command/UpdateScreenSizeCommand";
import MaskEntity, { MaskData } from "./egret/mask/MaskEntity";
import BackPanelPolicy from "./egret/panel/BackPanelPolicy";
import FadeScenePolicy from "./egret/scene/FadeScenePolicy";
import { wrapSkin } from "./egret/utils/SkinUtil";
import EgretBridge, { IInitParams } from './EgretBridge';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
export default class EgretBridgeExt extends EgretBridge implements IBridgeExt
{
    /** 提供静态类型常量 */
    public static TYPE:string = "Egret";

    protected _initParams:IInitParamsExt;

    private _stage:egret.Stage;
    /**
     * 获取舞台引用
     * 
     * @readonly
     * @type {egret.Stage}
     * @memberof EgretBridge
     */
    public get stage():egret.Stage
    {
        return this._stage;
    }
    
    private _bgLayer:egret.DisplayObjectContainer;
    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get bgLayer():egret.DisplayObjectContainer
    {
        return this._bgLayer;
    }

    private _sceneLayer:egret.DisplayObjectContainer;
    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get sceneLayer():egret.DisplayObjectContainer
    {
        return this._sceneLayer;
    }
    
    private _frameLayer:egret.DisplayObjectContainer;
    /**
     * 获取框架容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get frameLayer():egret.DisplayObjectContainer
    {
        return this._frameLayer;
    }

    private _panelLayer:egret.DisplayObjectContainer;
    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get panelLayer():egret.DisplayObjectContainer
    {
        return this._panelLayer;
    }

    private _maskLayer:egret.DisplayObjectContainer;
    /**
     * 获取遮罩容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get maskLayer():egret.DisplayObjectContainer
    {
        return this._maskLayer;
    }

    private _topLayer:egret.DisplayObjectContainer;
    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get topLayer():egret.DisplayObjectContainer
    {
        return this._topLayer;
    }
    
    /**
     * 获取通用提示框
     * 
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof EgretBridge
     */
    public get promptClass():IPromptPanelConstructor
    {
        return this._initParams.promptClass;
    }
    
    /**
     * 获取遮罩实体
     * 
     * @readonly
     * @type {IMaskEntity}
     * @memberof EgretBridge
     */
    public get maskEntity():IMaskEntity
    {
        return new MaskEntity(this._initParams.maskData) as IMaskEntity;
    }

    /**
     * 默认弹窗策略
     * 
     * @type {IPanelPolicy}
     * @memberof EgretBridge
     */
    public defaultPanelPolicy:IPanelPolicy = new BackPanelPolicy();

    /**
     * 默认场景切换策略
     * 
     * @type {IScenePolicy}
     * @memberof EgretBridge
     */
    public defaultScenePolicy:IScenePolicy = new FadeScenePolicy();
    
    public constructor(params:IInitParamsExt)
    {
        super(params);
    }
    
    protected onRootInitialized(root:eui.UILayer, complete:(bridge:IBridgeExt)=>void):void
    {
        this._root = root;
        this._stage = root.stage;
        // 创建背景显示层
        this._bgLayer = new eui.UILayer();
        this._bgLayer.touchEnabled = false;
        root.addChild(this._bgLayer);
        // 创建场景显示层
        this._sceneLayer = new eui.UILayer();
        this._sceneLayer.touchEnabled = false;
        root.addChild(this._sceneLayer);
        // 创建框架显示层
        this._frameLayer = new eui.UILayer();
        this._frameLayer.touchEnabled = false;
        root.addChild(this._frameLayer);
        // 创建弹出层
        this._panelLayer = new eui.UILayer();
        this._panelLayer.touchEnabled = false;
        root.addChild(this._panelLayer);
        // 创建遮罩层
        this._maskLayer = new eui.UILayer();
        this._maskLayer.touchEnabled = false;
        root.addChild(this._maskLayer);
        // 创建顶级显示层
        this._topLayer = new eui.UILayer();
        this._topLayer.touchEnabled = false;
        root.addChild(this._topLayer);
        // 插入更新屏幕命令
        core.mapCommand(SceneMessageType.SCENE_BEFORE_CHANGE, UpdateScreenSizeCommand);
        // 设置资源和主题适配器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter(this._initParams));
        // 加载资源配置
        doLoad.call(this);

        function doLoad():void
        {
            load({
                url: version.wrapHashUrl(this._initParams.pathPrefix + "resource/default.res.json"),
                useCDN: true,
                responseType: "text",
                onResponse: (content:string)=>{
                    var data:any = JSON.parse(content);
                    RES.parseConfig(data, this._initParams.pathPrefix + "resource/");
                    // 加载主题配置
                    var url:string = wrapAbsolutePath(this._initParams.pathPrefix + "resource/default.thm.json", environment.curCDNHost);
                    var theme:eui.Theme = new eui.Theme(url, this._root.stage);
                    theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);
                },
                onError: err=>{
                    alert(err.message + "\nPlease try again later.");
                    doLoad.call(this);
                }
            });
        }

        function onThemeLoadComplete(evt:eui.UIEvent):void
        {
            evt.target.removeEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);
            // 加载预加载资源组
            var preloadGroups:string[] = this._initParams.preloadGroups;
            this.loadAssets(preloadGroups, null, err=>complete(this));
        }
    }
    
    /**
     * 包装HTMLElement节点
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof EgretBridge
     */
    public wrapSkin(mediator:IMediator, skin:any):egret.DisplayObject
    {
        return wrapSkin(mediator, skin);
    }
    
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof EgretBridge
     */
    public replaceSkin(mediator:IMediator, current:egret.DisplayObject, target:any):any
    {
        // Egret皮肤需要判断类型，进行不同处理
        if(current instanceof eui.Component)
        {
            if(target instanceof eui.Component)
            {
                // 两边都是eui组件，直接将右手皮肤赋值给左手
                current.skinName = target.skin;
            }
            else if(target instanceof egret.DisplayObject)
            {
                // 右手是普通显示对象，移除左手皮肤，添加右手显示到其中
                current.skinName = null;
                current.addChild(target);
            }
            else
            {
                // 其他情况都认为右手是皮肤数据
                current.skinName = target;
            }
            // 返回左手
            return current;
        }
        else
        {
            if(!(target instanceof egret.DisplayObject))
            {
                // 右手不是显示对象，认为是皮肤数据，生成一个eui.Component包裹它
                var temp:eui.Component = new eui.Component();
                temp.skinName = target;
                target = temp;
            }
            // 右手替换左手位置
            var parent:egret.DisplayObjectContainer = current.parent;
            parent.addChildAt(target, parent.getChildIndex(current));
            parent.removeChild(current);
            // 返回右手
            return target;
        }
    }

    /**
     * 加载资源
     * 
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof EgretBridge
     */
    public loadAssets(assets:string[], mediator:IMediator, handler:(err?:Error)=>void):void
    {
        var loader:AssetsLoader = new AssetsLoader({
            oneError: (evt:RES.ResourceEvent)=>{
                // 调用回调
                handler(new Error("资源加载失败"));
                // 派发加载错误事件
                core.dispatch(ModuleMessageType.MODULE_LOAD_ASSETS_ERROR, evt);
            },
            complete: (dict:IResourceDict)=>{
                // 调用回调
                handler();
            }
        });
        loader.loadGroups(assets);
    }
}

export interface IInitParamsExt extends IInitParams
{
    /** 通用提示框类型 */
    promptClass?:IPromptPanelConstructor;
    /** 遮罩数据 */
    maskData?:MaskData;
}

class AssetAdapter implements eui.IAssetAdapter
{
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    public getAsset(source:string, compFunc:Function, thisObject:any):void
    {
        if(RES.hasRes(source))
        {
            var data:any = RES.getRes(source);
            if(data) onGetRes(data);
            else RES.getResAsync(source, onGetRes, this);
        }
        else
        {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
        
        function onGetRes(data:any):void
        {
            compFunc.call(thisObject, data, source);
        }
    }
}

class ThemeAdapter implements eui.IThemeAdapter
{
    private _initParams:IInitParams;

    public constructor(initParams:IInitParams)
    {
        this._initParams = initParams;
    }

    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void
    {
        load({
            url: version.wrapHashUrl(url),
            useCDN: true,
            responseType: "text",
            onResponse: (result:string)=>{
                try
                {
                    // 需要为所有主题资源添加路径前缀
                    var data:any = JSON.parse(result);
                    for(var key in data.skins)
                        data.skins[key] = this._initParams.pathPrefix + data.skins[key];
                    for(var key in data.exmls)
                    {
                        // 如果只是URL则直接添加前缀，否则是内容集成方式，需要单独修改path属性
                        var exml:any = data.exmls[key];
                        if(typeof exml == "string")
                            data.exmls[key] = this._initParams.pathPrefix + exml;
                        else
                            exml.path = this._initParams.pathPrefix + exml.path;
                    }
                    result = JSON.stringify(data);
                }
                catch(err){}
                compFunc.call(thisObject, result);
            },
            onError: ()=>{
                errorFunc.call(thisObject);
            }
        })
    }
}