import { WebGLRendererParameters, Camera, Object3D } from "three";
import IBridge from "olympus-r/engine/bridge/IBridge";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IMediator from "olympus-r/engine/mediator/IMediator";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import { IPromptPanelConstructor } from "olympus-r/engine/panel/IPromptPanel";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import IRenderHandler from "./three/render/IRenderHandler";
import IThreeSkin from "./three/mediator/IThreeSkin";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 *
 * Olympus的Three.js表现层桥
*/
export default class ThreeBridge implements IBridge {
    /** 提供静态类型常量 */
    static TYPE: string;
    private _visualContainer;
    private _renderList;
    private _renderCancelable;
    private _initParams;
    /**
     * 获取初始化参数
     *
     * @readonly
     * @type {IInitParams}
     * @memberof ThreeBridge
     */
    readonly initParams: IInitParams;
    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof ThreeBridge
     */
    readonly type: string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof ThreeBridge
     */
    readonly htmlWrapper: HTMLElement;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly root: Object3D;
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly stage: Object3D;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly bgLayer: Object3D;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly sceneLayer: Object3D;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly frameLayer: Object3D;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly panelLayer: Object3D;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly maskLayer: Object3D;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {Object3D}
     * @memberof ThreeBridge
     */
    readonly topLayer: Object3D;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof ThreeBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof ThreeBridge
     */
    readonly maskEntity: IMaskEntity;
    /**
     * 获取或设置默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof ThreeBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 获取或设置场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof ThreeBridge
     */
    defaultScenePolicy: IScenePolicy;
    constructor(params: IInitParams);
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     *
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof ThreeBridge
     */
    init(complete: (bridge: IBridge) => void): void;
    private onRender();
    private onResize(handler?);
    /**
     * 判断传入的skin是否是属于该表现层桥的
     *
     * @param {IThreeSkin} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof ThreeBridge
     */
    isMySkin(skin: IThreeSkin): boolean;
    /**
     * 创建一个空的显示对象
     *
     * @returns {Object3D}
     * @memberof ThreeBridge
     */
    createEmptyDisplay(): Object3D;
    /**
     * 添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    addChild(parent: Object3D, target: Object3D): Object3D;
    /**
     * 按索引添加显示
     *
     * @param {Object3D} parent 要添加到的父容器
     * @param {Object3D} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Object3D} 返回被添加的显示对象
     * @memberof ThreeBridge
     */
    addChildAt(parent: Object3D, target: Object3D, index: number): Object3D;
    /**
     * 移除显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 被移除的显示对象
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    removeChild(parent: Object3D, target: Object3D): Object3D;
    /**
     * 按索引移除显示
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 索引
     * @return {Object3D} 返回被移除的显示对象
     * @memberof ThreeBridge
     */
    removeChildAt(parent: Object3D, index: number): Object3D;
    /**
     * 移除所有显示对象
     *
     * @param {Object3D} parent 父容器
     * @memberof ThreeBridge
     */
    removeChildren(parent: Object3D): void;
    /**
     * 获取父容器
     *
     * @param {Object3D} target 指定显示对象
     * @return {Object3D} 父容器
     * @memberof ThreeBridge
     */
    getParent(target: Object3D): Object3D;
    /**
     * 获取指定索引处的显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Object3D} 索引处的显示对象
     * @memberof ThreeBridge
     */
    getChildAt(parent: Object3D, index: number): Object3D;
    /**
     * 获取显示索引
     *
     * @param {Object3D} parent 父容器
     * @param {Object3D} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof ThreeBridge
     */
    getChildIndex(parent: Object3D, target: Object3D): number;
    /**
     * 通过名称获取显示对象
     *
     * @param {Object3D} parent 父容器
     * @param {string} name 对象名称
     * @return {Object3D} 显示对象
     * @memberof ThreeBridge
     */
    getChildByName(parent: Object3D, name: string): Object3D;
    /**
     * 获取子显示对象数量
     *
     * @param {Object3D} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof ThreeBridge
     */
    getChildCount(parent: Object3D): number;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof ThreeBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
    private _listenerDict;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    mapListener(target: Object3D, type: string, handler: (evt: Event) => void, thisArg?: any): void;
    /**
     * 注销监听事件
     *
     * @param {Object3D} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof ThreeBridge
     */
    unmapListener(target: Object3D, type: string, handler: (evt: Event) => void, thisArg?: any): void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} handler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof ThreeBridge
     */
    wrapBindFor(target: Object3D, handler: (key?: any, value?: any, renderer?: any) => void): any;
    /**
     * 为列表显示对象赋值
     *
     * @param {Object3D} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof ThreeBridge
     */
    valuateBindFor(target: Object3D, datas: any, memento: any): void;
    /**
     * 添加渲染回调
     *
     * @param {IRenderHandler} handler
     * @memberof ThreeBridge
     */
    addRenderHandler(handler: IRenderHandler): void;
    /**
     * 移除渲染回调
     *
     * @param {IRenderHandler} handler
     * @memberof ThreeBridge
     */
    removeRenderHandler(handler: IRenderHandler): void;
}
export interface IInitParams {
    /**
     * 摄像机宽度
     *
     * @type {number}
     * @memberof IInitParams
     */
    width: number;
    /**
     * 摄像机高度
     *
     * @type {number}
     * @memberof IInitParams
     */
    height: number;
    /**
     * DOM容器名称或引用，不传递则自动生成一个
     *
     * @type {(string|HTMLElement)}
     * @memberof IInitParams
     */
    container?: string | HTMLElement;
    /**
     * 传递给Three.js渲染器的参数
     *
     * @type {WebGLRendererParameters}
     * @memberof IInitParams
     */
    rendererParams?: WebGLRendererParameters;
    /**
     * 摄像机可拍摄的最近距离，默认0.1
     *
     * @type {number}
     * @memberof IInitParams
     */
    near?: number;
    /**
     * 摄像机可拍摄的最远距离，默认2000
     *
     * @type {number}
     * @memberof IInitParams
     */
    far?: number;
    /**
     * 默认摄像机，如果不传则使用OrthographicCamera，即无透视摄像机
     *
     * @type {Camera}
     * @memberof IInitParams
     */
    camera?: Camera;
    /**
     * 规定渲染帧频，不规定则以系统回调为准
     *
     * @type {number}
     * @memberof IInitParams
     */
    frameRate?: number;
    /**
     * 通用提示框类型
     *
     * @type {IPromptPanelConstructor}
     * @memberof IInitParams
     */
    promptClass?: IPromptPanelConstructor;
}
