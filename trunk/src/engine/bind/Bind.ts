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
     * @param {*} currentTarget 作用目标，指表达式所在的显示对象
     * @param {*} target 绑定表达式本来所在的对象
     * @param {string} exp 表达式
     * @param {WatcherCallback} callback 订阅器回调
     * @param {...any[]} scopes 作用域列表，首个作用域会被当做this指向
     * @returns {IWatcher} 返回观察者本身
     * @memberof Bind
     */
    public createWatcher(currentTarget:any, target:any, exp:string, callback:WatcherCallback, ...scopes:any[]):IWatcher
    {
        var key:string = getObjectHashs(currentTarget, exp, ...scopes);
        var watcher:Watcher = this._watcherDict[key];
        if(!watcher) this._watcherDict[key] = watcher = new Watcher(this, currentTarget, target, exp, callback, ...scopes);
        return watcher;
    }
}