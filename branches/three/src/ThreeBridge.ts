/// <amd-module name="ThreeBridge"/>
/// <reference types="olympus-r"/>

import { WebGLRendererParameters, Camera, Scene, WebGLRenderer, OrthographicCamera, Object3D, Event, Group, PerspectiveCamera, FileLoader, ObjectLoader } from "three";
import IBridge from "olympus-r/engine/bridge/IBridge";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IMediator from "olympus-r/engine/mediator/IMediator";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import { NonePanelPolicy } from "olympus-r/engine/panel/NonePanelPolicy";
import { IPromptPanelConstructor } from "olympus-r/engine/panel/IPromptPanel";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import { NoneScenePolicy } from "olympus-r/engine/scene/NoneScenePolicy";
import { sceneManager } from "olympus-r/engine/scene/SceneManager";
import { system, ICancelable } from "olympus-r/engine/system/System";
import { getObjectHashs } from "olympus-r/utils/ObjectUtil";
import IThreeScene from "./three/scene/IThreeScene";
import MaskEntityImpl from "./three/mask/MaskEntity";
import { core } from "olympus-r/core/Core";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import AssetsLoader from "./three/AssetsLoader";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 * 
 * Olympus的Three.js表现层桥
*/
export default class ThreeBridge implements IBridge
{
    /** 提供静态类型常量 */
    public static TYPE:string = "Three.js";

    private _initParams:IInitParams;

    private _renderer:WebGLRenderer;
    private _scene:Scene;
    private _camera:Camera;
    private _cameraInvalid:boolean = false;
    private _renderCancelable:ICancelable;

    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof ThreeBridge
     */
    public get type():string
    {
        return ThreeBridge.TYPE;
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof ThreeBridge
     */
    public get htmlWrapper():HTMLElement
    {
        return <HTMLElement>this._initParams.container;
    }

    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get root():Object3D
    {
        return this._scene;
    }

    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get stage():Object3D
    {
        return this._scene;
    }

    private _bgLayer:Object3D;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get bgLayer():Object3D
    {
        return this._bgLayer;
    }

    private _sceneLayer:Object3D;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get sceneLayer():Object3D
    {
        return this._sceneLayer;
    }

    private _frameLayer:Object3D;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get frameLayer():Object3D
    {
        return this._frameLayer;
    }
    
    private _panelLayer:Object3D;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get panelLayer():Object3D
    {
        return this._panelLayer;
    }
    
    private _maskLayer:Object3D;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get maskLayer():Object3D
    {
        return this._maskLayer;
    }
    
    private _topLayer:Object3D;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    public get topLayer():Object3D
    {
        return this._topLayer;
    }
    
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof ThreeBridge
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
     * @memberof ThreeBridge
     */
    public get maskEntity():IMaskEntity
    {
        return new MaskEntityImpl();
    }

    /**
     * 获取或设置默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof ThreeBridge
     */
    public defaultPanelPolicy:IPanelPolicy = new NonePanelPolicy();
    /**
     * 获取或设置场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof ThreeBridge
     */
    public defaultScenePolicy:IScenePolicy = new NoneScenePolicy();

    public constructor(params:IInitParams)
    {
        this._initParams = params;
    }

    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     *
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof ThreeBridge
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
        // 初始化容器
        this._initParams.container.style.margin = "auto";
        this._initParams.container.style.width = "100%";
        this._initParams.container.style.height = "100%";
        this._initParams.container.style.position = "fixed";
        this._initParams.container.style.top = "0%";
        this._initParams.container.style.left = "0%";
        // 创建渲染器、场景、默认摄像机
        this._renderer = new WebGLRenderer(this._initParams.rendererParams);
        this._scene = new Scene();
        let w:number = this._initParams.width * 0.5;
        let h:number = this._initParams.height * 0.5;
        this._camera = this._initParams.camera || new OrthographicCamera(-w, w, -h, h, this._initParams.near, this._initParams.far);
        // 创建背景显示层
        this._bgLayer = new Group();
        this._scene.add(this._bgLayer);
        // 创建场景显示层
        this._sceneLayer = new Group();
        this._scene.add(this._sceneLayer);
        // 创建框架显示层
        this._frameLayer = new Group();
        this._scene.add(this._frameLayer);
        // 创建弹出层
        this._panelLayer = new Group();
        this._scene.add(this._panelLayer);
        // 创建遮罩层
        this._maskLayer = new Group();
        this._scene.add(this._maskLayer);
        // 创建顶级显示层
        this._topLayer = new Group();
        this._scene.add(this._topLayer);
        // 根据帧频设置决定使用何种渲染驱动方式
        if(this._initParams.frameRate > 0)
        {
            // 规定了，设置setInterval
            this._renderCancelable = system.setInterval(1000 / this._initParams.frameRate, this.onRender, this);
        }
        else
        {
            // 没规定，监听enterframe事件
            this._renderCancelable = system.enterFrame(this.onRender, this);
        }
        // 监听页面resize事件
        window.addEventListener("resize", ()=>{
            // 设置摄像机更新
            this._cameraInvalid = true;
        });
        // 调用回调
        complete(this);
    }

