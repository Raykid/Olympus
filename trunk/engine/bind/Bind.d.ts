import IMediator from "../mediator/IMediator";
import { EvalExp } from "./Utils";
import { IWatcher, WatcherCallback } from "./Watcher";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 一个绑定
*/
export default class Bind {
    private _watcherDict;
    private _mediator;
    /**
     * 获取已绑定的中介者实例
     *
     * @readonly
     * @type {IMediator}
     * @memberof Bind
     */
    readonly mediator: IMediator;
    constructor(mediator: IMediator);
    /**
     * 创建一个观察者，在数值变更时会通知回调进行更新
     *
     * @param {*} currentTarget 作用目标，指表达式所在的显示对象
     * @param {*} target 绑定表达式本来所在的对象
     * @param {EvalExp} exp 表达式或方法
     * @param {WatcherCallback} callback 订阅器回调
     * @param {*} thisArg this指向
     * @param {...any[]} scopes 作用域列表，最后一个作用域会被当做this指向
     * @returns {IWatcher} 返回观察者本身
     * @memberof Bind
     */
    createWatcher(currentTarget: any, target: any, exp: EvalExp, callback: WatcherCallback, thisArg: any, ...scopes: any[]): IWatcher;
    /**
     * 销毁绑定关系
     *
     * @memberof Bind
     */
    dispose(): void;
}
