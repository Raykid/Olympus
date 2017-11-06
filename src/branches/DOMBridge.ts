/// <reference path="../../dist/Olympus.d.ts"/>

import IBridge from "engine/bridge/IBridge";
import { getObjectHashs } from "utils/ObjectUtil";
import IPromptPanel, { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
import IPanelPolicy from "engine/panel/IPanelPolicy";
import IScenePolicy from "engine/scene/IScenePolicy";
import IMediator from "engine/mediator/IMediator";
import { IMaskEntity } from "engine/mask/MaskManager";
import MaskEntity, { MaskData } from "./dom/mask/MaskEntity";
import { assetsManager } from "engine/assets/AssetsManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 基于DOM的表现层桥实现
*/
export default class DOMBridge implements IBridge
{
    /** 提供静态类型常量 */
    public static TYPE:string = "DOM";

    private _initParams:IInitParams;
    private _promptPanel:IPromptPanel;

    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof DOMBridge
     */
    public get type():string
    {
        return DOMBridge.TYPE;
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get htmlWrapper():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get root():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取舞台引用，DOM的舞台指向root所在的Document对象
     * 
     * @readonly
     * @type {Document}
     * @memberof DOMBridge
     */
    public get stage():Document
    {
        return this.root.ownerDocument;
    }

    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get bgLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get sceneLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取框架容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get frameLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get panelLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取遮罩容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get maskLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get topLayer():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取通用提示框
     * 
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof DOMBridge
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
     * @memberof DOMBridge
     */
    public get maskEntity():IMaskEntity
    {
        return new MaskEntity(this._initParams.maskData);
    }
    
    /**
     * 获取默认弹窗策略
     * 
     * @type {IPanelPolicy}
     * @memberof EgretBridge
     */
    public defaultPanelPolicy:IPanelPolicy = null;

    /**
     * 获取默认场景切换策略
     * 
     * @type {IScenePolicy}
     * @memberof EgretBridge
     */
    public defaultScenePolicy:IScenePolicy = null;
    
    public constructor(params:IInitParams)
    {
        this._initParams = params;
    }
    
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof DOMBridge
     */
    public init(complete:(bridge:IBridge)=>void):void
    {
        // 如果是名称，则转变成引用
        if(typeof this._initParams.container == "string")
        {
            this._initParams.container = <HTMLElement>document.querySelector(this._initParams.container);
        }
        // 如果是空，则生成一个
        if(!this._initParams.container)
        {
            this._initParams.container = document.createElement("div");
            document.body.appendChild(this._initParams.container);
        }
        // 调用回调
        complete(this);
    }

    /**
     * 判断皮肤是否是DOM显示节点
     * 
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是DOM显示节点
     * @memberof DOMBridge
     */
    public isMySkin(skin:any):boolean
    {
        return (skin instanceof HTMLElement);
    }

    /**
     * 创建一个空的显示对象
     *
     * @returns {HTMLElement}
     * @memberof DOMBridge
     */
    public createEmptyDisplay():HTMLElement
    {
        return document.createElement("div");
    }

    /**
     * 添加显示
     * 
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @return {Element} 返回被添加的显示对象
     * @memberof DOMBridge
     */
    public addChild(parent:Element, target:Element):Element
    {
        return parent.appendChild(target);
    }

    /**
     * 按索引添加显示
     * 
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Element} 返回被添加的显示对象
     * @memberof DOMBridge
     */
    public addChildAt(parent:Element, target:Element, index:number):Element
    {
        return parent.insertBefore(target, this.getChildAt(parent, index));
    }

    /**
     * 移除显示对象
     * 
     * @param {Element} parent 父容器
     * @param {Element} target 被移除的显示对象
     * @return {Element} 返回被移除的显示对象
     * @memberof DOMBridge
     */
    public removeChild(parent:Element, target:Element):Element
    {
        return parent.removeChild(target);
    }

    /**
     * 按索引移除显示
     * 
     * @param {Element} parent 父容器
     * @param {number} index 索引
     * @return {Element} 返回被移除的显示对象
     * @memberof DOMBridge
     */
    public removeChildAt(parent:Element, index:number):Element
    {
        return parent.removeChild(this.getChildAt(parent, index));
    }

    /**
     * 移除所有显示对象
     * 
     * @param {Element} parent 父容器
     * @memberof DOMBridge
     */
    public removeChildren(parent:Element):void
    {
        for(var i:number = 0, len:number = parent.children.length; i < len; i++)
        {
            parent.removeChild(parent.children.item(i));
        }
    }
    
    /**
     * 获取父容器
     * 
     * @param {Element} target 目标对象
     * @returns {Element} 父容器
     * @memberof DOMBridge
     */
    public getParent(target:Element):Element
    {
        return target.parentElement;
    }

    /**
     * 获取指定索引处的显示对象
     * 
     * @param {Element} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Element} 索引处的显示对象
     * @memberof DOMBridge
     */
    public getChildAt(parent:Element, index:number):Element
    {
        return parent.children.item(index);
    }

    /**
     * 获取显示索引
     * 
     * @param {Element} parent 父容器
     * @param {Element} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof DOMBridge
     */
    public getChildIndex(parent:Element, target:Element):number
    {
        for(var i:number = 0, len:number = parent.children.length; i < len; i++)
        {
            if(target === parent.children.item(i)) return i;
        }
        return -1;
    }
    
    /**
     * 通过名称获取显示对象
     * 
     * @param {Element} parent 父容器
     * @param {string} name 对象名称
     * @return {Element} 显示对象
     * @memberof DOMBridge
     */
    public getChildByName(parent:Element, name:string):Element
    {
        return parent.children.namedItem(name);
    }

    /**
     * 获取子显示对象数量
     * 
     * @param {Element} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof DOMBridge
     */
    public getChildCount(parent:Element):number
    {
        return parent.childElementCount;
    }
    
    /**
     * 加载资源
     * 
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof DOMBridge
     */
    public loadAssets(assets:string[], mediator:IMediator, handler:(err?:Error)=>void):void
    {
        // 开始加载皮肤列表
        if(assets) assets = assets.concat();
        loadNext();
        
        function loadNext():void
        {
            if(!assets || assets.length <= 0)
            {
                // 调用回调
                handler();
            }
            else
            {
                var skin:string = assets.shift();
                assetsManager.loadAssets(
                    skin,
                    result=>{
                        if(result instanceof Error)
                            handler(result);
                        else
                            loadNext();
                    }
                );
            }
        }
    }
    
    private _listenerDict:{[key:string]:(evt:Event)=>void} = {};
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof DOMBridge
     */
    public mapListener(target:EventTarget, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        var key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则不再监听
        if(this._listenerDict[key]) return;
        // 监听
        var listener:(evt:Event)=>void = function(evt:Event):void
        {
            // 调用回调
            handler.call(thisArg || this, evt);
        };
        target.addEventListener(type, listener);
        // 记录监听
        this._listenerDict[key] = listener;
    }
    
    /**
     * 注销监听事件
     * 
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof DOMBridge
     */
    public unmapListener(target:EventTarget, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        var key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则移除监听
        var listener:(evt:Event)=>void = this._listenerDict[key];
        if(listener)
        {
            target.removeEventListener(type, listener);
            // 移除记录
            delete this._listenerDict[key];
        }
    }
}

export interface IInitParams
{
    /** DOM容器名称或引用，不传递则自动生成一个 */
    container?:string|HTMLElement;
    /** 通用提示框类型 */
    promptClass?:IPromptPanelConstructor;
    /** 遮罩皮肤 */
    maskData?:MaskData;
}