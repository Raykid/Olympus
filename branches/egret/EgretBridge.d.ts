import IBridge from "olympus-r/engine/bridge/IBridge";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IMediator from "olympus-r/engine/mediator/IMediator";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import { IPromptPanelConstructor } from "olympus-r/engine/panel/IPromptPanel";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import { MaskData } from "./egret/mask/MaskEntity";
import RenderMode from "./egret/RenderMode";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
export default class EgretBridge implements IBridge {
    /** 提供静态类型常量 */
    static TYPE: string;
    private _initParams;
    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof EgretBridge
     */
    readonly type: string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof EgretBridge
     */
    readonly htmlWrapper: HTMLElement;
    private _root;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly root: egret.DisplayObjectContainer;
    private _stage;
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {egret.Stage}
     * @memberof EgretBridge
     */
    readonly stage: egret.Stage;
    private _bgLayer;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly bgLayer: egret.DisplayObjectContainer;
    private _sceneLayer;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly sceneLayer: egret.DisplayObjectContainer;
    private _frameLayer;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly frameLayer: egret.DisplayObjectContainer;
    private _panelLayer;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly panelLayer: egret.DisplayObjectContainer;
    private _maskLayer;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly maskLayer: egret.DisplayObjectContainer;
    private _topLayer;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly topLayer: egret.DisplayObjectContainer;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof EgretBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof EgretBridge
     */
    readonly maskEntity: IMaskEntity;
    /**
     * 默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof EgretBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 默认场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof EgretBridge
     */
    defaultScenePolicy: IScenePolicy;
    constructor(params: IInitParams);
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof EgretBridge
     */
    init(complete: (bridge: IBridge) => void): void;
    /**
     * 判断皮肤是否是Egret显示对象
     *
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof EgretBridge
     */
    isMySkin(skin: any): boolean;
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof EgretBridge
     */
    wrapSkin(mediator: IMediator, skin: any): egret.DisplayObject;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof EgretBridge
     */
    replaceSkin(mediator: IMediator, current: egret.DisplayObject, target: any): any;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {egret.DisplayObject} current 当前皮肤
     * @param {egret.DisplayObject} target 替换的皮肤
     * @memberof EgretBridge
     */
    syncSkin(current: egret.DisplayObject, target: egret.DisplayObject): void;
    /**
     * 创建一个空的显示对象
     *
     * @returns {egret.Sprite}
     * @memberof EgretBridge
     */
    createEmptyDisplay(): egret.Sprite;
    /**
     * 添加显示
     *
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    addChild(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): egret.DisplayObject;
    /**
     * 按索引添加显示
     *
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof EgretBridge
     */
    addChildAt(parent: egret.DisplayObjectContainer, target: egret.DisplayObject, index: number): egret.DisplayObject;
    /**
     * 移除显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 被移除的显示对象
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    removeChild(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): egret.DisplayObject;
    /**
     * 按索引移除显示
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof EgretBridge
     */
    removeChildAt(parent: egret.DisplayObjectContainer, index: number): egret.DisplayObject;
    /**
     * 移除所有显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @memberof EgretBridge
     */
    removeChildren(parent: egret.DisplayObjectContainer): void;
    /**
     * 获取父容器
     *
     * @param {egret.DisplayObject} target 目标对象
     * @returns {egret.DisplayObjectContainer} 父容器
     * @memberof EgretBridge
     */
    getParent(target: egret.DisplayObject): egret.DisplayObjectContainer;
    /**
     * 获取指定索引处的显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {egret.DisplayObject} 索引处的显示对象
     * @memberof EgretBridge
     */
    getChildAt(parent: egret.DisplayObjectContainer, index: number): egret.DisplayObject;
    /**
     * 获取显示索引
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof EgretBridge
     */
    getChildIndex(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): number;
    /**
     * 通过名称获取显示对象
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {egret.DisplayObject} 显示对象
     * @memberof EgretBridge
     */
    getChildByName(parent: egret.DisplayObjectContainer, name: string): egret.DisplayObject;
    /**
     * 获取子显示对象数量
     *
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof EgretBridge
     */
    getChildCount(parent: egret.DisplayObjectContainer): number;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof EgretBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    mapListener(target: egret.EventDispatcher, type: string, handler: Function, thisArg?: any): void;
    /**
     * 注销监听事件
     *
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof EgretBridge
     */
    unmapListener(target: egret.EventDispatcher, type: string, handler: Function, thisArg?: any): void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:eui.IItemRenderer)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    wrapBindFor(target: eui.DataGroup, rendererHandler: (key?: any, value?: any, renderer?: eui.IItemRenderer) => void): any;
    /**
     * 为列表显示对象赋值
     *
     * @param {eui.DataGroup} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    valuateBindFor(target: eui.DataGroup, datas: any, memento: any): void;
}
export interface IInitParams {
    /** 舞台宽度 */
    width: number;
    /** 舞台高度 */
    height: number;
    /** Egret工程根目录的相对路径前缀，例如："egret/" */
    pathPrefix: string;
    /** DOM容器名称或引用，不传递则自动生成一个 */
    container?: string | HTMLElement;
    /** 屏幕拉伸模式，使用egret.StageScaleMode中的常量值，默认为egret.StageScaleMode.SHOW_ALL */
    scaleMode?: string;
    /** 屏幕渲染帧频，默认为60 */
    frameRate?: number;
    /** 是否显示重绘矩形，默认为false */
    showPaintRect?: boolean;
    /** 多点触摸的最多点数，默认为2 */
    multiFingered?: number;
    /** 是否显示帧频信息，默认为false */
    showFPS?: boolean;
    /** 帧频样式，默认为："x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"*/
    showFPSStyle?: string;
    /** 是否显示日志信息，默认为false */
    showLog?: boolean;
    /** 背景颜色，默认黑色 */
    backgroundColor?: number;
    /** 渲染模式，在RenderMode中查找枚举值，默认为AUTO **/
    renderMode?: RenderMode;
    /** 通用提示框类型 */
    promptClass?: IPromptPanelConstructor;
    /** 遮罩数据 */
    maskData?: MaskData;
    /** 预加载资源组名 */
    preloadGroups?: string[];
}
