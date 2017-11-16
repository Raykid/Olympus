import IHasBridge from "../bridge/IHasBridge";
import IOpenClose from "../../core/interfaces/IOpenClose";
import IDisposable from "../../core/interfaces/IDisposable";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 界面中介者接口
*/
export default interface IMediator extends IHasBridge, IOpenClose, IDisposable
{
    /**
     * 获取中介者是否已被销毁
     * 
     * @memberof IMediator
     */
    readonly disposed:boolean;

    /**
     * 打开时传递的data对象
     * 
     * @memberof IMediator
     */
    readonly data:any;

    /**
     * ViewModel引用
     * 
     * @type {*}
     * @memberof IMediator
     */
    readonly viewModel:any;
    
    /**
     * 皮肤
     * 
     * @readonly
     * @type {*}
     * @memberof IMediator
     */
    skin:any;

    /**
     * 当打开时调用
     * 
     * @param {*} [data] 可能的打开参数
     * @memberof IMediator
     */
    onOpen(data?:any):void;

    /**
     * 当关闭时调用
     * 
     * @param {*} [data] 可能的关闭参数
     * @memberof IMediator
     */
    onClose(data?:any):void;

    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IMediator
     */
    mapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IMediator
     */
    unmapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    
    /**
     * 注销所有注册在当前中介者上的事件监听
     * 
     * @memberof IMediator
     */
    unmapAllListeners():void;
}