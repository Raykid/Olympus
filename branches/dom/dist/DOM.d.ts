/// <reference path="../../../trunk/dist/Olympus.d.ts" />
declare module "dom/mask/MaskEntity" {
    import { IMaskEntity } from "engine/mask/MaskManager";
    import IPanel from "engine/panel/IPanel";
    import IMaskData from "engine/mask/IMaskData";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-25
     * @modify date 2017-10-25
     *
     * DOM遮罩实现
    */
    export default class MaskEntityImpl implements IMaskEntity {
        private _showing;
        loadingSkin: HTMLElement;
        maskData: MaskData;
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
    export interface MaskData extends IMaskData {
        loadingSkin?: HTMLElement | string;
    }
}
declare module "dom/utils/SkinUtil" {
    import IMediator from "engine/mediator/IMediator";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-26
     * @modify date 2017-10-26
     *
     * 为DOM提供皮肤转换的工具集
    */
    /**
     * 为中介者包装皮肤
     *
     * @export
     * @param {IMediator} mediator 中介者
     * @param {(HTMLElement|string|string[])} skin 皮肤，可以是HTMLElement，也可以是皮肤字符串，也可以是皮肤模板地址或地址数组
     * @returns {HTMLElement} 皮肤的HTMLElement形式，可能会稍后再填充内容，如果想在皮肤加载完毕后再拿到皮肤请使用complete参数
     */
    export function wrapSkin(mediator: IMediator, skin: HTMLElement | string | string[]): HTMLElement;
    /**
     * 将from中的所有拥有id属性的节点引用复制到to对象上
     *
     * @export
     * @param {HTMLElement} from 复制源DOM节点
     * @param {*} to 复制目标对象
     */
    export function copyRef(from: HTMLElement, to: any): void;
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
    export function DOMMediatorClass(...skins: string[]): ClassDecorator;
}
declare module "DOMBridge" {
    import IBridge from "engine/bridge/IBridge";
    import { IPromptPanelConstructor } from "engine/panel/IPromptPanel";
    import IPanelPolicy from "engine/panel/IPanelPolicy";
    import IScenePolicy from "engine/scene/IScenePolicy";
    import IMediator from "engine/mediator/IMediator";
    import { IMaskEntity } from "engine/mask/MaskManager";
    import { MaskData } from "dom/mask/MaskEntity";
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
         * 获取舞台引用，DOM的舞台指向root所在的Document对象
         *
         * @readonly
         * @type {Document}
         * @memberof DOMBridge
         */
        readonly stage: Document;
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
         * 获取框架容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof DOMBridge
         */
        readonly frameLayer: HTMLElement;
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
         * 创建一个空的显示对象
         *
         * @returns {HTMLElement}
         * @memberof DOMBridge
         */
        createEmptyDisplay(): HTMLElement;
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
        /**
         * 为绑定的列表显示对象包装一个渲染器创建回调
         *
         * @param {HTMLElement} target BindFor指令指向的显示对象
         * @param {(key?:any, value?:any, renderer?:HTMLElement)=>void} handler 渲染器创建回调
         * @returns {*} 返回一个备忘录对象，会在赋值时提供
         * @memberof IBridge
         */
        wrapBindFor(target: HTMLElement, handler: (key?: any, value?: any, renderer?: HTMLElement) => void): any;
        /**
         * 为列表显示对象赋值
         *
         * @param {HTMLElement} target BindFor指令指向的显示对象
         * @param {*} datas 数据集合
         * @param {*} memento wrapBindFor返回的备忘录对象
         * @memberof IBridge
         */
        valuateBindFor(target: HTMLElement, datas: any, memento: any): void;
    }
    export interface IInitParams {
        /** DOM容器名称或引用，不传递则自动生成一个 */
        container?: string | HTMLElement;
        /** 通用提示框类型 */
        promptClass?: IPromptPanelConstructor;
        /** 遮罩皮肤 */
        maskData?: MaskData;
    }
}
