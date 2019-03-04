import IMediatorBasicPart from "./IMediatorBasicPart";
import IMediatorBindPart from "./IMediatorBindPart";
import IMediatorTreePart from "./IMediatorTreePart";
import IMediatorModulePart from "./IMediatorModulePart";
import ResponseData from "../net/ResponseData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * @export
 * @interface IMediator
 * @extends {IMediatorBasicPart<S, OD, CD>}
 * @extends {IMediatorBindPart<S>}
 * @extends {IMediatorTreePart}
 * @extends {IMediatorModulePart<S>}
 * @template S 皮肤类型
 * @template OD 开启参数类型
 * @template CD 关闭参数类型
 *
 * 界面中介者接口
*/
export default interface IMediator<S = any, OD = any, CD = any> extends IMediatorBasicPart<S, OD, CD>, IMediatorBindPart<S>, IMediatorTreePart, IMediatorModulePart<S> {
    /**
     * 当打开时调用
     *
     * @param {OD} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof IMediator
     */
    onOpen(data?: OD, ...args: any[]): any;
    /**
     * 当关闭时调用
     *
     * @param {CD} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof IMediator
     */
    onClose(data?: CD, ...args: any[]): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadAssets(err?: Error): void;
    /**
     * 当所需CSS加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadStyleFiles(err?: Error): void;
    /**
     * 当所需js加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onLoadJsFiles(err?: Error): void;
    /**
     * 当所需资源加载完毕后调用
     *
     * @param {Error} [err] 加载出错会给出错误对象，没错则不给
     * @memberof IMediator
     */
    onSendInitRequests(err?: Error): void;
    /**
     * 当获取到所有初始化请求返回时调用，可以通过返回一个true来阻止模块的打开
     *
     * @param {ResponseData[]} responses 返回结构数组
     * @returns {boolean} 返回true则表示停止模块打开
     * @memberof IMediator
     */
    onGetResponses(responses: ResponseData[]): boolean;
    /**
     * 其他模块被关闭回到当前模块时调用
     *
     * @param {(IMediator|undefined)} from 从哪个模块回到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator<S, OD, CD>
     */
    onWakeUp(from: IMediator | undefined, data?: any): void;
    /**
     * 模块切换到前台时调用（与onWakeUp的区别是open时onActivate会触发，但onWakeUp不会）
     *
     * @param {(IMediator|undefined)} from 从哪个模块来到当前模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator<S, OD, CD>
     */
    onActivate(from: IMediator | undefined, data?: OD | any): void;
    /**
     * 模块切换到后台时调用（close之后或者其他模块打开时）
     *
     * @param {(IMediator|undefined)} to 将要去往哪个模块
     * @param {*} [data] 可能的参数传递
     * @memberof IMediator<S, OD, CD>
     */
    onDeactivate(to: IMediator | undefined, data?: CD | any): void;
}
