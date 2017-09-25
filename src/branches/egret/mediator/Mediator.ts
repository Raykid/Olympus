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
    /**
     * 表现层桥
     * 
     * @type {IBridge}
     * @memberof Mediator
     */
    public bridge:IBridge;
    
    /**
     * 皮肤
     * 
     * @type {*}
     * @memberof Mediator
     */
    public skin:any;
    
    private _disposed:boolean;
    /**
     * 获取中介者是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    public get disposed():boolean
    {
        return this._disposed;
    }
    
    public constructor(skin?:any, callProxy:boolean=true)
    {
        super();
        callProxy && MediatorProxy.call(this, this);
        // skinName不能马上设置（考虑到可能需要预加载资源），延迟到添加显示之前设置
        this._skinName = skin;
    }

    private _skinName:any;
    public $onAddToStage(stage:egret.Stage, nestLevel:number):void
    {
        this.skinName = this._skinName;
        super.$onAddToStage(stage, nestLevel);
    }

    /**
     * 列出中介者所需的资源数组，可重写
     * 
     * @returns {string[]} 资源数组，请根据该Mediator所操作的渲染模组的需求给出资源地址或组名
     * @memberof Mediator
     */
    public listAssets():string[]
    {
        return MediatorProxy.prototype.listAssets.call(this);
    }

    /**
     * 加载从listAssets中获取到的所有资源，完毕后调用回调函数
     * 
     * @param {(err?:Error)=>void} handler 完毕后的回调函数，有错误则给出err，没有则不给
     * @memberof Mediator
     */
    public loadAssets(handler:(err?:Error)=>void):void
    {
        MediatorProxy.prototype.loadAssets.call(this, handler);
    }
    
    /**
     * 打开
     * 
     * @param {*} [data] 
     * @returns {*} 
     * @memberof Mediator
     */
    public open(data?:any):any
    {
        return MediatorProxy.prototype.open.call(this, data);
    }

    /**
     * 关闭
     * 
     * @param {*} [data] 
     * @returns {*} 
     * @memberof Mediator
     */
    public close(data?:any):any
    {
        return MediatorProxy.prototype.close.call(this, data);
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
        MediatorProxy.prototype.mapListener.call(this, target, type, handler, thisArg);
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
        MediatorProxy.prototype.unmapListener.call(this, target, type, handler, thisArg);
    }

    /**
     * 注销所有注册在当前中介者上的事件监听
     * 
     * @memberof Mediator
     */
    public unmapAllListeners():void
    {
        MediatorProxy.prototype.unmapAllListeners.call(this);
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
        MediatorProxy.prototype.dispatch.call(this, typeOrMsg, ...params);
    }

    /**
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        MediatorProxy.prototype.dispose.call(this);
    }
}