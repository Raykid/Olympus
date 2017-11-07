import { createEvalFunc } from "./Utils";
import Bind from "./Bind";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 数据更新订阅者，当依赖的数据有更新时会触发callback通知外面
*/
export default class Watcher implements IWatcher
{
    /** 记录当前正在执行update方法的Watcher引用 */
    public static updating:Watcher = null;

    private static _uid:number = 0;

    private _value:any;

    private _bind:Bind;
    private _target:any;
    private _exp:string;
    private _scope:any;
    private _expFunc:(scope:any)=>any;
    private _callback:WatcherCallback;

    private _disposed:boolean = false;

    public constructor(bind:Bind, target:any, exp:string, scope:any, callback:WatcherCallback)
    {
        // 记录Bind实例
        this._bind = bind;
        // 记录作用目标、表达式和作用域
        this._target = target;
        this._exp = exp;
        this._scope = scope;
        // 将表达式和作用域解析为一个Function
        this._expFunc = createEvalFunc(exp, 2);
        // 记录回调函数
        this._callback = callback;
        // 进行首次更新
        this.update();
    }

    /**
     * 获取到表达式当前最新值
     * @returns {any} 最新值
     */
    public getValue():any
    {
        if(this._disposed) return null;
        var value:any = null;
        // 记录自身
        Watcher.updating = this;
        // 设置通用属性
        var commonScope:any = {
            $this: this._bind.mediator,
            $bridge: this._bind.mediator.bridge,
            $target: this._target
        };
        // 表达式求值
        try
        {
            value = this._expFunc.call(this._scope, commonScope, this._scope);
        }
        catch(err)
        {
            // 输出错误日志
            console.warn("表达式求值错误\nerr: " + err.toString() + "\nexp：" + this._exp + "，scope：" + JSON.stringify(this._scope));
        }
        // 移除通用属性
        delete this._scope["$root"];
        delete this._scope["$target"];
        // 移除自身记录
        Watcher.updating = null;
        return value;
    }

    /**
     * 当依赖的数据有更新时调用该方法
     * @param extra 可能的额外数据
     */
    public update(extra?:any):void
    {
        if(this._disposed) return;
        var value:any = this.getValue();
        if(!Watcher.isEqual(value, this._value))
        {
            this._callback && this._callback(value, this._value, extra);
            this._value = Watcher.deepCopy(value);
        }
    }
    /** 销毁订阅者 */
    public dispose():void
    {
        if(this._disposed) return;
        this._value = null;
        this._target = null;
        this._exp = null;
        this._scope = null;
        this._expFunc = null;
        this._callback = null;
        this._disposed = true;
    }

    /**
     * 是否相等，包括基础类型和对象/数组的对比
     */
    private static isEqual(a:any, b:any):boolean
    {
        return (a == b || (
            Watcher.isObject(a) && Watcher.isObject(b)
            ? JSON.stringify(a) == JSON.stringify(b)
            : false
        ));
    }

    /**
     * 是否为对象(包括数组、正则等)
     */
    private static isObject(obj:any):boolean
    {
        return (obj && typeof obj == "object");
    }

    /**
     * 复制对象，若为对象则深度复制
     */
    private static deepCopy(from:any):any
    {
        if (Watcher.isObject(from))
        {
            // 复杂类型对象，先字符串化，再对象化
            return JSON.parse(JSON.stringify(from));
        }
        else
        {
            // 基本类型对象，直接返回之
            return from;
        }
    }
}

export interface IWatcher
{
    /**
     * 获取到表达式当前最新值
     * @returns {any} 最新值
     */
    getValue():any;
    /**
     * 当依赖的数据有更新时调用该方法
     * @param extra 可能的额外数据
     */
    update(extra?:any):void;
    /** 销毁订阅者 */
    dispose():void;
}

export interface WatcherCallback
{
    (newValue?:any, oldValue?:any, extra?:any):void;
}