/// <amd-module name="EgretBridge"/>

import { core } from "olympus-r/core/Core";
import IBridge from "olympus-r/engine/bridge/IBridge";
import { environment } from "olympus-r/engine/env/Environment";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IMediator from "olympus-r/engine/mediator/IMediator";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import { IPromptPanelConstructor } from "olympus-r/engine/panel/IPromptPanel";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import SceneMessage from "olympus-r/engine/scene/SceneMessage";
import { version } from 'olympus-r/engine/version/Version';
import { load } from "olympus-r/utils/HTTPUtil";
import { wrapAbsolutePath } from "olympus-r/utils/URLUtil";
import AssetsLoader, { IResourceDict } from "./egret/AssetsLoader";
import UpdateScreenSizeCommand from "./egret/command/UpdateScreenSizeCommand";
import MaskEntity, { MaskData } from "./egret/mask/MaskEntity";
import BackPanelPolicy from "./egret/panel/BackPanelPolicy";
import RenderMode from "./egret/RenderMode";
import FadeScenePolicy from "./egret/scene/FadeScenePolicy";
import { wrapSkin } from "./egret/utils/SkinUtil";
import { wrapEUIList } from "./egret/utils/UIUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
export default class EgretBridge implements IBridge
{
    /** 提供静态类型常量 */
    public static TYPE:string = "Egret";

