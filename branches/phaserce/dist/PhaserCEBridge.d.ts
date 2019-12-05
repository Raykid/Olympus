/// <amd-module name="PhaserCEBridge" />
/// <reference types="phaser-ce/typescript/phaser" />
import IBridge from 'olympus-r/engine/bridge/IBridge';
import { IMaskEntity } from 'olympus-r/engine/mask/MaskManager';
import IMediator from 'olympus-r/engine/mediator/IMediator';
import IPanelPolicy from 'olympus-r/engine/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/engine/panel/IPromptPanel';
import IScenePolicy from 'olympus-r/engine/scene/IScenePolicy';
import PIXI from 'phaser-ce/build/custom/pixi';
import { MaskData } from './phaserce/MaskEntity';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @date 2019-12-05
 *
 * PhaserCEBridge的表现层桥实现
*/
export default class PhaserCEBridge implements IBridge<PIXI.DisplayObject> {
    /** 提供静态类型常量 */
    static TYPE: string;
    private _initParams;
    private _htmlWrapper;
    private _game;
    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof PhaserCEBridge
     */
    get type(): string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof PhaserCEBridge
     */
    get htmlWrapper(): HTMLElement;
    private _root;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get root(): PIXI.DisplayObjectContainer;
    private _stage;
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {Phaser.Stage}
     * @memberof PhaserCEBridge
     */
    get stage(): Phaser.Stage;
    private _bgLayer;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get bgLayer(): PIXI.DisplayObjectContainer;
    private _sceneLayer;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get sceneLayer(): PIXI.DisplayObjectContainer;
    private _frameLayer;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get frameLayer(): PIXI.DisplayObjectContainer;
    private _panelLayer;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get panelLayer(): PIXI.DisplayObjectContainer;
    private _maskLayer;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get maskLayer(): PIXI.DisplayObjectContainer;
    private _topLayer;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {PIXI.DisplayObjectContainer}
     * @memberof PhaserCEBridge
     */
    get topLayer(): PIXI.DisplayObjectContainer;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof PhaserCEBridge
     */
    get promptClass(): IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof PhaserCEBridge
     */
    get maskEntity(): IMaskEntity;
    /**
     * 默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof PhaserCEBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 默认场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof PhaserCEBridge
     */
    defaultScenePolicy: IScenePolicy;
    constructor(params: IInitParams);
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof PhaserCEBridge
     */
    init(complete: (bridge: IBridge) => void): void;
    /**
     * 判断皮肤是否是Egret显示对象
     *
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof PhaserCEBridge
     */
    isMySkin(skin: any): boolean;
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof PhaserCEBridge
     */
    wrapSkin(mediator: IMediator<PIXI.DisplayObject>, skin: any): PIXI.DisplayObject;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {PIXI.DisplayObject} current 当前皮肤
     * @param {PIXI.DisplayObject} target 要替换的皮肤
     * @returns {PIXI.DisplayObject} 替换完毕的皮肤
     * @memberof PhaserCEBridge
     */
    replaceSkin(mediator: IMediator<PIXI.DisplayObject>, current: PIXI.DisplayObject, target: PIXI.DisplayObject): PIXI.DisplayObject;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {PIXI.DisplayObjectContainer} current 当前皮肤
     * @param {PIXI.DisplayObjectContainer} target 替换的皮肤
     * @memberof PhaserCEBridge
     */
    syncSkin(current: PIXI.DisplayObjectContainer, target: PIXI.DisplayObjectContainer): void;
    /**
     * 创建一个空的显示对象
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    createEmptyDisplay(): PIXI.DisplayObject;
    /**
     * 创建一个占位符
     *
     * @returns {PIXI.DisplayObject}
     * @memberof PhaserCEBridge
     */
    createPlaceHolder(): PIXI.DisplayObject;
    /**
     * 添加显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    addChild(parent: PIXI.DisplayObjectContainer, target: PIXI.DisplayObject): PIXI.DisplayObject;
    /**
     * 按索引添加显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 要添加到的父容器
     * @param {PIXI.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {PIXI.DisplayObject} 返回被添加的显示对象
     * @memberof PhaserCEBridge
     */
    addChildAt(parent: PIXI.DisplayObjectContainer, target: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
    /**
     * 移除显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 被移除的显示对象
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    removeChild(parent: PIXI.DisplayObjectContainer, target: PIXI.DisplayObject): PIXI.DisplayObject;
    /**
     * 按索引移除显示
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {PIXI.DisplayObject} 返回被移除的显示对象
     * @memberof PhaserCEBridge
     */
    removeChildAt(parent: PIXI.DisplayObjectContainer, index: number): PIXI.DisplayObject;
    /**
     * 移除所有显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @memberof PhaserCEBridge
     */
    removeChildren(parent: PIXI.DisplayObjectContainer): void;
    /**
     * 获取父容器
     *
     * @param {PIXI.DisplayObject} target 目标对象
     * @returns {PIXI.DisplayObjectContainer} 父容器
     * @memberof PhaserCEBridge
     */
    getParent(target: PIXI.DisplayObject): PIXI.DisplayObjectContainer;
    /**
     * 获取指定索引处的显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {PIXI.DisplayObject} 索引处的显示对象
     * @memberof PhaserCEBridge
     */
    getChildAt(parent: PIXI.DisplayObjectContainer, index: number): PIXI.DisplayObject;
    /**
     * 获取显示索引
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {PIXI.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof PhaserCEBridge
     */
    getChildIndex(parent: PIXI.DisplayObjectContainer, target: PIXI.DisplayObject): number;
    /**
     * 通过名称获取显示对象
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {PIXI.DisplayObject} 显示对象
     * @memberof PhaserCEBridge
     */
    getChildByName(parent: PIXI.DisplayObjectContainer, name: string): PIXI.DisplayObject;
    /**
     * 获取子显示对象数量
     *
     * @param {PIXI.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof PhaserCEBridge
     */
    getChildCount(parent: PIXI.DisplayObjectContainer): number;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof PhaserCEBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
    private _listenerDict;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {PIXI.DisplayObject&PIXI.Mixin} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    mapListener(target: PIXI.DisplayObject & PIXI.Mixin, type: string, handler: Function, thisArg?: any): void;
    /**
     * 注销监听事件
     *
     * @param {PIXI.DisplayObject&PIXI.Mixin} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof PhaserCEBridge
     */
    unmapListener(target: PIXI.DisplayObject & PIXI.Mixin, type: string, handler: Function, thisArg?: any): void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:PIXI.DisplayObject)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    wrapBindFor(target: PIXI.DisplayObject, rendererHandler: (key?: any, value?: any, renderer?: PIXI.DisplayObject) => void): any;
    /**
     * 为列表显示对象赋值
     *
     * @param {PIXI.DisplayObject} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    valuateBindFor(target: PIXI.DisplayObject, datas: any, memento: any): void;
}
export interface IInitParams {
    /**
     * Phaser.Game需要的初始化配置
     *
     * @type {Phaser.IGameConfig}
     * @memberof IInitParams
     */
    gameConfig?: Phaser.IGameConfig;
    /**
     * 通用提示框类型
     *
     * @type {IPromptPanelConstructor}
     * @memberof IInitParams
     */
    promptClass?: IPromptPanelConstructor;
    /**
     * 遮罩数据
     *
     * @type {MaskData}
     * @memberof IInitParams
     */
    maskData?: MaskData;
}
