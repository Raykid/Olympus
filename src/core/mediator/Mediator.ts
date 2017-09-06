import IMediator from "./IMediator"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-04
 * @modify date 2017-09-04
 * 
 * 界面中介者基类，不能直接继承使用该基类，而需要继承不同表现层提供的中介者类
*/
export default class Mediator implements IMediator
{
    public constructor(skin?:any)
    {
        if(skin) this.setSkin(skin);
    }
    
    private _isDestroyed:boolean = false;
    /**
     * 获取中介者是否已被销毁
     * 
     * @returns {boolean} 是否已被销毁
     * @memberof Mediator
     */
    public isDisposed():boolean
    {
        return this._isDestroyed;
    }

    private _skin:any;
    /**
     * 获取皮肤
     * 
     * @returns {*} 皮肤引用
     * @memberof Mediator
     */
    public getSkin():any
    {
        return this._skin;
    }

    /**
     * 设置皮肤
     * 
     * @param {*} value 皮肤引用
     * @memberof Mediator
     */
    public setSkin(value:any):void
    {
        this._skin = value;
    }

    private _listeners:ListenerData[] = [];
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
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners[i];
            if(data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg)
            {
                // 已经存在一样的监听，不再监听
                return;
            }
        }
        // 记录监听
        this._listeners.push({target: target, type: type, handler: handler, thisArg: thisArg});
        // 调用自主实现部分接口
        this.doMalListener(target, type, handler, thisArg);
    }

    protected doMalListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        // 留待子类实现
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
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners[i];
            if(data.target == target && data.type == type && data.handler == handler && data.thisArg == thisArg)
            {
                // 调用自主实现部分接口
                this.doUnmalListener(target, type, handler, thisArg);
                // 移除记录
                this._listeners.splice(i, 1);
                break;
            }
        }
    }
    
    protected doUnmalListener(target:any, type:string, handler:Function, thisArg?:any):void
    {
        // 留待子类实现
    }

    /**
     * 注销所有注册在当前中介者上的事件监听
     * 
     * @memberof Mediator
     */
    public unmapAllListeners():void
    {
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners[i];
            // 调用自主实现部分接口
            this.doUnmalListener(data.target, data.type, data.handler, data.thisArg);
            // 移除记录
            this._listeners.splice(i, 1);
        }
    }

    /**
     * 销毁中介者
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        // 注销事件监听
        this.unmapAllListeners();
        // 移除皮肤
        this._skin = null;
        // 设置已被销毁
        this._isDestroyed = true;
    }
}

interface ListenerData
{
    target:any;
    type:string;
    handler:Function;
    thisArg?:any;
}