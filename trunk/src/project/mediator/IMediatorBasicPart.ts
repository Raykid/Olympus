import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 * 
 * 该接口规定了中介者具有的基础功能
*/
export default interface IMediatorBasicPart
{
    /**
     * 开启时是否触发全屏遮罩，防止用户操作，设置操作会影响所有子孙中介者。默认是true
     * 
     * @type {boolean}
     * @memberof IMediatorBasicPart
     */
    openMask:boolean;

    /**
     * 模块初始消息的返回数据
     * 
     * @type {ResponseData[]}
     * @memberof IMediatorBasicPart
     */
    responses:ResponseData[];
    
    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof IMediatorBasicPart
     */
    listAssets():string[];

    /**
     * 列出所需CSS资源URL
     * 
     * @returns {string[]} 
     * @memberof IMediatorBasicPart
     */
    listStyleFiles():string[];

    /**
     * 列出所需JS资源URL
     * 
     * @returns {string[]} 
     * @memberof IMediatorBasicPart
     */
    listJsFiles():string[];
    
    /**
     * 列出模块初始化请求
     * 
     * @returns {RequestData[]} 
     * @memberof IMediatorBasicPart
     */
    listInitRequests():RequestData[];
    
    /**
     * 加载从listAssets中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadAssets(handler:(err?:Error)=>void):void;
    
    /**
     * 加载从listStyleFiles中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadStyleFiles(handler:(err?:Error)=>void):void;
    
    /**
     * 加载从listJsFiles中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    loadJsFiles(handler:(err?:Error)=>void):void;
    
    /**
     * 发送从listInitRequests中获取到的所有资源
     * 
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IMediator
     */
    sendInitRequests(handler:(err?:Error)=>void):void;
}