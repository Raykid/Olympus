/// <reference path="Olympus.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/egret/egret.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/eui/eui.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/res/res.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/tween/tween.d.ts" />
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
declare module "egret/mediator/Mediator" {
    import IMessage from "core/message/IMessage";
    import IMediator from "engine/mediator/IMediator";
    import IBridge from "engine/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * 由于Egret EUI界面的特殊性，需要一个Mediator的基类来简化业务逻辑
    */
    export default class Mediator extends eui.Component implements IMediator {
        /**
         * 表现层桥
         *
         * @type {IBridge}
         * @memberof Mediator
         */
        bridge: IBridge;
        /**
         * 皮肤
         *
         * @type {*}
         * @memberof Mediator
         */
        skin: any;
        private _disposed;
        /**
         * 获取中介者是否已被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Mediator
         */
        readonly disposed: boolean;
        constructor(skin?: any, callProxy?: boolean);
        private _skinName;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        /**
         * 列出中介者所需的资源数组，可重写
         *
         * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
         * @memberof Mediator
         */
        listAssets(): string[];
        /**
         * 加载从listAssets中获取到的所有资源，完毕后调用回调函数
         *
         * @param {(err?:Error)=>void} handler 完毕后的回调函数，有错误则给出err，没有则不给
         * @memberof Mediator
         */
        loadAssets(handler: (err?: Error) => void): void;
        /**
         * 打开
         *
         * @param {*} [data]
         * @returns {*}
         * @memberof Mediator
         */
        open(data?: any): any;
        /**
         * 关闭
         *
         * @param {*} [data]
         * @returns {*}
         * @memberof Mediator
         */
        close(data?: any): any;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        unmapAllListeners(): void;
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 销毁中介者
         *
         * @memberof Mediator
         */
        dispose(): void;
    }
}
declare module "egret/panel/PanelMediator" {
    import Mediator from "egret/mediator/Mediator";
    import IPanel from "engine/panel/IPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * Egret的弹窗中介者
    */
    export default class PanelMediator extends Mediator implements IPanel {
        /**
         * 弹出策略
         *
         * @type {IPanelPolicy}
         * @memberof PanelMediator
         */
        policy: IPanelPolicy;
        constructor(skin?: any, policy?: IPanelPolicy);
        /**
         * 弹出当前弹窗（等同于调用PanelManager.pop方法）
         *
         * @param {*} [data] 数据
         * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
         * @param {{x:number, y:number}} [from] 弹出点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        open(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): IPanel;
        /**
         * 关闭当前弹窗（等同于调用PanelManager.drop方法）
         *
         * @param {*} [data] 数据
         * @param {{x:number, y:number}} [to] 关闭点坐标
         * @returns {IPanel} 弹窗本体
         * @memberof PanelMediator
         */
        close(data?: any, to?: {
            x: number;
            y: number;
        }): IPanel;
        /** 在弹出前调用的方法 */
        onBeforePop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出后调用的方法 */
        onAfterPop(data?: any, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭前调用的方法 */
        onBeforeDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭后调用的方法 */
        onAfterDrop(data?: any, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "egret/scene/SceneMediator" {
    import IScene from "engine/scene/IScene";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import Mediator from "egret/mediator/Mediator";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-21
     * @modify date 2017-09-21
     *
     * Egret的场景中介者
    */
    export default class SceneMediator extends Mediator implements IScene {
        /**
         * 切换策略
         *
         * @type {IScenePolicy}
         * @memberof SceneMediator
         */
        policy: IScenePolicy;
        constructor(skin?: any, policy?: IScenePolicy);
        /**
         * 打开当前场景（相当于调用SceneManager.push方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        open(data?: any): IScene;
        /**
         * 关闭当前场景（相当于调用SceneManager.pop方法）
         *
         * @param {*} [data] 数据
         * @returns {IScene} 场景本体
         * @memberof SceneMediator
         */
        close(data?: any): IScene;
        /**
         * 切入场景开始前调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onBeforeIn(fromScene: IScene, data?: any): void;
        /**
         * 切入场景开始后调用
         * @param fromScene 从哪个场景切入
         * @param data 切场景时可能的参数
         */
        onAfterIn(fromScene: IScene, data?: any): void;
        /**
         * 切出场景开始前调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onBeforeOut(toScene: IScene, data?: any): void;
        /**
         * 切出场景开始后调用
         * @param toScene 要切入到哪个场景
         * @param data 切场景时可能的参数
         */
        onAfterOut(toScene: IScene, data?: any): void;
    }
}
declare module "EgretBridge" {
    import IBridge from "engine/bridge/IBridge";
    import RenderMode from "egret/RenderMode";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * Egret的表现层桥实现
    */
    export default class EgretBridge implements IBridge {
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
        w: any;
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
        private _topLayer;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof EgretBridge
         */
        readonly topLayer: egret.DisplayObjectContainer;
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
         * @param {string[]} assets 资源列表
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof EgretBridge
         */
        loadAssets(assets: string[], handler: (err?: Error) => void): void;
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
    }
}
