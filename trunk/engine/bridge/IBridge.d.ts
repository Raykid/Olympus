import { IMaskEntity } from "../mask/MaskManager";
import IMediator from "../mediator/IMediator";
import IPanelPolicy from "../panel/IPanelPolicy";
import { IPromptPanelConstructor } from "../panel/IPromptPanel";
import IScenePolicy from "../scene/IScenePolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 *
 * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IBridge<S = any> {
    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof IBridge
     */
    readonly type: string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof IBridge
     */
    readonly htmlWrapper: HTMLElement;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly root: S;
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly stage: S;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly bgLayer: S;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {T}
     * @memberof IBridge
     */
    readonly sceneLayer: S;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly frameLayer: S;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly panelLayer: S;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly maskLayer: S;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {S}
     * @memberof IBridge
     */
    readonly topLayer: S;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof IBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof IBridge
     */
    readonly maskEntity: IMaskEntity<S>;
    /**
     * 获取或设置默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof IBridge
     */
    defaultPanelPolicy: IPanelPolicy<S>;
    /**
     * 获取或设置场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof IBridge
     */
    defaultScenePolicy: IScenePolicy<S>;
    /**
     * 判断传入的skin是否是属于该表现层桥的
     *
     * @param {*} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof IBridge
     */
    isMySkin(skin: any): boolean;
    /**
     * 包装皮肤
     *
     * @param {IMediator} mediator 中介者
     * @param {S} skin 原始皮肤
     * @returns {S} 包装后的皮肤
     * @memberof IBridge
     */
    wrapSkin(mediator: IMediator, skin: S): S;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {S} current 当前皮肤
     * @param {S} target 要替换的皮肤
     * @returns {S} 替换完毕的皮肤
     * @memberof IBridge
     */
    replaceSkin(mediator: IMediator, current: S, target: S): S;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {S} current 当前皮肤
     * @param {S} target 替换的皮肤
     * @memberof IBridge
     */
    syncSkin(current: S, target: S): void;
    /**
     * 创建一个占位符
     *
     * @returns {S}
     * @memberof IBridge
     */
    createPlaceHolder(): S;
    /**
     * 创建一个空显示对象
     *
     * @author Raykid
     * @date 2019-05-20
     * @returns {S}
     * @memberof IBridge
     */
    createEmptyDisplay(): S;
    /**
     * 添加显示
     *
     * @param {S} parent 要添加到的父容器
     * @param {S} target 被添加的显示对象
     * @return {S} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChild(parent: S, target: S): S;
    /**
     * 按索引添加显示
     *
     * @param {S} parent 要添加到的父容器
     * @param {S} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {S} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChildAt(parent: S, target: S, index: number): S;
    /**
     * 移除显示对象
     *
     * @param {S} parent 父容器
     * @param {S} target 被移除的显示对象
     * @return {S} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChild(parent: S, target: S): S;
    /**
     * 按索引移除显示
     *
     * @param {S} parent 父容器
     * @param {number} index 索引
     * @return {S} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChildAt(parent: S, index: number): S;
    /**
     * 移除所有显示对象
     *
     * @param {S} parent 父容器
     * @memberof IBridge
     */
    removeChildren(parent: S): void;
    /**
     * 获取父容器
     *
     * @param {S} target 指定显示对象
     * @return {S} 父容器
     * @memberof IBridge
     */
    getParent(target: S): S;
    /**
     * 获取指定索引处的显示对象
     *
     * @param {S} parent 父容器
     * @param {number} index 指定父级索引
     * @return {S} 索引处的显示对象
     * @memberof IBridge
     */
    getChildAt(parent: S, index: number): S;
    /**
     * 获取显示索引
     *
     * @param {S} parent 父容器
     * @param {S} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof IBridge
     */
    getChildIndex(parent: S, target: S): number;
    /**
     * 通过名称获取显示对象
     *
     * @param {S} parent 父容器
     * @param {string} name 对象名称
     * @return {S} 显示对象
     * @memberof IBridge
     */
    getChildByName(parent: S, name: string): S;
    /**
     * 获取子显示对象数量
     *
     * @param {S} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof IBridge
     */
    getChildCount(parent: S): number;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof IBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {S} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    mapListener(target: S, type: string, handler: Function, thisArg?: any): void;
    /**
     * 注销监听事件
     *
     * @param {S} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    unmapListener(target: S, type: string, handler: Function, thisArg?: any): void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {S} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    wrapBindFor(target: S, rendererHandler: (key?: any, value?: any, renderer?: any) => void): any;
    /**
     * 为列表显示对象赋值
     *
     * @param {S} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    valuateBindFor(target: S, datas: any, memento: any): void;
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     *
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof IBridge
     */
    init?(complete: (bridge: IBridge<S>) => void): void;
}
