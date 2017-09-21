/// <reference path="../../egret/egret-core/build/egret/egret.d.ts"/>
/// <reference path="../../egret/egret-core/build/eui/eui.d.ts"/>
/// <reference path="../../egret/egret-core/build/res/res.d.ts"/>
/// <reference path="../../egret/egret-core/build/tween/tween.d.ts"/>
/// <reference path="../../../../dist/Olympus.d.ts"/>

import IMessage from "core/message/IMessage";
import IMediator from "engine/mediator/IMediator";
import MediatorProxy from "engine/mediator/Mediator";
import IBridge from "engine/bridge/IBridge";
import { bridgeManager } from "engine/bridge/BridgeManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 由于Egret EUI界面的特殊性，需要一个Mediator的基类来简化业务逻辑
*/
export default class Mediator extends eui.Component implements IMediator
{
    protected _proxy:MediatorProxy;
    private _skinName:any;

    /**
     * 表现层桥
     * 
     * @type {IBridge}
     * @memberof Mediator
     */
    public get bridge():IBridge
    {
        return this._proxy.bridge;
    }
    public set bridge(value:IBridge)
    {
        this._proxy.bridge = value;
    }
    
    /**
     * 皮肤
     * 
     * @type {*}
     * @memberof Mediator
     */
    public get skin():any
    {
        return this._proxy.skin;
    }
    public set skin(value:any)
    {
        this._proxy.skin = value;
    }
    
    /**
     * 获取中介者是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    public get disposed():boolean
    {
        return this._proxy.disposed;
    }
    
    public constructor(skin?:any)
    {
        super();
        this._proxy = new MediatorProxy(this);
        this._skinName = skin;
        this.skin = this;
    }

    public $onAddToStage(stage:egret.Stage, nestLevel:number):void
    {
        super.$onAddToStage(stage, nestLevel);
        this.skinName = this._skinName;
    }

    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        return this._proxy.listAssets();
    }

    /**
     * 加载从listAssets中获取到的所有资源，完毕后调用回调函数
     * 
     * @param {(err?:Error)=>void} handler 完毕后的回调函数，有错误则给出err，没有则不给
     * @memberof Mediator
     */
    public loadAssets(handler:(err?:Error)=>void):void
    {
        this._proxy.loadAssets(handler);
    }

    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Mediator
     */
    public mapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        this._proxy.mapListener(target, type, handler, thisArg);
    }

    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Mediator
     */
    public unmapListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        this._proxy.unmapListener(target, type, handler, thisArg);
    }

    /**
     * 注销所有注册在当前中介者上的事件监听
     * 
     * @memberof Mediator
     */
    public unmapAllListeners():void
    {
        this._proxy.unmapAllListeners();
    }

    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    public dispatch(type:string, ...params:any[]):void;
    public dispatch(typeOrMsg:any, ...params:any[]):void
    {
        this._proxy.dispatch(typeOrMsg, ...params);
    }

    /**
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        this._proxy.dispose();
    }
}