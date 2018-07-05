import { IPromptPanelConstructor } from "../panel/IPromptPanel";
import IPanelPolicy from "../panel/IPanelPolicy";
import IScenePolicy from "../scene/IScenePolicy";
import IMediator from "../mediator/IMediator";
import { IMaskEntity } from "../mask/MaskManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IBridge
{
    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof IBridge
     */
    readonly type:string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof IBridge
     */
    readonly htmlWrapper:HTMLElement;
    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly root:any;
    /**
     * 获取舞台引用
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly stage:any;
    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly bgLayer:any;
    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly sceneLayer:any;
    /**
     * 获取框架容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly frameLayer:any;
    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly panelLayer:any;
    /**
     * 获取遮罩容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly maskLayer:any;
    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly topLayer:any;
    /**
     * 获取通用提示框
     * 
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof IBridge
     */
    readonly promptClass:IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     * 
     * @readonly
     * @type {IMaskEntity}
     * @memberof IBridge
     */
    readonly maskEntity:IMaskEntity;
    /**
     * 获取或设置默认弹窗策略
     * 
     * @type {IPanelPolicy}
     * @memberof IBridge
     */
    defaultPanelPolicy:IPanelPolicy;
    /**
     * 获取或设置场景切换策略
     * 
     * @type {IScenePolicy}
     * @memberof IBridge
     */
    defaultScenePolicy:IScenePolicy;
    /**
     * 判断传入的skin是否是属于该表现层桥的
     * 
     * @param {*} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof IBridge
     */
    isMySkin(skin:any):boolean;
    /**
     * 包装皮肤
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {*} 包装后的皮肤
     * @memberof IBridge
     */
    wrapSkin(mediator:IMediator, skin:any):any;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof IBridge
     */
    replaceSkin(mediator:IMediator, current:any, target:any):any;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     * 
     * @param {*} current 当前皮肤
     * @param {*} target 替换的皮肤
     * @memberof IBridge
     */
    syncSkin(current:any, target:any):void;
    /**
     * 创建一个空的显示对象
     * 
     * @returns {*} 
     * @memberof IBridge
     */
    createEmptyDisplay():any;
    /**
     * 添加显示
     * 
     * @param {*} parent 要添加到的父容器
     * @param {*} target 被添加的显示对象
     * @return {*} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChild(parent:any, target:any):any;
    /**
     * 按索引添加显示
     * 
     * @param {*} parent 要添加到的父容器
     * @param {*} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {*} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChildAt(parent:any, target:any, index:number):any;
    /**
     * 移除显示对象
     * 
     * @param {*} parent 父容器
     * @param {*} target 被移除的显示对象
     * @return {*} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChild(parent:any, target:any):any;
    /**
     * 按索引移除显示
     * 
     * @param {*} parent 父容器
     * @param {number} index 索引
     * @return {*} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChildAt(parent:any, index:number):any;
    /**
     * 移除所有显示对象
     * 
     * @param {*} parent 父容器
     * @memberof IBridge
     */
    removeChildren(parent:any):void;
    /**
     * 获取父容器
     * 
     * @param {*} target 指定显示对象
     * @return {*} 父容器
     * @memberof IBridge
     */
    getParent(target:any):any;
    /**
     * 获取指定索引处的显示对象
     * 
     * @param {*} parent 父容器
     * @param {number} index 指定父级索引
     * @return {*} 索引处的显示对象
     * @memberof IBridge
     */
    getChildAt(parent:any, index:number):any;
    /**
     * 获取显示索引
     * 
     * @param {*} parent 父容器
     * @param {*} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof IBridge
     */
    getChildIndex(parent:any, target:any):number;
    /**
     * 通过名称获取显示对象
     * 
     * @param {*} parent 父容器
     * @param {string} name 对象名称
     * @return {*} 显示对象
     * @memberof IBridge
     */
    getChildByName(parent:any, name:string):any;
    /**
     * 获取子显示对象数量
     * 
     * @param {*} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof IBridge
     */
    getChildCount(parent:any):number;
    /**
     * 加载资源
     * 
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof IBridge
     */
    loadAssets(assets:string[], mediator:IMediator, handler:(err?:Error)=>void):void;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    mapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    unmapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     * 
     * @param {*} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    wrapBindFor(target:any, rendererHandler:(key?:any, value?:any, renderer?:any)=>void):any;
    /**
     * 为列表显示对象赋值
     * 
     * @param {*} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    valuateBindFor(target:any, datas:any, memento:any):void;
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * 
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof IBridge
     */
    init?(complete:(bridge:IBridge)=>void):void;
}