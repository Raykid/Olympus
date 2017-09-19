import IBridge from "../../trunk/view/bridge/IBridge";
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
     * @memberof IBridge
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
     * @memberof IBridge
     */
    public get htmlWrapper():HTMLElement
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
     * @memberof IBridge
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
    
    private _listenerDict:{[key:string]:(evt:Event)=>void} = {};
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     * 
     * @param {EventTarget} target 事件目标对象
     * @param {string} type 事件类型
     * @param {(evt:Event)=>void} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
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
     * @memberof IBridge
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