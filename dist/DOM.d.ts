/// <reference path="Olympus.d.ts" />
declare module "DOMBridge" {
    import IBridge from "engine/bridge/IBridge";
    import IPromptPanel, { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IMediator from "engine/mediator/IMediator";
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
         * @type {IPromptPanel}
         * @memberof DOMBridge
         */
        readonly promptPanel: IPromptPanel;
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
         * @param {IMediator} mediator 资源列表
         * @param {(err?:Error)=>void} handler 回调函数
         * @memberof DOMBridge
         */
        loadAssets(mediator: IMediator, handler: (err?: Error) => void): void;
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
