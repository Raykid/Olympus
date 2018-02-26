import IHasBridge from "../bridge/IHasBridge";
import IOpenClose from "../../core/interfaces/IOpenClose";
import IDisposable from "../../core/interfaces/IDisposable";
import MediatorStatus from "./MediatorStatus";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 * 
 * 该接口规定了中介者具有的基础功能
*/
export default interface IMediatorBasicPart extends IHasBridge, IOpenClose, IDisposable
{
    /**
     * 获取中介者名称
     * 
     * @type {string}
     * @memberof IMediatorBasicPart
     */
    readonly name:string;

    /**
     * 获取中介者状态
     * 
     * @type {MediatorStatus}
     * @memberof IMediatorBasicPart
     */
    readonly status:MediatorStatus;

    /**
     * 打开时传递的data
     * 
     * @type {*}
     * @memberof IMediatorBasicPart
     */
    data:any;

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
    
    /**
     * 加载从listAssets中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadAssets(handler:(err?:Error)=>void):void;
}