    private _lastRenderCamera:Camera;
    private onRender():void
    {
        // 取到当前场景
        let curScene:IThreeScene = sceneManager.currentScene as IThreeScene;
        // 取到需要渲染的摄像机，优先使用当前场景的摄像机
        let camera:Camera = (curScene && curScene.camera) || this._camera;
        if(camera !== this._lastRenderCamera)
        {
            this._cameraInvalid = true;
            this._lastRenderCamera = camera;
        }
        // 更新摄像机参数
        if(this._cameraInvalid)
        {
            if(camera instanceof OrthographicCamera)
            {
                let coe:number = window.innerWidth / window.innerHeight;
                let coeDesign:number = this._initParams.width / this._initParams.height;
                let w:number, h:number;
                if(coe > coeDesign)
                {
                    // 比设计宽，保持高度，扩展宽度
                    w = (this._initParams.height * coe) * 0.5;
                    h = this._initParams.height * 0.5;
                }
                else
                {
                    // 比设计高，保持宽度，扩展高度
                    w = this._initParams.width * 0.5;
                    h = (this._initParams.width / coe) * 0.5;
                }
                // 更新摄像机
                camera.left = -w;
                camera.right = w;
                camera.top = h;
                camera.bottom = -h;
                camera.updateProjectionMatrix();
            }
            else if(camera instanceof PerspectiveCamera)
            {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }
            // 设置渲染器
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            // 重置标识符
            this._cameraInvalid = false;
        }
        // 进行渲染
        this._renderer.render(this._scene, camera);
    }

    /**
     * 判断传入的skin是否是属于该表现层桥的
     *
     * @param {*} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof ThreeBridge
     */
    public isMySkin(skin:any):boolean
    {
        return (skin instanceof Object3D && skin.isObject3D);
    }
    /**
     * 创建一个空的显示对象
     *
     * @returns {Object3D}
     * @memberof ThreeBridge
     */
    public createEmptyDisplay():Object3D
    {
        return new Object3D();
    }
    /**
     * 添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    public addChild(parent:Object3D, target:Object3D):Object3D
    {
        if(parent && target)
        {
            parent.add(target);
            return target;
        }
        else
        {
            return target;
        }
    }

    /**
     * 按索引添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    public addChildAt(parent:Object3D, target:Object3D, index:number):Object3D
    {
        let result:Object3D = this.addChild(parent, target);
        // 要调整索引到指定位置
        let temp:number = this.getChildIndex(parent, target);
        if(temp >= 0)
        {
            parent.children.splice(temp, 1);
            parent.children.splice(index, 0, target);
        }
        return result;
    }

    /**
     * 移除显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 被移除的显示对象
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    public removeChild(parent:Object3D, target:Object3D):Object3D
    {
        if(parent && target && target.parent === parent)
        {
            parent.remove(target);
            return target;
        }
        else
        {
            return target;
        }
    }

    /**
     * 按索引移除显示
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 索引
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    public removeChildAt(parent:Object3D, index: number):Object3D
    {
        let target:Object3D = this.getChildAt(parent, index);
        return this.removeChild(parent, target);
    }

    /**
     * 移除所有显示对象
     *
     * @param {Object3D} parent 父容器
     * @memberof ThreeBridge
     */
    public removeChildren(parent:Object3D):void
    {
        for(let i:number = parent.children.length - 1; i >= 0; i--)
        {
            this.removeChildAt(parent, 0);
        }
    }

    /**
     * 获取父容器
     *
     * @param {Object3D} target 指定显示对象
     * @return {Object3D} 父容器
     * @memberof ThreeBridge
     */
    public getParent(target:Object3D):Object3D
    {
        return target.parent;
    }

    /**
     * 获取指定索引处的显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Object3D} 索引处的显示对象
     * @memberof ThreeBridge
     */
    public getChildAt(parent:Object3D, index: number):Object3D
    {
        return parent.children[index];
    }