    private _initParams:IInitParams;

    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof EgretBridge
     */
    public get type():string
    {
        return EgretBridge.TYPE;
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof EgretBridge
     */
    public get htmlWrapper():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    private _root:egret.DisplayObjectContainer;
    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    public get root():egret.DisplayObjectContainer
    {
        return this._root;
    }

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
    
    public constructor(params:IInitParams)
    {
        this._initParams = params;
    }
    
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof EgretBridge
     */
    public init(complete:(bridge:IBridge)=>void):void
    {
        // 生成html和body的样式节点
        var style:HTMLStyleElement = document.createElement("style");
        style.textContent = `
            html, body {
                -ms-touch-action: none;
                background: ${egret.toColorString(this._initParams.backgroundColor || 0)};
                padding: 0;
                border: 0;
                margin: 0;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
        // 统一容器
        if(typeof this._initParams.container == "string")
        {
            this._initParams.container = <HTMLElement>document.querySelector(this._initParams.container);
        }
        if(!this._initParams.container)
        {
            this._initParams.container = document.createElement("div");
            document.body.appendChild(this._initParams.container);
        }
        var container:HTMLElement = this._initParams.container;
        // 构建容器参数
        container.style.margin = "auto";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.position = "fixed";
        container.style.top = "0%";
        container.style.left = "0%";
        container.className = "egret-player";
        container.setAttribute("data-entry-class", "__EgretRoot__");
        container.setAttribute("data-orientation", "auto");
        container.setAttribute("data-scale-mode", this._initParams.scaleMode || egret.StageScaleMode.FIXED_NARROW);
        container.setAttribute("data-frame-rate", (this._initParams.frameRate || 60) + "");
        container.setAttribute("data-content-width", this._initParams.width + "");
        container.setAttribute("data-content-height", this._initParams.height + "");
        container.setAttribute("data-show-paint-rect", (this._initParams.showPaintRect || false) + "");
        container.setAttribute("data-multi-fingered", (this._initParams.multiFingered || 2) + "");
        container.setAttribute("data-show-fps", (this._initParams.showFPS || false) + "");
        container.setAttribute("data-show-fps-style", this._initParams.showFPSStyle || "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9");
        container.setAttribute("data-show-log", (this._initParams.showLog || false) + "");
        // 构建__EgretRoot__类，使得Egret引擎可以通过window寻址的方式找到该类，同时又可以让其将控制权转交给Application
        var self:EgretBridge = this;
        window["__EgretRoot__"] = function():void
        {
            eui.UILayer.call(this);
            this.touchEnabled = false;
        };
        window["__EgretRoot__"].prototype = new eui.UILayer();
        window["__EgretRoot__"].prototype.$onAddToStage = function(stage:egret.Stage, nestLevel:number):void
        {
            // 调用父类方法
            eui.UILayer.prototype.$onAddToStage.call(this, stage, nestLevel);
            // 移除引用
            delete window["__EgretRoot__"];
            // 将控制权移交给Application对象
            onRootInitialized(this);
        }
        // 根据渲染模式初始化Egret引擎
        switch(this._initParams.renderMode)
        {
            case RenderMode.WEBGL:
                initEgret("webgl");
                break;
            case RenderMode.CANVAS:
            default:
                initEgret("canvas");
                break;
        }
        
        function initEgret(renderMode:string):void
        {
            if(window["eui"])
            {
                // 篡改eui.DataGroup.commitProperties和getVirtualElementAt方法，为renderer添加一个标签以修复列表首项渲染多次的bug
                var oriCommitProperties:Function = eui.DataGroup.prototype["commitProperties"];
                eui.DataGroup.prototype["commitProperties"] = function():any
                {
                    this.__egret_datagroup_state__ = 1;
                    var result:any = oriCommitProperties.apply(this, arguments);
                    return result;
                };
                var oriGetVirtualElementAt:Function = eui.DataGroup.prototype["getVirtualElementAt"];
                eui.DataGroup.prototype["getVirtualElementAt"] = function():any
                {
                    this.__egret_datagroup_state__ = 2;
                    var result:any = oriGetVirtualElementAt.apply(this, arguments);
                    return result;
                };
                // 篡改eui.registerBindable方法，把__bindables__赋值变为不可遍历的属性
                var oriRegisterBindable:Function = eui.registerBindable;
                eui.registerBindable = function(instance:any, property:string):any
                {
                    var result:any = oriRegisterBindable.call(this, instance, property);
                    // 改变可遍历性
                    var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(instance, "__bindables__");
                    if(desc && desc.enumerable)
                    {
                        desc.enumerable = false;
                        Object.defineProperty(instance, "__bindables__", desc);
                    }
                    // 返回结果
                    return result;
                };
                // 篡改Watcher.checkBindable方法，把__listeners__赋值变为不可遍历
                eui.Watcher["checkBindable"] = function(host:any, property:string):any
                {
                    // 改变可遍历性
                    var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(host, "__listeners__");
                    if(desc && desc.enumerable)
                    {
                        desc.enumerable = false;
                        Object.defineProperty(host, "__listeners__", desc);
                    }
                }
            }
            // 启动Egret引擎
            egret.runEgret({
                renderMode: renderMode,
                audioType: 0
            });
        }

        function onRootInitialized(root:eui.UILayer):void
        {
            self._root = root;
            self._stage = root.stage;
            // 创建背景显示层
            self._bgLayer = new eui.UILayer();
            self._bgLayer.touchEnabled = false;
            root.addChild(self._bgLayer);
            // 创建场景显示层
            self._sceneLayer = new eui.UILayer();
            self._sceneLayer.touchEnabled = false;
            root.addChild(self._sceneLayer);
            // 创建框架显示层
            self._frameLayer = new eui.UILayer();
            self._frameLayer.touchEnabled = false;
            root.addChild(self._frameLayer);
            // 创建弹出层
            self._panelLayer = new eui.UILayer();
            self._panelLayer.touchEnabled = false;
            root.addChild(self._panelLayer);
            // 创建遮罩层
            self._maskLayer = new eui.UILayer();
            self._maskLayer.touchEnabled = false;
            root.addChild(self._maskLayer);
            // 创建顶级显示层
            self._topLayer = new eui.UILayer();
            self._topLayer.touchEnabled = false;
            root.addChild(self._topLayer);
            // 插入更新屏幕命令
            core.mapCommand(SceneMessage.SCENE_BEFORE_CHANGE, UpdateScreenSizeCommand);
            // 设置资源和主题适配器
            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter(self._initParams));
            // 加载资源配置
            doLoad();

            function doLoad():void
            {
                load({
                    url: version.wrapHashUrl(self._initParams.pathPrefix + "resource/default.res.json"),
                    useCDN: true,
                    responseType: "text",
                    onResponse: (content:string)=>{
                        var data:any = JSON.parse(content);
                        RES.parseConfig(data, self._initParams.pathPrefix + "resource/");
                        // 加载主题配置
                        var url:string = wrapAbsolutePath(self._initParams.pathPrefix + "resource/default.thm.json", environment.curCDNHost);
                        var theme:eui.Theme = new eui.Theme(url, self._root.stage);
                        theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
                    },
                    onError: err=>{
                        alert(err.message + "\nPlease try again later.");
                        doLoad();
                    }
                });
            }
        }

        function onThemeLoadComplete(evt:eui.UIEvent):void
        {
            evt.target.removeEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, self);
            // 加载预加载资源组
            var preloadGroups:string[] = this._initParams.preloadGroups;
            self.loadAssets(preloadGroups, null, err=>complete(self));
        }
    }
    
    /**
     * 判断皮肤是否是Egret显示对象
     * 
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof EgretBridge
     */
    public isMySkin(skin:any):boolean
    {
        if(skin instanceof egret.DisplayObject)
            return true;
        if(skin instanceof Function)
            return (skin.prototype instanceof egret.DisplayObject);
        if(typeof skin === "string")
            return (egret.getDefinitionByName(skin) != null);
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
     * 同步皮肤，用于组件变身后的重新定位
     * 
     * @param {egret.DisplayObject} current 当前皮肤
     * @param {egret.DisplayObject} target 替换的皮肤
     * @memberof EgretBridge
     */
    public syncSkin(current:egret.DisplayObject, target:egret.DisplayObject):void
    {
        if(!current || !target) return;
        // 设置属性
        // 下面是egret级别属性
        var props:string[] = [
            "matrix", "anchorOffsetX", "anchorOffsetY", "alpha", "visible"
        ];
        // 如果当前宽高不为0则同样设置宽高
        if(current.width > 0) props.push("width");
        if(current.height > 0) props.push("height");
        // 下面是eui级别属性
        if(current instanceof eui.Component && target instanceof eui.Component)
        {
            props.push.apply(props, [
                "horizontalCenter", "verticalCenter", "left", "right", "top", "bottom"
            ]);
        }
        // 全部赋值
        for(var prop of props)
        {
            target[prop] = current[prop];
        }
    }
    
    /**
     * 创建一个空的显示对象
     *
     * @returns {egret.Sprite}
     * @memberof EgretBridge
     */
    public createEmptyDisplay():egret.Sprite
    {
        return new egret.Sprite();
    }
    
    /**
     * 添加显示
     * 
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    public addChild(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):egret.DisplayObject
    {
        if(parent && target)
            return parent.addChild(target);
        else
            return target;
    }

    /**
     * 按索引添加显示
     * 
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    public addChildAt(parent:egret.DisplayObjectContainer, target:egret.DisplayObject, index:number):egret.DisplayObject
    {
        if(parent && target)
            return parent.addChildAt(target, index);
        else
            return target;
    }
    
    /**
     * 移除显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 被移除的显示对象
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    public removeChild(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):egret.DisplayObject
    {
        if(parent && target && target.parent === parent)
            return parent.removeChild(target);
        else
            return target;
    }

    /**
     * 按索引移除显示
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    public removeChildAt(parent:egret.DisplayObjectContainer, index:number):egret.DisplayObject
    {
        if(parent && index >= 0)
            return parent.removeChildAt(index);
        else
            return null;
    }
    
    /**
     * 移除所有显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @memberof EgretBridge
     */
    public removeChildren(parent:egret.DisplayObjectContainer):void
    {
        if(parent) parent.removeChildren();
    }

    /**
     * 获取父容器
     * 
     * @param {egret.DisplayObject} target 目标对象
     * @returns {egret.DisplayObjectContainer} 父容器
     * @memberof EgretBridge
     */
    public getParent(target:egret.DisplayObject):egret.DisplayObjectContainer
    {
        return target.parent;
    }
    
    /**
     * 获取指定索引处的显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {egret.DisplayObject} 索引处的显示对象
     * @memberof EgretBridge
     */
    public getChildAt(parent:egret.DisplayObjectContainer, index:number):egret.DisplayObject
    {
        return parent.getChildAt(index);
    }

    /**
     * 获取显示索引
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof EgretBridge
     */
    public getChildIndex(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):number
    {
        return parent.getChildIndex(target);
    }
    
    /**
     * 通过名称获取显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {egret.DisplayObject} 显示对象
     * @memberof EgretBridge
     */
    public getChildByName(parent:egret.DisplayObjectContainer, name:string):egret.DisplayObject
    {
        return parent.getChildByName(name);
    }
    
    /**
     * 获取子显示对象数量
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof EgretBridge
     */
    public getChildCount(parent:egret.DisplayObjectContainer):number
    {
        return parent.numChildren;
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
                core.dispatch(ModuleMessage.MODULE_LOAD_ASSETS_ERROR, evt);
            },
            complete: (dict:IResourceDict)=>{
                // 调用回调
                handler();
            }
        });
        loader.loadGroups(assets);
    }
    
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    public mapListener(target:egret.EventDispatcher, type:string, handler:Function, thisArg?:any):void
    {
        target.addEventListener(type, handler, thisArg);
    }
    
    /**
     * 注销监听事件
     * 
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    public unmapListener(target:egret.EventDispatcher, type:string, handler:Function, thisArg?:any):void
    {
        target.removeEventListener(type, handler, thisArg);
    }

    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     * 
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:eui.IItemRenderer)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    public wrapBindFor(target:eui.DataGroup, rendererHandler:(key?:any, value?:any, renderer?:eui.IItemRenderer)=>void):any
    {
        var memento:any = {};
        wrapEUIList(target, (data:any, renderer:eui.IItemRenderer)=>{
            // 取出key
            var key:any;
            var datas:any = memento.datas;
            // 遍历memento的datas属性（在valuateBindFor时被赋值）
            if(datas instanceof Array)
            {
                key = renderer.itemIndex;
            }
            else
            {
                for(var i in datas)
                {
                    if(datas[i] === data)
                    {
                        // 这就是我们要找的key
                        key = i;
                        break;
                    }
                }
            }
            // 调用回调
            if (key != null)
            {
                if(memento.syncDict)
                {
                    if(!memento.syncDict[key])
                    {
                        if(target["__egret_datagroup_state__"] === 1 || target["__egret_datagroup_state__"] === 2)
                        {
                            memento.syncDict[key] = data;
                            rendererHandler(key, data, renderer);
                        }
                    }
                }
                else
                {
                    rendererHandler(key, data, renderer);
                }
            }
        });
        return memento;
    }

    /**
     * 为列表显示对象赋值
     * 
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    public valuateBindFor(target:eui.DataGroup, datas:any, memento:any):void
    {
        var provider:eui.ICollection;
        // 初始化列表状态
        target["__egret_datagroup_state__"] = 0;
        // 设置memento
        memento.datas = datas;
        memento.syncDict = {};
        setTimeout(() => {
            // 一次渲染后解锁
            delete memento.syncDict;
        }, 0);
        // 复制datas
        if(datas instanceof Array)
        {
            provider = new eui.ArrayCollection(datas);
        }
        else
        {
            // 是字典，将其变为数组
            var list:any[] = [];
            for(var key in datas)
            {
                list.push(datas[key]);
            }
            provider = new eui.ArrayCollection(list);
        }
        // 赋值
        target.dataProvider = provider;
    }
}

export interface IInitParams
{
    /** 舞台宽度 */
    width:number;
    /** 舞台高度 */
    height:number;
    /** Egret工程根目录的相对路径前缀，例如："egret/" */
    pathPrefix:string;
    /** DOM容器名称或引用，不传递则自动生成一个 */
    container?:string|HTMLElement;
    /** 屏幕拉伸模式，使用egret.StageScaleMode中的常量值，默认为egret.StageScaleMode.SHOW_ALL */
    scaleMode?:string;
    /** 屏幕渲染帧频，默认为60 */
    frameRate?:number;
    /** 是否显示重绘矩形，默认为false */
    showPaintRect?:boolean;
    /** 多点触摸的最多点数，默认为2 */
    multiFingered?:number;
    /** 是否显示帧频信息，默认为false */
    showFPS?:boolean;
    /** 帧频样式，默认为："x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"*/
    showFPSStyle?:string;
    /** 是否显示日志信息，默认为false */
    showLog?:boolean;
    /** 背景颜色，默认黑色 */
    backgroundColor?:number;
    /** 渲染模式，在RenderMode中查找枚举值，默认为AUTO **/
    renderMode?:RenderMode;
    /** 通用提示框类型 */
    promptClass?:IPromptPanelConstructor;
    /** 遮罩数据 */
    maskData?:MaskData;
    /** 预加载资源组名 */
    preloadGroups?:string[];
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