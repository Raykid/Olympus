import IMessage from "../../core/message/IMessage";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IModuleMediator from "../mediator/IModuleMediator";
import IModuleConstructor from "./IModuleConstructor";
import IModule from "./IModule";
import IObservable from "../../core/observable/IObservable";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 *
 * 模块基类
*/
export default abstract class Module implements IModule {
    /**
     * 打开时传入的参数
     *
     * @type {*}
     * @memberof Module
     */
    data: any;
    /**
     * 模块初始消息的返回数据
     *
     * @type {ResponseData[]}
     * @memberof Module
     */
    responses: ResponseData[];
    private _disposed;
    /**
     * 获取是否已被销毁
     *
     * @readonly
     * @type {boolean}
     * @memberof Module
     */
    readonly disposed: boolean;
    /**
     * 背景音乐URL
     *
     * @type {string}
     * @memberof Module
     */
    bgMusic: string;
    /**
     * 所属的模块引用
     *
     * @readonly
     * @type {IModule}
     * @memberof IMediator
     */
    readonly dependModuleInstance: IModule;
    /**
     * 所属的模块类型
     *
     * @readonly
     * @type {IModuleConstructor}
     * @memberof IMediator
     */
    readonly dependModule: IModuleConstructor;
    private _mediators;
    /**
     * 获取所有已托管的中介者
     *
     * @returns {IModuleMediator[]} 已托管的中介者
     * @memberof Module
     */
    readonly delegatedMediators: IModuleMediator[];
    private _disposeDict;
    private disposeMediator(mediator);
    /**
     * 托管中介者
     *
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    delegateMediator(mediator: IModuleMediator): void;
    /**
     * 取消托管中介者
     *
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    undelegateMediator(mediator: IModuleMediator): void;
    /**
     * 判断指定中介者是否包含在该模块里
     *
     * @param {IModuleMediator} mediator 要判断的中介者
     * @returns {boolean} 是否包含在该模块里
     * @memberof Module
     */
    constainsMediator(mediator: IModuleMediator): boolean;
    /**
     * 列出模块所需CSS资源URL，可以重写
     *
     * @returns {string[]} CSS资源列表
     * @memberof Module
     */
    listStyleFiles(): string[];
    /**
     * 列出模块所需JS资源URL，可以重写
     *
     * @returns {string[]} js资源列表
     * @memberof Module
     */
    listJsFiles(): string[];
    /**
     * 列出模块初始化请求，可以重写
     *
     * @returns {RequestData[]} 模块的初始化请求列表
     * @memberof Module
     */
    listInitRequests(): RequestData[];
    /**
     * 当模块资源加载完毕后调用
     *
     * @param {Error} [err] 任何一个Mediator资源加载出错会给出该错误对象，没错则不给
     * @memberof Module
     */
    onLoadAssets(err?: Error): void;
    /**
     * 模块打开方法，通常由ModuleManager调用
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    open(data?: any): void;
    /**
     * 打开模块时调用，可以重写
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    onOpen(data?: any): void;
    /**
     * 模块关闭方法，通常由ModuleManager调用
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    close(data?: any): void;
    /**
     * 关闭模块时调用，可以重写
     *
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    onClose(data?: any): void;
    /**
     * 其他模块被关闭时调用，可以重写
     *
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    onWakeUp(from: IModuleConstructor | undefined, data?: any): void;
    /**
     * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
     *
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    onActivate(from: IModuleConstructor | undefined, data?: any): void;
    /**
     * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
     *
     * @param {IModuleConstructor|undefined} to 要切换到哪个模块
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    onDeactivate(to: IModuleConstructor | undefined, data?: any): void;
    /*********************** 下面是模块消息系统 ***********************/
    private _observable;
    /**
     * 暴露IObservable接口
     *
     * @readonly
     * @type {IObservable}
     * @memberof Module
     */
    readonly observable: IObservable;
    /**
     * 获取到父级IObservable
     *
     * @type {IObservable}
     * @memberof Module
     */
    readonly parent: IObservable;
    /**
     * 派发消息
     *
     * @param {IMessage} msg 内核消息实例
     * @memberof Module
     */
    dispatch(msg: IMessage): void;
    /**
     * 派发消息，消息会转变为Message类型对象
     *
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Module
     */
    dispatch(type: string, ...params: any[]): void;
    /**
     * 监听消息
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Module
     */
    listen(type: IConstructor | string, handler: Function, thisArg?: any): void;
    /**
     * 移除消息监听
     *
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Module
     */
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any): void;
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Module
     */
    mapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Module
     */
    unmapCommand(type: string, cmd: ICommandConstructor): void;
    /**
     * 销毁模块，可以重写
     *
     * @memberof Module
     */
    dispose(): void;
    /**
     * 当销毁时调用
     *
     * @memberof Mediator
     */
    onDispose(): void;
}
