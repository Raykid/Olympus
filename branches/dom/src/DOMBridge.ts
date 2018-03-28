/// <amd-module name="DOMBridge"/>
/// <reference types="tween.js"/>

import IBridge from "olympus-r/engine/bridge/IBridge";
import { getObjectHashs, extendObject } from "olympus-r/utils/ObjectUtil";
import IPromptPanel, { IPromptPanelConstructor } from "olympus-r/engine/panel/IPromptPanel";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import IMediator from "olympus-r/engine/mediator/IMediator";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import { assetsManager } from "olympus-r/engine/assets/AssetsManager";
import { system } from "olympus-r/engine/system/System";
import MaskEntity, { MaskData } from "./dom/mask/MaskEntity";
import * as Injector from "./dom/injector/Injector";
import { copyRef, wrapSkin, isDOMStr, isDOMPath, toHTMLElement } from "./dom/utils/SkinUtil";
import BackPanelPolicy from "./dom/panel/BackPanelPolicy";
import FadeScenePolicy from "./dom/scene/FadeScenePolicy";
import * as TWEEN from "@tweenjs/tween.js";

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
     * 获取舞台引用，DOM的舞台指向根节点
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get stage():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    private _bgLayer:HTMLElement;
    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get bgLayer():HTMLElement
    {
        return this._bgLayer;
    }

    private _sceneLayer:HTMLElement;
    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get sceneLayer():HTMLElement
    {
        return this._sceneLayer;
    }

    private _frameLayer:HTMLElement;
    /**
     * 获取框架容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get frameLayer():HTMLElement
    {
        return this._frameLayer;
    }

    private _panelLayer:HTMLElement;
    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get panelLayer():HTMLElement
    {
        return this._panelLayer;
    }

    private _maskLayer:HTMLElement;
    /**
     * 获取遮罩容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get maskLayer():HTMLElement
    {
        return this._maskLayer;
    }

    private _topLayer:HTMLElement;
    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    public get topLayer():HTMLElement
    {
        return this._topLayer;
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
     * @memberof DOMBridge
     */
    public defaultPanelPolicy:IPanelPolicy = new BackPanelPolicy();

    /**
     * 获取默认场景切换策略
     * 
     * @type {IScenePolicy}
     * @memberof DOMBridge
     */
    public defaultScenePolicy:IScenePolicy = new FadeScenePolicy();
    
    public constructor(params:IInitParams)
    {
        this._initParams = params;
    }

    private createLayer():HTMLElement
    {
        // 生成一个父容器，不响应点击事件，但会撑起全屏幕范围
        var layer:HTMLElement = document.createElement("div");
        layer.style.position = "fixed";
        layer.style.top = "0%";
        layer.style.left = "0%";
        layer.style.width = "100%";
        layer.style.height = "100%";
        layer.style.pointerEvents = "none";
        this.root.appendChild(layer);
        // 生成一个子容器，实际用来放置子对象，目的是响应点击事件
        var subLayer:HTMLElement = document.createElement("div");
        subLayer.style.pointerEvents = "auto";
        layer.appendChild(subLayer);
        // 返回子容器
        return subLayer;
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
        // 创建背景显示层
        this._bgLayer = this.createLayer();
        // 创建场景显示层
        this._sceneLayer = this.createLayer();
        // 创建框架显示层
        this._frameLayer = this.createLayer();
        // 创建弹出层
        this._panelLayer = this.createLayer();
        // 创建遮罩层
        this._maskLayer = this.createLayer();
        // 创建顶级显示层
        this._topLayer = this.createLayer();
        // 添加Tween.js驱动
        system.enterFrame(()=>{
            // 每次使用最新的当前运行毫秒数更新Tween.js
            TWEEN.update(system.getTimer());
        });
        // 调用回调
        complete(this);
    }

    /**
     * 判断皮肤是否是DOM显示节点
     * 
     * @param {HTMLElement|string|string[]} skin 皮肤对象
     * @returns {boolean} 是否是DOM显示节点
     * @memberof DOMBridge
     */
    public isMySkin(skin:HTMLElement|string|string[]):boolean
    {
        if(skin instanceof HTMLElement)
            return true;
        if(typeof skin === "string" && (isDOMPath(skin) || isDOMStr(skin)))
            return true;
        if(skin instanceof Array)
        {
            // 数组里每一个元素都必须是皮肤
            var result:boolean = true;
            for(var temp of skin)
            {
                if(!(typeof temp === "string" && (isDOMPath(temp) || isDOMStr(temp))))
                {
                    result = false;
                    break;
                }
            }
            return result;
        }
        return false;
    }

    /**
     * 包装HTMLElement节点
     * 
     * @param {IMediator} mediator 中介者
     * @param {HTMLElement|string|string[]} skin 原始HTMLElement节点
     * @returns {HTMLElement} 包装后的HTMLElement节点
     * @memberof DOMBridge
     */
    public wrapSkin(mediator:IMediator, skin:HTMLElement|string|string[]):HTMLElement
    {
        return wrapSkin(mediator, skin);
    }
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {HTMLElement|string|string[]} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof DOMBridge
     */
    public replaceSkin(mediator:IMediator, current:HTMLElement, target:HTMLElement|string|string[]):any
    {
        target = toHTMLElement(target);
        // 如果有父节点，则用目标节点替换当前节点位置
        var parent:HTMLElement = current.parentElement;
        if(parent)
        {
            parent.insertBefore(target, current);
            parent.removeChild(current);
        }
        // 重新包装节点
        this.wrapSkin(mediator, target);
        // 返回皮肤
        return target;
    }

    /**
     * 同步皮肤，用于组件变身后的重新定位
     * 
     * @param {HTMLElement} current 当前皮肤
     * @param {HTMLElement} target 替换的皮肤
     * @memberof DOMBridge
     */
    public syncSkin(current:HTMLElement, target:HTMLElement):void
    {
        if(!current || !target) return;
        // DOM无需特意同步，因为其样式都可以以css样式方式在外部表示，而仅有当前节点的style属性是需要同步的
        extendObject(target.style, current.style);
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
        if(parent && target && target.parentElement === parent)
            return parent.removeChild(target);
        else
            return target;
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
        return this.removeChild(parent, this.getChildAt(parent, index));
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

    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     * 
     * @param {HTMLElement} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:HTMLElement)=>void} handler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    public wrapBindFor(target:HTMLElement, handler:(key?:any, value?:any, renderer?:HTMLElement)=>void):any
    {
        var parent:HTMLElement = target.parentElement;
        // 生成一个from节点和一个to节点，用来占位
        var from:HTMLElement = document.createElement("div");
        var to:HTMLElement = document.createElement("div");
        parent && parent.insertBefore(from, target);
        parent && parent.insertBefore(to, target);
        // 移除显示
        parent && parent.removeChild(target);
        // 返回备忘录
        return {parent: parent, from: from, to: to, handler: handler};
    }

    /**
     * 为列表显示对象赋值
     * 
     * @param {HTMLElement} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    public valuateBindFor(target:HTMLElement, datas:any, memento:any):void
    {
        // 移除已有的列表项显示
        var parent:HTMLElement = memento.parent;
        if(parent)
        {
            var fromIndex:number = this.getChildIndex(parent, memento.from);
            var toIndex:number = this.getChildIndex(parent, memento.to);
            for(var i:number = fromIndex + 1; i < toIndex; i++)
            {
                this.removeChildAt(parent, fromIndex + 1);
            }
        }
        // 添加新的渲染器
        for(var key in datas)
        {
            var newElement:HTMLElement = target.cloneNode(true) as HTMLElement;
            // 拷贝子孙对象引用
            copyRef(newElement, newElement);
            // 添加显示
            parent && parent.insertBefore(newElement, memento.to);
            // 使用cloneNode方法复制渲染器
            memento.handler(key, datas[key], newElement);
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