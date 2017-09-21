import IBridge from "../../trunk/engine/bridge/IBridge";
import { getObjectHashs } from "../../trunk/utils/ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 基于DOM的表现层桥实现
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
        return "DOM"
    }

    private _root:HTMLElement|string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get htmlWrapper():HTMLElement
    {
        return <HTMLElement>this._root;
    }

    /**
     * 获取根显示节点
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get root():HTMLElement
    {
        return <HTMLElement>this._root;
    }

    /**
     * 获取背景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get bgLayer():HTMLElement
    {
        return <HTMLElement>this._root;
    }

    /**
     * 获取场景容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get sceneLayer():HTMLElement
    {
        return <HTMLElement>this._root;
    }

    /**
     * 获取弹窗容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get panelLayer():HTMLElement
    {
        return <HTMLElement>this._root;
    }

    /**
     * 获取顶级容器
     * 
     * @readonly
     * @type {HTMLElement}
     * @memberof Bridge
     */
    public get topLayer():HTMLElement
    {
        return <HTMLElement>this._root;
    }
    
    public constructor(root?:HTMLElement|string)
    {
        this._root = root;
    }
    
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof Bridge
     */
    public init(complete:(bridge:IBridge)=>void):void
    {
        // 如果是名称，则转变成引用
        if(typeof this._root == "string")
        {
            this._root = document.getElementById(this._root);
        }
        // 如果是空，则生成一个
        if(!this._root)
        {
            this._root = document.createElement("div");
            document.body.appendChild(this._root);
        }
        // 调用回调
        complete(this);
    }

    /**
     * 判断皮肤是否是DOM显示节点
     * 
     * @param {*} skin 皮肤对象
     * @returns {boolean} 是否是DOM显示节点
     * @memberof Bridge
     */
    public isMySkin(skin:any):boolean
    {
        return (skin instanceof HTMLElement);
    }

    /**
     * 添加显示
     * 
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @return {Element} 返回被添加的显示对象
     * @memberof Bridge
     */
    public addChild(parent:Element, target:Element):Element
    {
        return parent.appendChild(target);
    }

    /**
     * 按索引添加显示
     * 
     * @param {Element} parent 要添加到的父容器
     * @param {Element} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {Element} 返回被添加的显示对象
     * @memberof Bridge
     */
    public addChildAt(parent:Element, target:Element, index:number):Element
    {
        return parent.insertBefore(target, this.getChildAt(parent, index));
    }

    /**
     * 移除显示对象
     * 
     * @param {Element} parent 父容器
     * @param {Element} target 被移除的显示对象
     * @return {Element} 返回被移除的显示对象
     * @memberof Bridge
     */
    public removeChild(parent:Element, target:Element):Element
    {
        return parent.removeChild(target);
    }

    /**
     * 按索引移除显示
     * 
     * @param {Element} parent 父容器
     * @param {number} index 索引
     * @return {Element} 返回被移除的显示对象
     * @memberof Bridge
     */
    public removeChildAt(parent:Element, index:number):Element
    {
        return parent.removeChild(this.getChildAt(parent, index));
    }

    /**
     * 移除所有显示对象
     * 
     * @param {Element} parent 父容器
     * @memberof Bridge
     */
    public removeChildren(parent:Element):void
    {
        for(var i:number = 0, len:number = parent.children.length; i < len; i++)
        {
            parent.removeChild(parent.children.item(i));
        }
    }
    
    /**
     * 获取父容器
     * 
     * @param {Element} target 目标对象
     * @returns {Element} 父容器
     * @memberof Bridge
     */
    public getParent(target:Element):Element
    {
        return target.parentElement;
    }

    /**
     * 获取指定索引处的显示对象
     * 
     * @param {Element} parent 父容器
     * @param {number} index 指定父级索引
     * @return {Element} 索引处的显示对象
     * @memberof Bridge
     */
    public getChildAt(parent:Element, index:number):Element
    {
        return parent.children.item(index);
    }

    /**
     * 获取显示索引
     * 
     * @param {Element} parent 父容器
     * @param {Element} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof Bridge
     */
    public getChildIndex(parent:Element, target:Element):number
    {
        for(var i:number = 0, len:number = parent.children.length; i < len; i++)
        {
            if(target === parent.children.item(i)) return i;
        }
        return -1;
    }
    
    /**
     * 通过名称获取显示对象
     * 
     * @param {Element} parent 父容器
     * @param {string} name 对象名称
     * @return {Element} 显示对象
     * @memberof Bridge
     */
    public getChildByName(parent:Element, name:string):Element
    {
        return parent.children.namedItem(name);
    }

    /**
     * 获取子显示对象数量
     * 
     * @param {Element} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof Bridge
     */
    public getChildCount(parent:Element):number
    {
        return parent.childElementCount;
    }
    
    private _listenerDict:{[key:string]:(evt:Event)=>void} = {};
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Bridge
     */
    public mapListener(target:EventTarget, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        var key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则不再监听
        if(this._listenerDict[key]) return;
        // 监听
        var listener:(evt:Event)=>void = function(evt:Event):void
        {
            // 调用回调
            handler.call(thisArg || this, evt);
        };
        target.addEventListener(type, listener);
        // 记录监听
        this._listenerDict[key] = listener;
    }
    
    /**
     * 注销监听事件
     * 
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof Bridge
     */
    public unmapListener(target:EventTarget, type:string, handler:(evt:Event)=>void, thisArg?:any):void
    {
        var key:string = getObjectHashs(target, type, handler, thisArg);
        // 判断是否已经存在该监听，如果存在则移除监听
        var listener:(evt:Event)=>void = this._listenerDict[key];
        if(listener)
        {
            target.removeEventListener(type, listener);
            // 移除记录
            delete this._listenerDict[key];
        }
    }
}