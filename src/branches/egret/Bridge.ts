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

    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof Bridge
     */
    public get root():egret.DisplayObjectContainer
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
     * 添加显示
     * 
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof Bridge
     */
    public addChild(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):egret.DisplayObject
    {
        return parent.addChild(target);
    }

    /**
     * 按索引添加显示
     * 
     * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
     * @param {egret.DisplayObject} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {egret.DisplayObject} 返回被添加的显示对象
     * @memberof Bridge
     */
    public addChildAt(parent:egret.DisplayObjectContainer, target:egret.DisplayObject, index:number):egret.DisplayObject
    {
        return parent.addChildAt(target, index);
    }
    
    /**
     * 移除显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 被移除的显示对象
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof Bridge
     */
    public removeChild(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):egret.DisplayObject
    {
        return parent.removeChild(target);
    }

    /**
     * 按索引移除显示
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 索引
     * @return {egret.DisplayObject} 返回被移除的显示对象
     * @memberof Bridge
     */
    public removeChildAt(parent:egret.DisplayObjectContainer, index:number):egret.DisplayObject
    {
        return parent.removeChildAt(index);
    }
    
    /**
     * 移除所有显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @memberof Bridge
     */
    public removeChildren(parent:egret.DisplayObjectContainer):void
    {
        parent.removeChildren();
    }
    
    /**
     * 获取指定索引处的显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {number} index 指定父级索引
     * @return {egret.DisplayObject} 索引处的显示对象
     * @memberof Bridge
     */
    public getChildAt(parent:egret.DisplayObjectContainer, index:number):egret.DisplayObject
    {
        return parent.getChildAt(index);
    }

    /**
     * 获取显示索引
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {egret.DisplayObject} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof Bridge
     */
    public getChildIndex(parent:egret.DisplayObjectContainer, target:egret.DisplayObject):number
    {
        return parent.getChildIndex(target);
    }
    
    /**
     * 通过名称获取显示对象
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @param {string} name 对象名称
     * @return {egret.DisplayObject} 显示对象
     * @memberof Bridge
     */
    public getChildByName(parent:egret.DisplayObjectContainer, name:string):egret.DisplayObject
    {
        return parent.getChildByName(name);
    }
    
    /**
     * 获取子显示对象数量
     * 
     * @param {egret.DisplayObjectContainer} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof Bridge
     */
    public getChildCount(parent:egret.DisplayObjectContainer):number
    {
        return parent.numChildren;
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