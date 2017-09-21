import IHasBridge from "../bridge/IHasBridge";
import IDisposable from "../../core/interfaces/IDisposable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 界面中介者接口
*/
export default interface IMediator extends IHasBridge, IDisposable
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