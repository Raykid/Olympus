import Dictionary from '../utils/Dictionary';
import ComponentStatus from './enums/ComponentStatus';
import IBridge from './interfaces/IBridge';
import IComponent from './interfaces/IComponent';
import IMessage from './interfaces/IMessage';
import IObservable from './interfaces/IObservable';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-05
 * @modify date 2018-07-05
 *
 * Olympus组件，具有MVVM绑定功能
*/
export default class Component implements IComponent {
    constructor(skin?: any);
    /******************** 下面是组件的基础接口 ********************/
    /**
     * 表现层桥
     *
     * @type {IBridge}
     * @memberof Component
     */
    bridge: IBridge;
    private _data;
    /**
     * 打开时传递的data对象
     *
     * @type {*}
     * @memberof Component
     */
    data: any;
    /**
     * 皮肤
     *
     * @type {*}
     * @memberof Component
     */
    skin: any;
    private oriSkin;
    private _listeners;
    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
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
     * 注销所有注册在当前组件上的事件监听
     *
     * @memberof Mediator
     */
    unmapAllListeners(): void;
    /******************** 下面是组件的绑定功能实现 ********************/
    protected _viewModel: any;
    /**
     * 获取或设置ViewModel
     *
     * @type {*}
     * @memberof Mediator
     */
    viewModel: any;
    /**
     * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
     *
     * @type {Dictionary<any, any>[]}
     * @memberof Mediator
     */
    bindTargets: Dictionary<any, any>[];
    /******************** 下面是组件的组件树接口 ********************/
    private _disposeDict;
    private disposeChild(comp, oriDispose);
    /**
     * 父组件
     *
     * @type {IComponent}
     * @memberof Component
     */
    parent: IComponent;
    /**
     * 获取根级组件（当做模块直接被打开的组件）
     *
     * @type {IComponent}
     * @memberof Component
     */
    readonly root: IComponent;
    protected _children: IComponent[];
    /**
     * 获取所有子组件
     *
     * @type {IComponent[]}
     * @memberof Component
     */
    readonly children: IComponent[];
    /**
     * 托管子组件
     *
     * @param {IComponent} comp 要托管的组件
     * @memberof Component
     */
    delegate(comp: IComponent): void;
    /**
     * 取消托管子组件
     *
     * @param {IComponent} comp 要取消托管的组件
     * @memberof Component
     */
    undelegate(comp: IComponent): void;
    /**
     * 判断指定组件是否包含在该组件里（判断范围包括当前组件和子孙级组件）
     *
     * @param {IComponent} comp 要判断的组件
     * @returns {boolean}
     * @memberof Component
     */
    contains(comp: IComponent): boolean;
    /******************** 下面是组件的消息功能实现 ********************/
    protected _observable: IObservable;
    /**
     * 暴露IObservable
     *
     * @readonly
     * @type {IObservable}
     * @memberof Mediator
     */
    readonly observable: IObservable;
    /**
     * 派发消息
     *
     * @param {IMessage} msg 内核消息实例
     * @memberof Mediator
     */
    dispatch(msg: IMessage): void;
    /**
     * 派发消息，消息会转变为Message类型对象
     *
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Mediator
     */
    dispatch(type: string, ...params: any[]): void;
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    /******************** 下面是组件的打开关闭功能实现 ********************/
    protected _status: ComponentStatus;
    /**
     * 获取组件状态
     *
     * @readonly
     * @type {ComponentStatus}
     * @memberof Mediator
     */
    readonly status: ComponentStatus;
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data] 开启数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    open(data?: any): any;
    protected __beforeOnOpen(data?: any): void;
    protected __afterOnOpen(data?: any): void;
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {*} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    close(data?: any): any;
    protected __beforeOnClose(data?: any): void;
    protected __afterOnClose(data?: any): void;
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    onOpen(data?: any): any;
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof Mediator
     */
    onClose(data?: any): void;
    /******************** 下面是组件的销毁功能实现 ********************/
    /**
     * 获取组件是否已被销毁
     *
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    readonly disposed: boolean;
    /**
     * 销毁组件
     *
     * @memberof Mediator
     */
    dispose(): void;
    /**
     * 当销毁时调用
     *
     * @memberof Mediator
     */
    onDispose(): void;
}
