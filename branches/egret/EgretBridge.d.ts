import IBridge from 'olympus-r/kernel/interfaces/IBridge';
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
    protected _initParams: IInitParams;
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
    readonly wrapper: HTMLElement;
    protected _root: egret.DisplayObjectContainer;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly root: egret.DisplayObjectContainer;
    constructor(params: IInitParams);
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof EgretBridge
     */
    init(complete: (bridge: IBridge) => void): void;
    protected onRootInitialized(root: eui.UILayer, complete: (bridge: IBridge) => void): void;
    /**
     * 判断皮肤是否是Egret显示对象
     *
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof EgretBridge
     */
    isMySkin(skin: any): boolean;
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
    /** 预加载资源组名 */
    preloadGroups?: string[];
}
