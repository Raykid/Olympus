import IHasBridge from "../bridge/IHasBridge";
import IOpenClose from "../../core/interfaces/IOpenClose";
import IDisposable from "../../core/interfaces/IDisposable";

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
     * @returns {boolean} 是否已被销毁
     * @memberof IMediator
     */
    readonly disposed:boolean;
    
    /**
     * 皮肤
     * 
     * @readonly
     * @type {*}
     * @memberof IMediator
     */
    skin:any;

    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof IMediator
     */
    listAssets():string[];
    
    /**
     * 加载从listAssets中获取到的所有资源，完毕后调用回调函数
     * 
     * @param {(err?:Error)=>void} handler 完毕后的回调函数，有错误则给出err，没有则不给
     * @memberof IMediator
     */
    loadAssets(handler:(err?:Error)=>void):void;

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