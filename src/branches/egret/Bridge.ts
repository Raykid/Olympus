/// <reference path="./egret-core/build/egret/egret.d.ts"/>

import IBridge from "../../trunk/view/bridge/IBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Egret的表现层桥实现
*/
export default class Bridge implements IBridge
{
    /**
     * 获取表现层类型名称
     * 
     * @readonly
     * @type {string}
     * @memberof Bridge
     */
    public get type():string
    {
        return "Egret"
    }

    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get htmlWrapper():HTMLElement
    {
        return null;
    }
    
    public constructor()
    {
    }
    
    /**
     * 初始化表现层桥
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof Bridge
     */
    public init(complete:(bridge:IBridge)=>void):void
    {
        complete(this);
    }
    
    /**
     * 判断皮肤是否是Egret显示对象
     * 
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是Egret显示对象
     * @memberof Bridge
     */
    public isMySkin(skin:any):boolean
    {
        return (skin instanceof egret.DisplayObject);
    }
    
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Bridge
     */
    public mapListener(target:egret.EventDispatcher, type:string, handler:Function, thisArg?:any):void
    {
        target.addEventListener(type, handler, thisArg);
    }
    
    /**
     * 注销监听事件
     * 
     * @param {egret.EventDispatcher} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Bridge
     */
    public unmapListener(target:egret.EventDispatcher, type:string, handler:Function, thisArg?:any):void
    {
        target.removeEventListener(type, handler, thisArg);
    }
}