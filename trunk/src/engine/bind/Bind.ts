import IMediator from "../mediator/IMediator";
import { mutate } from "./Mutator";
import Watcher, { IWatcher, WatcherCallback } from "./Watcher";
import { getObjectHashs } from "../../utils/ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 一个绑定
*/
export default class Bind
{
    private _watcherDict:{[hash:string]:Watcher} = {};
    private _mediator:IMediator;
    /**
     * 获取已绑定的中介者实例
     * 
     * @readonly
     * @type {IMediator}
     * @memberof Bind
     */
    public get mediator():IMediator
    {
        return this._mediator;
    }

    public constructor(mediator:IMediator)
    {
        this._mediator = mediator;
    }

    /**
     * 创建一个观察者，在数值变更时会通知回调进行更新
     * 
     * @param {*} target 作用目标，指表达式所在的显示对象
     * @param {string} exp 表达式
     * @param {*} scope 作用域
     * @param {WatcherCallback} callback 订阅器回调
     * @returns {IWatcher} 返回观察者本身
     * @memberof Bind
     */
    public createWatcher(target:any, exp:string, scope:any, callback:WatcherCallback):IWatcher
    {
        var key:string = getObjectHashs(target, exp, scope);
        var watcher:Watcher = this._watcherDict[key];
        if(!watcher) this._watcherDict[key] = watcher = new Watcher(this, target, exp, scope, callback);
        return watcher;
    }
}