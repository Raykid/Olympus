import ICommandConstructor from "../../core/command/ICommandConstructor";
import IMessage from "../../core/message/IMessage";
import IObservable from "../../core/observable/IObservable";
import Dictionary from "../../utils/Dictionary";
import IBridge from "../bridge/IBridge";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "./IMediator";
import IMediatorConstructor from "./IMediatorConstructor";
import { ModuleOpenStatus } from "./IMediatorModulePart";
import MediatorStatus from "./MediatorStatus";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 *
 * 组件界面中介者基类
*/
/** 规定ModuleManager支持的模块参数类型 */
export declare type ModuleType = IMediatorConstructor | IMediator;
/**
 * 注册模块
 *
 * @export
 * @param {string} moduleName 模块名
 * @param {IMediatorConstructor} cls 模块类型
 */
export declare function registerModule(moduleName: string, cls: IMediatorConstructor): void;
/**
 * 获取模块类型
 *
 * @export
 * @param {string} moduleName 模块名
 * @returns {IMediatorConstructor}
 */
export declare function getModule(moduleName: string): IMediatorConstructor;
/**
 * 获取模块名
 *
 * @export
 * @param {ModuleType} type 模块实例或模块类型
 * @returns {string} 模块名
 */
export declare function getModuleName(type: ModuleType): string;
export default class Mediator implements IMediator {
    private _status;
    /**
     * 获取中介者状态
     *
     * @readonly
     * @type {MediatorStatus}
     * @memberof Mediator
     */
    readonly status: MediatorStatus;
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
     * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
     *
     * @type {Dictionary<any, any>[]}
     * @memberof Mediator
     */
    bindTargets: Dictionary<any, any>[];
    /**
     * 皮肤
     *
     * @type {*}
     * @memberof Mediator
     */
    skin: any;
    private oriSkin;
    /**
     * 获取中介者是否已被销毁
     *
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    readonly disposed: boolean;
    private _data;
    /**
     * 打开时传递的data对象
     *
     * @type {*}
     * @memberof Mediator
     */
    data: any;
    private _openMask;
    /**
     * 开启时是否触发全屏遮罩，防止用户操作，设置操作会影响所有子孙中介者。默认是true
     *
     * @type {boolean}
     * @memberof Mediator
     */
    openMask: boolean;
    private _responses;
    /**
     * 模块初始消息的返回数据
     *
     * @type {ResponseData[]}
     * @memberof Mediator
     */
    responses: ResponseData[];
    private _moduleName;
    /**
     * 获取模块名
     *
     * @readonly
     * @type {string}
     * @memberof Mediator
     */
    readonly moduleName: string;
    /**
     * 模块打开结果回调函数，由moduleManager调用，不要手动调用
     *
     * @memberof Mediator
     */
    moduleOpenHandler: (status: ModuleOpenStatus, err?: Error) => void;
    constructor(skin?: any);
    /**
     * 加载从listAssets中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @returns {void}
     * @memberof Mediator
     */
    loadAssets(handler: (err?: Error) => void): void;
    /**
     * 加载从listStyleFiles中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadStyleFiles(handler: (err?: Error) => void): void;
    /**
     * 加载从listJsFiles中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadJsFiles(handler: (err?: Error) => void): void;
    /**
     * 发送从listInitRequests中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    sendInitRequests(handler: (err?: Error) => void): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    onLoadAssets(err?: Error): void;
    /**
     * 当所需CSS加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    onLoadStyleFiles(err?: Error): void;
    /**
     * 当所需js加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    onLoadJsFiles(err?: Error): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof Mediator
     */
    onSendInitRequests(err?: Error): void;
    /**
     * 当获取到所有初始化请求返回时调用，可以通过返回一个true来阻止模块的打开
     *
     * @param {ResponseData[]} responses 返回结构数组
     * @returns {boolean} 返回true则表示停止模块打开
     * @memberof Mediator
     */
    onGetResponses(responses: ResponseData[]): boolean;
    /**
     * 打开，为了实现IOpenClose接口
     *
     * @param {*} [data] 开启数据
     * @param {...any[]} args 其他数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    open(data?: any, ...args: any[]): any;
    protected __beforeOnOpen(data?: any, ...args: any[]): void;
    protected __afterOnOpen(data?: any, ...args: any[]): void;
    /**
     * 关闭，为了实现IOpenClose接口
     *
     * @param {*} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    close(data?: any, ...args: any[]): any;
    protected __beforeOnClose(data?: any, ...args: any[]): void;
    protected __afterOnClose(data?: any, ...args: any[]): void;
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    onOpen(data?: any, ...args: any[]): any;
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof Mediator
     */
    onClose(data?: any, ...args: any[]): void;
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
    private _disposeDict;
    private disposeChild(mediator, oriDispose);
    /**
     * 父中介者
     *
     * @type {IMediator}
     * @memberof Mediator
     */
    parent: IMediator;
    /**
     * 获取根级中介者（当做模块直接被打开的中介者）
     *
     * @type {IMediator}
     * @memberof IMediator
     */
    readonly root: IMediator;
    protected _children: IMediator[];
    /**
     * 获取所有子中介者
     *
     * @type {IMediator[]}
     * @memberof Mediator
     */
    readonly children: IMediator[];
    /**
     * 托管子中介者
     *
     * @param {IMediator} mediator 要托管的中介者
     * @memberof Mediator
     */
    delegateMediator(mediator: IMediator): void;
    /**
     * 取消托管子中介者
     *
     * @param {IMediator} mediator 要取消托管的中介者
     * @memberof Mediator
     */
    undelegateMediator(mediator: IMediator): void;
    /**
     * 判断指定中介者是否包含在该中介者里（判断范围包括当前中介者和子孙级中介者）
     *
     * @param {IMediator} mediator 要判断的中介者
     * @returns {boolean}
     * @memberof Mediator
     */
    containsMediator(mediator: IMediator): boolean;
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    wakeUp(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到前台时调用（与wakeUp的区别是open时activate会触发，但wakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    activate(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    deactivate(to: IMediator | undefined, data?: any): void;
    /**
     * 列出中介者所需的资源数组，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    listAssets(): string[];
    /**
     * 列出所需CSS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    listStyleFiles(): string[];
    /**
     * 列出所需JS资源URL，可重写
     *
     * @returns {string[]}
     * @memberof Mediator
     */
    listJsFiles(): string[];
    /**
     * 列出模块初始化请求，可重写
     *
     * @returns {RequestData[]}
     * @memberof Mediator
     */
    listInitRequests(): RequestData[];
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    onWakeUp(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    onActivate(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof Mediator
     */
    onDeactivate(to: IMediator | undefined, data?: any): void;
    /*********************** 下面是模块消息系统 ***********************/
    private _observable;
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
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Mediator
     */
    mapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Mediator
     */
    unmapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 销毁中介者
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
