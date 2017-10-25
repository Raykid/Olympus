/// <reference path="../src/branches/egret/egret-libs/egret/egret.d.ts" />
/// <reference path="../src/branches/egret/egret-libs/eui/eui.d.ts" />
/// <reference path="../src/branches/egret/egret-libs/res/res.d.ts" />
/// <reference path="../src/branches/egret/egret-libs/tween/tween.d.ts" />
/// <reference path="Olympus.d.ts" />
declare module "egret/RenderMode" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 渲染模式枚举
    */
    enum RenderMode {
        AUTO = 0,
        CANVAS = 1,
        WEBGL = 2,
    }
    export default RenderMode;
}
declare module "egret/AssetsLoader" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 资源加载器
    */
    export interface IGroupParams {
        name: string;
        priority?: number;
    }
    export interface IItemDict {
        [key: string]: RES.ResourceItem;
    }
    export interface IResourceDict {
        [groupName: string]: IItemDict;
    }
    export interface ILoaderHandler {
        /** 加载开始时调度 */
        start?: () => void;
        /** 加载进行时调度，加载完毕前会频繁调度 */
        progress?: (resource: RES.ResourceItem, totalProgress: number) => void;
        /** 加载中某个group加载完毕时调度 */
        oneComplete?: (dict: IItemDict) => void;
        /** 加载中某个group加载失败时调度 */
        oneError?: (evt: RES.ResourceEvent) => void;
        /** 加载完毕时调度 */
        complete?: (dict: IResourceDict) => void;
    }
    export class ResourceVersionController extends RES.VersionController {
        getVirtualUrl(url: string): string;
    }
    export default class AssetsLoader {
        private _handler;
        private _retryDict;
        constructor(handler: ILoaderHandler);
        loadGroups(groups: (string | IGroupParams)[]): void;
    }
}
declare module "egret/utils/TweenUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * Egret缓动工具集，用来弥补Egret的Tween的不足
    */
    export function tweenTo(target: any, props: any, duration?: number, ease?: Function): egret.Tween;
    export function tweenFrom(target: any, props: any, duration?: number, ease?: Function): egret.Tween;
}
declare module "egret/panel/BackPanelPolicy" {
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * 回弹效果
    */
    export default class BackPanelPolicy implements IPanelPolicy {
        /**
         * 显示时调用
         * @param panel 弹出框对象
         * @param callback 完成回调，必须调用
         * @param from 动画起始点
         */
        pop(panel: IPanel, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        /**
         * 关闭时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param to 动画完结点
         */
        drop(panel: IPanel, callback: () => void, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "egret/scene/FadeScenePolicy" {
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IScene from "engine/scene/IScene";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-22
     * @modify date 2017-09-22
     *
     * 淡入淡出场景切换策略
    */
    export default class FadeScenePolicy implements IScenePolicy {
        private _tempSnapshot;
        constructor();
        /**
         * 准备切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         */
        prepareSwitch(from: IScene, to: IScene): void;
        /**
         * 切换场景时调度
         * @param from 切出的场景
         * @param to 切入的场景
         * @param callback 切换完毕的回调方法
         */
        switch(from: IScene, to: IScene, callback: () => void): void;
    }
}
declare module "egret/utils/UIUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-17
     * @modify date 2017-10-17
     *
     * UI工具集
    */
    /**
     * 包装EUI的DataGroup组件，使用传入的处理函数处理每个渲染器更新的逻辑
     *
     * @export
     * @param {eui.DataGroup} group 被包装的DataGroup组件
     * @param {(data?:any, renderer?:any)=>void} rendererHandler 渲染器处理函数，每次数据更新时会被调用
     */
    export function wrapEUIList(group: eui.DataGroup, rendererHandler: (data?: any, renderer?: any) => void): void;
}
declare module "egret/mask/MaskEntity" {
    import { IMaskEntity } from "engine/mask/MaskManager";
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * Egret遮罩实现
    */
    export default class MaskEntityImpl implements IMaskEntity {
        private _maskAlpha;
        private _loadingAlpha;
        private _modalPanelAlpha;
        private _showingMask;
        private _mask;
        private _skin;
        private _showingLoading;
        private _loadingMask;
        private _modalPanelDict;
        private _modalPanelList;
        private _modalPanelMask;
        constructor(params?: MaskData);
        /**
         * 显示遮罩
         */
        showMask(alpha?: number): void;
        /**
         * 隐藏遮罩
         */
        hideMask(): void;
        /**当前是否在显示遮罩*/
        isShowingMask(): boolean;
        /**
         * 显示加载图
         */
        showLoading(alpha?: number): void;
        /**
         * 隐藏加载图
         */
        hideLoading(): void;
        /**当前是否在显示loading*/
        isShowingLoading(): boolean;
        /** 显示模态窗口遮罩 */
        showModalMask(panel: IPanel, alpha?: number): void;
        /** 隐藏模态窗口遮罩 */
        hideModalMask(panel: IPanel): void;
        /** 当前是否在显示模态窗口遮罩 */
        isShowingModalMask(panel: IPanel): boolean;
    }
    export interface MaskData {
        maskAlpha?: number;
        loadingAlpha?: number;
        modalPanelAlpha?: number;
        skin?: egret.DisplayObject;
    }
}
declare module "EgretBridge" {
    import IBridge from "engine/bridge/IBridge";
    import { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IMediator from "engine/mediator/IMediator";
    import { IMaskEntity } from "engine/mask/MaskManager";
    import RenderMode from "egret/RenderMode";
    import { MaskData } from "egret/mask/MaskEntity";
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
        private _promptPanel;
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
         * 当皮肤被设置时处理皮肤的方法
         *
         * @param {IMediator} mediator 中介者实例
         * @memberof EgretBridge
         */
        handleSkin(mediator: IMediator): void;
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
        /** 渲染模式，在harpy.RenderMode中查找枚举值，默认为AUTO **/
        renderMode?: RenderMode;
        /** 通用提示框类型 */
        promptClass?: IPromptPanelConstructor;
        /** 遮罩数据 */
        maskData?: MaskData;
    }
}
declare module "dom/mask/MaskEntity" {
    import { IMaskEntity } from "engine/mask/MaskManager";
    import IPanel from "engine/panel/IPanel";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * DOM遮罩实现
    */
    export default class MaskEntityImpl implements IMaskEntity {
        private _skin;
        private _showing;
        constructor(skin?: HTMLElement | string);
        /**
         * 显示遮罩
         */
        showMask(alpha?: number): void;
        /**
         * 隐藏遮罩
         */
        hideMask(): void;
        /**当前是否在显示遮罩*/
        isShowingMask(): boolean;
        /**
         * 显示加载图
         */
        showLoading(alpha?: number): void;
        /**
         * 隐藏加载图
         */
        hideLoading(): void;
        /**当前是否在显示loading*/
        isShowingLoading(): boolean;
        /** 显示模态窗口遮罩 */
        showModalMask(panel: IPanel, alpha?: number): void;
        /** 隐藏模态窗口遮罩 */
        hideModalMask(panel: IPanel): void;
        /** 当前是否在显示模态窗口遮罩 */
        isShowingModalMask(panel: IPanel): boolean;
    }
}
declare module "DOMBridge" {
    import IBridge from "engine/bridge/IBridge";
    import { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IMediator from "engine/mediator/IMediator";
    import { IMaskEntity } from "engine/mask/MaskManager";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 基于DOM的表现层桥实现
    */
    export default class DOMBridge implements IBridge {
        /** 提供静态类型常量 */
        static TYPE: string;
        private _initParams;
        private _promptPanel;
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof DOMBridge
         */
        readonly type: string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly htmlWrapper: HTMLElement;
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly root: HTMLElement;
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly bgLayer: HTMLElement;
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly sceneLayer: HTMLElement;
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly panelLayer: HTMLElement;
        /**
         * 获取遮罩容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly maskLayer: HTMLElement;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly topLayer: HTMLElement;
        /**
         * 获取通用提示框
         *
         * @readonly
         * @type {IPromptPanelConstructor}
         * @memberof DOMBridge
         */
        readonly promptClass: IPromptPanelConstructor;
        /**
         * 获取遮罩实体
         *
         * @readonly
         * @type {IMaskEntity}
         * @memberof DOMBridge
         */
        readonly maskEntity: IMaskEntity;
        /**
         * 获取默认弹窗策略
         *
         * @type {IPanelPolicy}
         * @memberof EgretBridge
         */
        defaultPanelPolicy: IPanelPolicy;
        /**
         * 获取默认场景切换策略
         *
         * @type {IScenePolicy}
         * @memberof EgretBridge
         */
        defaultScenePolicy: IScenePolicy;
        constructor(params: IInitParams);
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof DOMBridge
         */
        init(complete: (bridge: IBridge) => void): void;
        /**
         * 判断皮肤是否是DOM显示节点
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是DOM显示节点
         * @memberof DOMBridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 当皮肤被设置时处理皮肤的方法
         *
         * @param {IMediator} mediator 中介者实例
         * @memberof DOMBridge
         */
        handleSkin(mediator: IMediator): void;
        /**
         * 添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @return {Element} 返回被添加的显示对象
         * @memberof DOMBridge
         */
        addChild(parent: Element, target: Element): Element;
        /**
         * 按索引添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {Element} 返回被添加的显示对象
         * @memberof DOMBridge
         */
        addChildAt(parent: Element, target: Element, index: number): Element;
        /**
         * 移除显示对象
         *
         * @param {Element} parent 父容器
         * @param {Element} target 被移除的显示对象
         * @return {Element} 返回被移除的显示对象
         * @memberof DOMBridge
         */
        removeChild(parent: Element, target: Element): Element;
        /**
         * 按索引移除显示
         *
         * @param {Element} parent 父容器
         * @param {number} index 索引
         * @return {Element} 返回被移除的显示对象
         * @memberof DOMBridge
         */
        removeChildAt(parent: Element, index: number): Element;
        /**
         * 移除所有显示对象
         *
         * @param {Element} parent 父容器
         * @memberof DOMBridge
         */
        removeChildren(parent: Element): void;
        /**
         * 获取父容器
         *
         * @param {Element} target 目标对象
         * @returns {Element} 父容器
         * @memberof DOMBridge
         */
        getParent(target: Element): Element;
        /**
         * 获取指定索引处的显示对象
         *
         * @param {Element} parent 父容器
         * @param {number} index 指定父级索引
         * @return {Element} 索引处的显示对象
         * @memberof DOMBridge
         */
        getChildAt(parent: Element, index: number): Element;
        /**
         * 获取显示索引
         *
         * @param {Element} parent 父容器
         * @param {Element} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof DOMBridge
         */
        getChildIndex(parent: Element, target: Element): number;
        /**
         * 通过名称获取显示对象
         *
         * @param {Element} parent 父容器
         * @param {string} name 对象名称
         * @return {Element} 显示对象
         * @memberof DOMBridge
         */
        getChildByName(parent: Element, name: string): Element;
        /**
         * 获取子显示对象数量
         *
         * @param {Element} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof DOMBridge
         */
        getChildCount(parent: Element): number;
        /**
         * 加载资源
         *
         * @param {string[]} assets 资源数组
         * @param {IMediator} mediator 资源列表
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof DOMBridge
         */
        loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
        private _listenerDict;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof DOMBridge
         */
        mapListener(target: EventTarget, type: string, handler: (evt: Event) => void, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof DOMBridge
         */
        unmapListener(target: EventTarget, type: string, handler: (evt: Event) => void, thisArg?: any): void;
    }
    export interface IInitParams {
        /** DOM容器名称或引用，不传递则自动生成一个 */
        container?: string | HTMLElement;
        /** 通用提示框类型 */
        promptClass?: IPromptPanelConstructor;
        /** 遮罩皮肤 */
        maskSkin?: HTMLElement | string;
    }
}
declare module "dom/injector/Injector" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-09
     * @modify date 2017-10-09
     *
     * 负责注入的模块
    */
    export function DOMMediatorClass(cls: IConstructor): any;
}