    /**
     * 获取显示索引
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof ThreeBridge
     */
    public getChildIndex(parent:Object3D, target:Object3D):number
    {
        return parent.children.indexOf(target);
    }
    
    /**
     * 通过名称获取显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {string} name 对象名称
     * @return {Object3D} 显示对象
     * @memberof ThreeBridge
     */
    public getChildByName(parent:Object3D, name:string):Object3D
    {
        return parent.getObjectByName(name);
    }

    /**
     * 获取子显示对象数量
     *
     * @param {Object3D} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof ThreeBridge
     */
    public getChildCount(parent:Object3D):number
    {
        return parent.children.length;
    }

    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof ThreeBridge
     */
    public loadAssets(assets:string[], mediator:IMediator, handler:(err?:Error)=>void):void
    {
        new AssetsLoader({
            oneError: (error:Error)=>{
                // 调用回调
                handler(error);
                // 派发加载错误事件
                core.dispatch(ModuleMessage.MODULE_LOAD_ASSETS_ERROR, error);
            },
            complete: ()=>{
                // 调用回调
                handler();
            }
        }).load(assets);
    }
    
    private _listenerDict:{[key:string]:(evt:Event)=>void} = {};
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    public mapListener(target:Object3D, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        let key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则不再监听
        if(this._listenerDict[key]) return;
        // 监听
        let listener:(evt:Event)=>void = function(evt:Event):void
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
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    public unmapListener(target:Object3D, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        let key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则移除监听
        let listener:(evt:Event)=>void = this._listenerDict[key];
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
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} handler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof ThreeBridge
     */
    public wrapBindFor(target:Object3D, handler:(key?:any, value?:any, renderer?:any) => void):any
    {
        let parent:Object3D = target.parent;
        let index:number = this.getChildIndex(parent, target);
        // 生成一个from节点和一个to节点，用来占位
        let from:Object3D = this.createEmptyDisplay();
        this.addChildAt(parent, from, index);
        let to:Object3D = this.createEmptyDisplay();
        this.addChildAt(parent, to, index + 1);
        // 移除显示
        this.removeChild(parent, target);
        // 返回备忘录
        return {parent: parent, from: from, to: to, handler: handler};
    }

    /**
     * 为列表显示对象赋值
     *
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof ThreeBridge
     */
    public valuateBindFor(target:Object3D, datas:any, memento:any):void
    {
        // 移除已有的列表项显示
        let parent:Object3D = memento.parent;
        if(parent)
        {
            let fromIndex:number = this.getChildIndex(parent, memento.from);
            let toIndex:number = this.getChildIndex(parent, memento.to);
            for(let i:number = fromIndex + 1; i < toIndex; i++)
            {
                this.removeChildAt(parent, fromIndex + 1);
            }
        }
        // 添加新的渲染器
        for(let key in datas)
        {
            let newObject:Object3D = target.clone(true);
            // 添加显示
            let index:number = this.getChildIndex(parent, memento.to);
            this.addChildAt(parent, newObject, index ++);
            // 调用回调
            memento.handler(key, datas[key], newObject);
        }
    }
}

export interface IInitParams
{
    /**
     * 摄像机宽度
     * 
     * @type {number}
     * @memberof IInitParams
     */
    width:number;
    /**
     * 摄像机高度
     * 
     * @type {number}
     * @memberof IInitParams
     */
    height:number;
    /**
     * DOM容器名称或引用，不传递则自动生成一个
     * 
     * @type {(string|HTMLElement)}
     * @memberof IInitParams
     */
    container?:string|HTMLElement;
    /**
     * 传递给Three.js渲染器的参数
     * 
     * @type {WebGLRendererParameters}
     * @memberof IInitParams
     */
    rendererParams?:WebGLRendererParameters;
    /**
     * 摄像机可拍摄的最近距离，默认0.1
     * 
     * @type {number}
     * @memberof IInitParams
     */
    near?:number;
    /**
     * 摄像机可拍摄的最远距离，默认2000
     * 
     * @type {number}
     * @memberof IInitParams
     */
    far?:number;
    /**
     * 默认摄像机，如果不传则使用OrthographicCamera，即无透视摄像机
     * 
     * @type {Camera}
     * @memberof IInitParams
     */
    camera?:Camera;
    /**
     * 规定渲染帧频，不规定则以系统回调为准
     * 
     * @type {number}
     * @memberof IInitParams
     */
    frameRate?:number;
    /**
     * 通用提示框类型
     * 
     * @type {IPromptPanelConstructor}
     * @memberof IInitParams
     */
    promptClass?:IPromptPanelConstructor;
}