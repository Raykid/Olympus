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
export default interface IMediatorModulePart
{
    /**
     * 模块初始消息的返回数据
     * 
     * @type {ResponseData[]}
     * @memberof IMediatorModulePart
     */
    responses:ResponseData[];
    
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
    
    /**
     * 列出模块初始化请求
     * 
     * @returns {RequestData[]} 
     * @memberof IMediatorModulePart
     */
    listInitRequests():RequestData[];

    /**
     * 列出所需CSS资源URL
     * 
     * @returns {string[]} 
     * @memberof IMediatorModulePart
     */
    listStyleFiles():string[];

    /**
     * 列出所需JS资源URL
     * 
     * @returns {string[]} 
     * @memberof IMediatorModulePart
     */
    listJsFiles():string[];
    
    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof IMediatorModulePart
     */
    listAssets():string[];
}