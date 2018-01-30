import IMediatorBasicPart from "./IMediatorBasicPart";
import IMediatorBindPart from "./IMediatorBindPart";
import IMediatorTreePart from "./IMediatorTreePart";
import IMediatorModulePart from "./IMediatorModulePart";
import RequestData from "../net/RequestData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 *
 * 界面中介者接口
*/
export default interface IMediator extends IMediatorBasicPart, IMediatorBindPart, IMediatorTreePart, IMediatorModulePart {
    /**
     * 当打开时调用
     *
     * @param {*} [data] 可能的打开参数
     * @memberof IMediator
     */
    onOpen(data?: any): void;
    /**
     * 当关闭时调用
     *
     * @param {*} [data] 可能的关闭参数
     * @memberof IMediator
     */
    onClose(data?: any): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadAssets(err?: Error): void;
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onWakeUp(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onActivate(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator
     */
    onDeactivate(to: IMediator | undefined, data?: any): void;
    /**
     * 列出模块初始化请求
     *
     * @returns {RequestData[]}
     * @memberof IMediator
     */
    onListInitRequests(): RequestData[];
    /**
     * 列出所需CSS资源URL
     *
     * @returns {string[]}
     * @memberof IMediator
     */
    onListStyleFiles(): string[];
    /**
     * 列出所需JS资源URL
     *
     * @returns {string[]}
     * @memberof IMediator
     */
    onListJsFiles(): string[];
    /**
     * 列出中介者所需的资源数组，可重写
     *
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof IMediator
     */
    onListAssets(): string[];
}
