import IModuleDependent from "../module/IModuleDependent";
import IMediator from "./IMediator";
import ResponseData from "../net/ResponseData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-24
 * @modify date 2017-10-24
 *
 * 托管到模块的中介者所具有的接口
*/
export default interface IModuleMediator extends IMediator, IModuleDependent {
    /**
     * 便捷获取被托管到的模块的初始化消息数组
     *
     * @type {ResponseData[]}
     * @memberof IModuleMediator
     */
    readonly initResponses: ResponseData[];
    /**
     * 列出中介者所需的资源数组，可重写
     *
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof IModuleMediator
     */
    listAssets(): string[];
    /**
     * 加载从listAssets中获取到的所有资源
     *
     * @param {(err?:Error)=>void} handler 加载完毕后的回调，如果出错则会给出err参数
     * @memberof IModuleMediator
     */
    loadAssets(handler: (err?: Error) => void): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IModuleMediator
     */
    onLoadAssets(err?: Error): void;
}
