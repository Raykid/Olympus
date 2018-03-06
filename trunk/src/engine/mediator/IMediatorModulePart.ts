import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IMediator from "./IMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 * 
 * 该接口规定了中介者具有的模块部分功能
*/

export enum ModuleOpenStatus
{
    Stop,
    BeforeOpen,
    AfterOpen
}

export default interface IMediatorModulePart
{
    /**
     * 获取模块名
     * 
     * @type {string}
     * @memberof IMediatorModulePart
     */
    readonly moduleName:string;

    /**
     * 模块打开结果回调函数，由moduleManager调用，不要手动调用
     * 
     * @memberof IMediatorModulePart
     */
    moduleOpenHandler:(status:ModuleOpenStatus, err?:Error)=>void;
    
    /**
     * 其他模块被关闭回到当前模块时调用
     * 
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediatorModulePart
     */
    wakeUp(from:IMediator|undefined, data?:any):void;

    /**
     * 模块切换到前台时调用（与wakeUp的区别是open时activate会触发，但wakeUp不会）
     * 
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediatorModulePart
     */
    activate(from:IMediator|undefined, data?:any):void;

    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     * 
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediatorModulePart
     */
    deactivate(to:IMediator|undefined, data?:any):void;
}