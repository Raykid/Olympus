import IBridge from "olympus-r/kernel/interfaces/IBridge";
import IComponent from 'olympus-r/kernel/interfaces/IComponent';
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
    protected _initParams: IInitParams;
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
    readonly wrapper: HTMLElement;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly root: HTMLElement;
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
     * @param {HTMLElement|string|string[]} skin 皮肤对象
     * @returns {boolean} 是否是DOM显示节点
     * @memberof DOMBridge
     */
    isMySkin(skin: HTMLElement | string | string[]): boolean;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {HTMLElement} current 当前皮肤
     * @param {HTMLElement} target 替换的皮肤
     * @memberof DOMBridge
     */
    syncSkin(current: HTMLElement, target: HTMLElement): void;
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} comp 组件
     * @param {HTMLElement|string|string[]} skin 原始HTMLElement节点
     * @returns {HTMLElement} 包装后的HTMLElement节点
     * @memberof DOMBridge
     */
    wrapSkin(comp: IComponent, skin: HTMLElement | string | string[]): HTMLElement;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} comp 组件
     * @param {*} current 当前皮肤
     * @param {HTMLElement|string|string[]} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof DOMBridge
     */
    replaceSkin(comp: IComponent, current: HTMLElement, target: HTMLElement | string | string[]): any;
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
    private _listenerDict;
    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
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
}
