/// <amd-module name="DOMBridgeExt"/>
/// <reference types="tween.js"/>

import * as TWEEN from "@tweenjs/tween.js";
import { assetsManager } from "olympus-r/project/assets/AssetsManager";
import IBridgeExt from "olympus-r/project/bridge/IBridgeExt";
import { IMaskEntity } from 'olympus-r/project/mask/MaskManager';
import IMediator from 'olympus-r/project/mediator/IMediator';
import IPanelPolicy from 'olympus-r/project/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/project/panel/IPromptPanel';
import IScenePolicy from 'olympus-r/project/scene/IScenePolicy';
import { system } from "olympus-r/utils/System";
import MaskEntity, { MaskData } from "./dom/mask/MaskEntity";
import BackPanelPolicy from "./dom/panel/BackPanelPolicy";
import FadeScenePolicy from "./dom/scene/FadeScenePolicy";
import { wrapSkin } from './dom/utils/SkinUtilExt';
import DOMBridge, { IInitParams } from './DOMBridge';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 基于DOM的表现层桥实现
*/
export default class DOMBridgeExt extends DOMBridge implements IBridgeExt
{
    /** 提供静态类型常量 */
    public static TYPE:string = "DOM";

    protected _initParams:IInitParamsExt;

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
    
    public constructor(params:IInitParamsExt)
    {
        super(params);
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
    public init(complete:(bridge:IBridgeExt)=>void):void
    {
        super.init((bridge:IBridgeExt)=>{
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
            complete(bridge);
        });
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
}

export interface IInitParamsExt extends IInitParams
{
    /** 通用提示框类型 */
    promptClass?:IPromptPanelConstructor;
    /** 遮罩皮肤 */
    maskData?:MaskData;
}