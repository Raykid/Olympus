/// <reference types="phaser-ce/typescript/phaser"/>
/// <amd-module name="PhaserCEBridge"/>

import IBridge from 'olympus-r/engine/bridge/IBridge';
import { IMaskEntity } from 'olympus-r/engine/mask/MaskManager';
import IMediator from 'olympus-r/engine/mediator/IMediator';
import IPanelPolicy from 'olympus-r/engine/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/engine/panel/IPromptPanel';
import nonePanelPolicy from 'olympus-r/engine/panel/NonePanelPolicy';
import IScenePolicy from 'olympus-r/engine/scene/IScenePolicy';
import { getObjectHashs } from 'olympus-r/utils/ObjectUtil';
import p2 from 'phaser-ce/build/custom/p2';
import PIXI from 'phaser-ce/build/custom/pixi';
import MaskEntity, { MaskData } from './phaserce/mask/MaskEntity';
import FadeScenePolicy from './phaserce/scene/FadeScenePolicy';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @date 2019-12-05
 * 
 * PhaserCEBridge的表现层桥实现
*/
export default class PhaserCEBridge implements IBridge<PIXI.DisplayObject>
{
    /** 提供静态类型常量 */
    public static TYPE:string = "PhaserCE";

    private _initParams:IInitParams;
    private _htmlWrapper:HTMLElement;
    private _game:Phaser.Game;

    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof PhaserCEBridge
     */
    public get type():string
    {
        return PhaserCEBridge.TYPE;
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof PhaserCEBridge
     */
    public get htmlWrapper():HTMLElement
    {
        return this._htmlWrapper;
    }

    private _root:Phaser.World;
    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {Phaser.World}
     * @memberof PhaserCEBridge
     */
    public get root():Phaser.World
    {
        return this._root;
    }

    private _stage:Phaser.Stage;
    /**
     * 获取舞台引用
     * 
     * @readonly
     * @type {Phaser.Stage}
     * @memberof PhaserCEBridge
     */
    public get stage():Phaser.Stage
    {
        return this._stage;
    }
    
    private _bgLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get bgLayer():PIXI.DisplayObjectContainer
    {
        return this._bgLayer;
    }

    private _sceneLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get sceneLayer():PIXI.DisplayObjectContainer
    {
        return this._sceneLayer;
    }
    
    private _frameLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取框架容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get frameLayer():PIXI.DisplayObjectContainer
    {
        return this._frameLayer;
    }

    private _panelLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get panelLayer():PIXI.DisplayObjectContainer
    {
        return this._panelLayer;
    }

    private _maskLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取遮罩容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get maskLayer():PIXI.DisplayObjectContainer
    {
        return this._maskLayer;
    }

    private _topLayer:PIXI.DisplayObjectContainer;
    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    public get topLayer():PIXI.DisplayObjectContainer
    {
        return this._topLayer;
    }
    
    /**
     * 获取通用提示框
     * 
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof PhaserCEBridge
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
     * @memberof PhaserCEBridge
     */
    public get maskEntity():IMaskEntity
    {
        return new MaskEntity({...this._initParams.maskData, game: this._game}) as IMaskEntity;
    }

    /**
     * 默认弹窗策略
     * 
     * @type {IPanelPolicy}
     * @memberof PhaserCEBridge
     */
    public defaultPanelPolicy:IPanelPolicy = nonePanelPolicy;

    /**
     * 默认场景切换策略
     * 
     * @type {IScenePolicy}
     * @memberof PhaserCEBridge
     */
    public defaultScenePolicy:IScenePolicy = new FadeScenePolicy();
    
    public constructor(params:IInitParams)
    {
        this._initParams = params;
        if(!this._initParams.gameConfig)
        {
            this._initParams.gameConfig = {};
        }
    }
    
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof PhaserCEBridge
     */
    public init(complete:(bridge:IBridge)=>void):void
    {
        // 全局赋值依赖库
        window["PIXI"] = PIXI;
        window["p2"] = p2;
        // 动态加载Phaser分离库
        import("phaser-ce/build/custom/phaser-split").then(mod=>{
            // 全局赋值
            const Phaser = mod.default;
            window["Phaser"] = Phaser;
            // 获取容器
            if(typeof this._initParams.gameConfig.parent === "string")
            {
                this._htmlWrapper = document.getElementById(this._initParams.gameConfig.parent);
            }
            else
            {
                this._htmlWrapper = this._initParams.gameConfig.parent;
            }
            if(!this._htmlWrapper)
            {
                // 没有就生成一个
                this._htmlWrapper = document.createElement("div");
                document.body.appendChild(this._htmlWrapper);
            }
            this._htmlWrapper.style.position = "absolute";
            this._htmlWrapper.style.width = "100%";
            this._htmlWrapper.style.height = "100%";
            this._initParams.gameConfig.parent = this._htmlWrapper;
            // 生成Game
            this._game = new Phaser.Game({
                ...this._initParams.gameConfig,
                transparent: true,
                state: {
                    ...this._initParams.gameConfig.state,
                    create: (game:Phaser.Game)=>{
                        // 赋值stage
                        this._stage = game.stage;
                        // world当做root
                        this._root = game.world;
                        // 生成背景容器
                        this._bgLayer = game.add.sprite();
                        this._root.addChild(this._bgLayer);
                        // 生成场景容器
                        this._sceneLayer = game.add.sprite();
                        this._root.addChild(this._sceneLayer);
                        // 生成框架容器
                        this._frameLayer = game.add.sprite();
                        this._root.addChild(this._frameLayer);
                        // 生成弹窗容器
                        this._panelLayer = game.add.sprite();
                        this._root.addChild(this._panelLayer);
                        // 生成遮罩容器
                        this._maskLayer = game.add.sprite();
                        this._root.addChild(this._maskLayer);
                        // 生成顶级容器
                        this._topLayer = game.add.sprite();
                        this._root.addChild(this._topLayer);
                        // 调用原始回调
                        this._initParams.gameConfig.state && this._initParams.gameConfig.state.create && this._initParams.gameConfig.state.create(game);
                        // 报告初始化完毕
                        complete(this);
                    },
                },
            });
        });
    }
    
    /**
     * 判断皮肤是否是Egret显示对象
     * 
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof PhaserCEBridge
     */
    public isMySkin(skin:any):boolean
    {
        return skin instanceof PIXI.DisplayObject;
    }

    /**
     * 包装HTMLElement节点
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof PhaserCEBridge
     */
    public wrapSkin(mediator:IMediator<PIXI.DisplayObject>, skin:any):PIXI.DisplayObject
    {
        // return wrapSkin(mediator, skin);
        return skin;
    }
    
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     * 
     * @param {IMediator} mediator 中介者
     * @param {PIXI.DisplayObject} current 当前皮肤
     * @param {PIXI.DisplayObject} target 要替换的皮肤
     * @returns {PIXI.DisplayObject} 替换完毕的皮肤
     * @memberof PhaserCEBridge
     */
    public replaceSkin(mediator:IMediator<PIXI.DisplayObject>, current:PIXI.DisplayObject, target:PIXI.DisplayObject):PIXI.DisplayObject
    {
        const parent:PIXI.DisplayObjectContainer = current.parent;
        parent.addChildAt(target, parent.getChildIndex(current));
        parent.removeChild(current);
        return target;
    }

    /**
     * 同步皮肤，用于组件变身后的重新定位
     * 
     * @param {PIXI.DisplayObjectContainer} current 当前皮肤
     * @param {PIXI.DisplayObjectContainer} target 替换的皮肤
     * @memberof PhaserCEBridge
     */
    public syncSkin(current:PIXI.DisplayObjectContainer, target:PIXI.DisplayObjectContainer):void
    {
        if(!current || !target) return;
        // 设置属性
        const props:string[] = [
            "matrix", "alpha", "visible", "worldVisible"
        ];
        // 如果当前宽高不为0则同样设置宽高
        if(current.width > 0) props.push("width");
        if(current.height > 0) props.push("height");
        // 全部赋值
        for(const prop of props)
        {
            target[prop] = current[prop];
        }
    }
    
    /**
     * 创建一个空的显示对象
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    public createEmptyDisplay():PIXI.DisplayObject
    {
        return this._game.add.group();
    }
    
    /**
     * 创建一个占位符
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    public createPlaceHolder():PIXI.DisplayObject
    {
        return this.createEmptyDisplay();
    }
    
    /**
     * 添加显示
     * 
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    public addChild(parent:PIXI.DisplayObjectContainer, target:PIXI.DisplayObject):PIXI.DisplayObject
    {
        if(parent && target)
            return parent.addChild(target);
        else
            return target;
    }

    /**
     * 按索引添加显示
     * 
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    public addChildAt(parent:PIXI.DisplayObjectContainer, target:PIXI.DisplayObject, index:number):PIXI.DisplayObject
    {
        if(parent && target)
            return parent.addChildAt(target, index);
        else
            return target;
    }
    
    /**
     * 移除显示对象
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 被移除的显示对象
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    public removeChild(parent:PIXI.DisplayObjectContainer, target:PIXI.DisplayObject):PIXI.DisplayObject
    {
        if(parent && target && target.parent === parent)
            return parent.removeChild(target);
        else
            return target;
    }

    /**
     * 按索引移除显示
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    public removeChildAt(parent:PIXI.DisplayObjectContainer, index:number):PIXI.DisplayObject
    {
        if(parent && index >= 0)
            return parent.removeChildAt(index);
        else
            return null;
    }
    
    /**
     * 移除所有显示对象
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @memberof PhaserCEBridge
     */
    public removeChildren(parent:PIXI.DisplayObjectContainer):void
    {
        if(parent) parent.removeChildren();
    }

    /**
     * 获取父容器
     * 
     * @param {PIXI.DisplayObject} target 目标对象
     * @returns {PIXI.DisplayObjectContainer} 父容器
     * @memberof PhaserCEBridge
     */
    public getParent(target:PIXI.DisplayObject):PIXI.DisplayObjectContainer
    {
        return target.parent;
    }
    
    /**
     * 获取指定索引处的显示对象
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {PIXI.DisplayObject} 索引处的显示对象
     * @memberof PhaserCEBridge
     */
    public getChildAt(parent:PIXI.DisplayObjectContainer, index:number):PIXI.DisplayObject
    {
        return parent.getChildAt(index);
    }

    /**
     * 获取显示索引
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof PhaserCEBridge
     */
    public getChildIndex(parent:PIXI.DisplayObjectContainer, target:PIXI.DisplayObject):number
    {
        return parent.getChildIndex(target);
    }
    
    /**
     * 通过名称获取显示对象
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {PIXI.DisplayObject} 显示对象
     * @memberof PhaserCEBridge
     */
    public getChildByName(parent:PIXI.DisplayObjectContainer, name:string):PIXI.DisplayObject
    {
        for(let child of parent.children)
        {
            if(child["name"] === name)
            {
                return child;
            }
        }
        return null;
    }
    
    /**
     * 获取子显示对象数量
     * 
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof PhaserCEBridge
     */
    public getChildCount(parent:PIXI.DisplayObjectContainer):number
    {
        return parent.children.length;
    }

    /**
     * 加载资源
     * 
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof PhaserCEBridge
     */
    public loadAssets(assets:string[], mediator:IMediator, handler:(err?:Error)=>void):void
    {
        handler();
    }
    
    private _listenerDict:{[hash:string]:Function} = {};
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {PIXI.DisplayObject} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    public mapListener(target:PIXI.DisplayObject, type:string, handler:Function, thisArg?:any):void
    {
        const hash:string = getObjectHashs(target, type, handler, thisArg);
        if(!this._listenerDict[hash])
        {
            const signal:Phaser.Signal = target[type];
            if(signal)
            {
                const wrappedHandler:Function = thisArg ? handler.bind(thisArg) : handler;
                this._listenerDict[hash] = wrappedHandler;
                signal.add(wrappedHandler);
            }
        }
    }
    
    /**
     * 注销监听事件
     * 
     * @param {PIXI.DisplayObject} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    public unmapListener(target:PIXI.DisplayObject, type:string, handler:Function, thisArg?:any):void
    {
        const hash:string = getObjectHashs(target, type, handler, thisArg);
        const wrappedHandler:Function = this._listenerDict[hash];
        if(wrappedHandler)
        {
            const signal:Phaser.Signal = target[type];
            if(signal)
            {
                signal.remove(wrappedHandler);
                delete this._listenerDict[hash];
            }
        }
    }

    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     * 
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:PIXI.DisplayObject)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    public wrapBindFor(target:PIXI.DisplayObject, rendererHandler:(key?:any, value?:any, renderer?:PIXI.DisplayObject)=>void):any
    {
    }

    /**
     * 为列表显示对象赋值
     * 
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    public valuateBindFor(target:PIXI.DisplayObject, datas:any, memento:any):void
    {
    }
}

export interface IInitParams
{
    /**
     * Phaser.Game需要的初始化配置
     *
     * @type {Phaser.IGameConfig}
     * @memberof IInitParams
     */
    gameConfig?:Phaser.IGameConfig;

    /**
     * 通用提示框类型
     *
     * @type {IPromptPanelConstructor}
     * @memberof IInitParams
     */
    promptClass?:IPromptPanelConstructor;

    /**
     * 遮罩数据
     *
     * @type {MaskData}
     * @memberof IInitParams
     */
    maskData?:MaskData;
}