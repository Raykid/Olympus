import IMessage from "../../core/message/IMessage";
import IModuleMediator from "./IModuleMediator";
import IBridge from "../bridge/IBridge";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import IObservable from "../../core/observable/IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 *
 * 组件界面中介者基类
*/
export default class Mediator implements IModuleMediator {
    /**
     * 表现层桥
     *
     * @type {IBridge}
     * @memberof Mediator
     */
    bridge: IBridge;
    private _viewModel;
    /**
     * 获取或设置ViewModel
     *
     * @type {*}
     * @memberof Mediator
     */
    viewModel: any;
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
    private _dependModuleInstance;
    /**
     * 所属的模块引用，需要配合@DelegateMediator使用
     *
     * @readonly
     * @type {IModule}
     * @memberof IMediator
     */
    readonly dependModuleInstance: IModule;
    private _dependModule;
    /**
     * 所属的模块类型，需要配合@DelegateMediator使用
     *
     * @readonly
     * @type {IModuleConstructor}
     * @memberof IMediator
     */
    readonly dependModule: IModuleConstructor;
    private _data;
    /**
     * 打开时传递的data对象
     *
     * @readonly
     * @type {*}
     * @memberof Mediator
     */
    readonly data: any;
    constructor(skin?: any);
    /**
     * 列出中介者所需的资源数组，可重写
     * 但如果Mediator没有被托管在Module中则该方法不应该被重写，否则可能会有问题
     *
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    listAssets(): string[];
    /**
     * 加载从listAssets中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @returns {void}
     * @memberof Mediator
     */
    loadAssets(handler: (err?: Error) => void): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    onLoadAssets(err?: Error): void;
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data]
     * @returns {*}
     * @memberof Mediator
     */
    open(data?: any): any;
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {*} [data]
     * @returns {*}
     * @memberof Mediator
     */
    close(data?: any): any;
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @memberof Mediator
     */
    onOpen(data?: any): void;
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @memberof Mediator
     */
    onClose(data?: any): void;
    private _listeners;
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
    /*********************** 下面是模块消息系统 ***********************/
    /**
     * 暴露IObservable
     *
     * @readonly
     * @type {IObservable}
     * @memberof Mediator
     */
    readonly observable: IObservable;
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    listenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    unlistenModule(type: IConstructor | string, handler: Function, thisArg?: any): void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IModuleObservable
     */
    mapCommandModule(type: string, cmd: ICommandConstructor): void;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof IModuleObservable
     */
    unmapCommandModule(type: string, cmd: ICommandConstructor): void;
    /**
     * 派发消息
     *
     * @param {IMessage} msg 内核消息实例
     * @memberof IModuleObservable
     */
    dispatchModule(msg: IMessage): void;
    /**
     * 派发消息，消息会转变为Message类型对象
     *
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof IModuleObservable
     */
    dispatchModule(type: string, ...params: any[]): void;
    /**
     * 销毁中介者
     *
     * @memberof Mediator
     */
    dispose(): void;
}
