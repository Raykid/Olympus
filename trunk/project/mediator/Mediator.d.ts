import Component from '../../kernel/Component';
import IComponentConstructor from '../../kernel/interfaces/IComponentConstructor';
import IBridgeExt from '../bridge/IBridgeExt';
import ICommandConstructor from '../core/command/ICommandConstructor';
import IObservableExt from '../core/observable/IObservableExt';
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "./IMediator";
import { ModuleOpenStatus } from "./IMediatorModulePart";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 *
 * 组件界面中介者基类
*/
/** 规定ModuleManager支持的模块参数类型 */
export declare type ModuleType = IComponentConstructor | IMediator;
/**
 * 注册模块
 *
 * @export
 * @param {string} moduleName 模块名
 * @param {IComponentConstructor} cls 模块类型
 */
export declare function registerModule(moduleName: string, cls: IComponentConstructor): void;
/**
 * 获取模块类型
 *
 * @export
 * @param {string} moduleName 模块名
 * @returns {IComponentConstructor}
 */
export declare function getModule(moduleName: string): IComponentConstructor;
/**
 * 获取模块名
 *
 * @export
 * @param {ModuleType} type 模块实例或模块类型
 * @returns {string} 模块名
 */
export declare function getModuleName(type: ModuleType): string;
export default class Mediator extends Component implements IMediator {
    /********************* 重写部分接口实现 *********************/
    bridge: IBridgeExt;
    protected _children: IMediator[];
    /**
     * 获取所有子中介者
     *
     * @type {IMediator[]}
     * @memberof Mediator
     */
    readonly children: IMediator[];
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
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    open(data?: any): any;
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
    /*********************** 下面是命令功能实现 ***********************/
    protected _observable: IObservableExt;
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
}
