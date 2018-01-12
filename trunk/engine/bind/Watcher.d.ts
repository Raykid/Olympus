import { EvalExp } from "./Utils";
import Bind from "./Bind";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 数据更新订阅者，当依赖的数据有更新时会触发callback通知外面
*/
export default class Watcher implements IWatcher {
    /** 记录当前正在执行update方法的Watcher引用 */
    static updating: Watcher;
    private static _uid;
    private _value;
    private _bind;
    private _currentTarget;
    private _target;
    private _exp;
    private _thisArg;
    private _scopes;
    private _expFunc;
    private _callback;
    private _disposed;
    /**
     * 获取该观察者是否已经被销毁
     *
     * @readonly
     * @type {boolean}
     * @memberof Watcher
     */
    readonly disposed: boolean;
    constructor(bind: Bind, currentTarget: any, target: any, exp: EvalExp, callback: WatcherCallback, thisArg: any, ...scopes: any[]);
    /**
     * 获取到表达式当前最新值
     * @returns {any} 最新值
     */
    getValue(): any;
    /**
     * 当依赖的数据有更新时调用该方法
     * @param extra 可能的额外数据
     */
    update(extra?: any): void;
    /** 销毁订阅者 */
    dispose(): void;
    /**
     * 是否相等，包括基础类型和对象/数组的对比
     */
    private static isEqual(a, b);
    /**
     * 是否为对象(包括数组、正则等)
     */
    private static isObject(obj);
    /**
     * 复制对象，若为对象则深度复制
     */
    private static deepCopy(from);
}
export interface IWatcher {
    /**
     * 获取到表达式当前最新值
     * @returns {any} 最新值
     */
    getValue(): any;
    /**
     * 当依赖的数据有更新时调用该方法
     * @param extra 可能的额外数据
     */
    update(extra?: any): void;
    /** 销毁订阅者 */
    dispose(): void;
}
export interface WatcherCallback {
    (newValue?: any, oldValue?: any, extra?: any): void;
}
