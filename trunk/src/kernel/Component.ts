import Dictionary from '../utils/Dictionary';
import { system } from '../utils/System';
import { mutate } from './bind/Mutator';
import { bind, unbind } from './bind/Utils';
import ComponentStatus from './enums/ComponentStatus';
import * as Patch from "./global/Patch";
import IBridge from './interfaces/IBridge';
import IComponent from './interfaces/IComponent';
import IMessage from './interfaces/IMessage';
import IObservable from './interfaces/IObservable';
import ComponentMessageType from './messages/ComponentMessageType';
import Observable from './observable/Observable';

/* 打补丁 */
Patch;

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-05
 * @modify date 2018-07-05
 * 
 * Olympus组件，具有MVVM绑定功能
*/
export default class Component implements IComponent
{
    public constructor(skin?:any)
    {
        // 赋值皮肤
        this.skin = skin;
        // 记录原始皮肤
        this.oriSkin = skin;
        // 初始化绑定
        bind(this);
    }


    /******************** 下面是组件的基础接口 ********************/

    /**
     * 表现层桥
     * 
     * @type {IBridge}
     * @memberof Component
     */
    public bridge:IBridge;
    
    private _data:any;
    /**
     * 打开时传递的data对象
     * 
     * @type {*}
     * @memberof Component
     */
    public get data():any
    {
        return this._data;
    }
    public set data(value:any)
    {
        this._data = value;
        // 递归设置子组件的data
        for(let child of this._children)
        {
            child.data = value;
        }
    }

    /**
     * 皮肤
     * 
     * @type {*}
     * @memberof Component
     */
    public skin:any;

    private oriSkin:any;

    private _listeners:ListenerData[] = [];
    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
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
        // 调用桥接口
        this.bridge.mapListener(target, type, handler, thisArg);
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
                // 调用桥接口
                this.bridge.unmapListener(target, type, handler, thisArg);
                // 移除记录
                this._listeners.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 注销所有注册在当前组件上的事件监听
     * 
     * @memberof Mediator
     */
    public unmapAllListeners():void
    {
        for(var i:number = 0, len:number = this._listeners.length; i < len; i++)
        {
            var data:ListenerData = this._listeners.pop();
            // 调用桥接口
            this.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
        }
    }


    /******************** 下面是组件的绑定功能实现 ********************/

    protected _viewModel:any;
    /**
     * 获取或设置ViewModel
     * 
     * @type {*}
     * @memberof Mediator
     */
    public get viewModel():any
    {
        return this._viewModel;
    }
    public set viewModel(value:any)
    {
        // 设置的时候进行一次变异
        this._viewModel = mutate(value);
        // 更新绑定
        bind(this);
    }

    /**
     * 绑定目标数组，第一层key是调用层级，第二层是该层级需要编译的对象数组
     * 
     * @type {Dictionary<any, any>[]}
     * @memberof Mediator
     */
    public bindTargets:Dictionary<any, any>[] = [];

    /******************** 下面是组件的组件树接口 ********************/
    
    
    private _disposeDict:Dictionary<IComponent, ()=>void> = new Dictionary();
    
    private disposeChild(comp:IComponent, oriDispose:()=>void):void
    {
        // 调用原始销毁方法
        oriDispose.call(comp);
        // 取消托管
        this.undelegate(comp);
    };

    /**
     * 父组件
     * 
     * @type {IComponent}
     * @memberof Component
     */
    public parent:IComponent = null;

    /**
     * 获取根级组件（当做模块直接被打开的组件）
     * 
     * @type {IComponent}
     * @memberof Component
     */
    public get root():IComponent
    {
        return (this.parent ? this.parent.root : this);
    }

    protected _children:IComponent[] = [];
    /**
     * 获取所有子组件
     * 
     * @type {IComponent[]}
     * @memberof Component
     */
    public get children():IComponent[]
    {
        return this._children;
    }

    /**
     * 托管子组件
     * 
     * @param {IComponent} comp 要托管的组件
     * @memberof Component
     */
    public delegate(comp:IComponent):void
    {
        if(this._children.indexOf(comp) < 0)
        {
            // 托管新的组件
            this._children.push(comp);
            // 设置关系
            comp.parent = this;
            // 设置observable关系
            comp.observable.parent = this._observable;
            // 篡改dispose方法，以监听其dispose
            this._disposeDict.set(comp, comp.dispose);
            comp.dispose = this.disposeChild.bind(this, comp, comp.dispose);
        }
    }

    /**
     * 取消托管子组件
     * 
     * @param {IComponent} comp 要取消托管的组件
     * @memberof Component
     */
    public undelegate(comp:IComponent):void
    {
        var index:number = this._children.indexOf(comp);
        if(index >= 0)
        {
            // 取消托管组件
            this._children.splice(index, 1);
            // 移除关系
            comp.parent = null;
            // 移除observable关系
            if(comp.observable) comp.observable.parent = null;
            // 恢复dispose方法，取消监听dispose
            comp.dispose= this._disposeDict.get(comp);
            this._disposeDict.delete(comp);
        }
    }
    
    /**
     * 判断指定组件是否包含在该组件里（判断范围包括当前组件和子孙级组件）
     * 
     * @param {IComponent} comp 要判断的组件
     * @returns {boolean} 
     * @memberof Component
     */
    public contains(comp:IComponent):boolean
    {
        // 首先判断自身
        if(comp === this) return true;
        // 判断子组件
        var contains:boolean = false;
        for(var child of this._children)
        {
            if(child.contains(comp))
            {
                contains = true;
                break;
            }
        }
        return contains;
    }


    /******************** 下面是组件的消息功能实现 ********************/

    protected _observable:IObservable = new Observable();
    /**
     * 暴露IObservable
     * 
     * @readonly
     * @type {IObservable}
     * @memberof Mediator
     */
    public get observable():IObservable
    {
        return this._observable;
    }
    
    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Mediator
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Mediator
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(...params:any[]):void
    {
        this._observable.dispatch.apply(this._observable, params);
    }

    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        this._observable.listen(type, handler, thisArg, once);
    }

    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Mediator
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        this._observable.unlisten(type, handler, thisArg, once);
    }


    /******************** 下面是组件的打开关闭功能实现 ********************/

    protected _status:ComponentStatus = ComponentStatus.UNOPEN;
    /**
     * 获取组件状态
     * 
     * @readonly
     * @type {ComponentStatus}
     * @memberof Mediator
     */
    public get status():ComponentStatus
    {
        return this._status;
    }

    /**
     * 打开，为了实现IOpenClose接口
     * 
     * @param {*} [data] 开启数据
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    public open(data?:any):any
    {
        // 判断状态
        if(this._status === ComponentStatus.UNOPEN)
        {
            // 修改状态
            this._status = ComponentStatus.OPENING;
            // 赋值参数
            this.data = data;
            // 调用模板方法
            this.__beforeOnOpen(data);
            // 调用自身onOpen方法
            var result:any = this.onOpen(data);
            if(result !== undefined)
                this.data = data = result;
            // 初始化绑定，如果子类并没有在onOpen中设置viewModel，则给一个默认值以启动绑定功能
            if(!this._viewModel) this.viewModel = {};
            // 记录子组件数量，并监听其开启完毕事件
            var subCount:number = this._children.length;
            if(subCount > 0)
            {
                // 调用所有已托管组件的open方法
                for(var child of this._children)
                {
                    child.open(data);
                }
            }
            // 修改状态
            this._status = ComponentStatus.OPENED;
            // 调用模板方法
            this.__afterOnOpen(data);
            // 派发事件
            this.dispatch(ComponentMessageType.COMPONENT_OPENED, this);
        }
        // 返回自身引用
        return this;
    }

    protected __beforeOnOpen(data?:any):void
    {
        // 给子类用的模板方法
    }

    protected __afterOnOpen(data?:any):void
    {
        // 给子类用的模板方法
    }

    /**
     * 关闭，为了实现IOpenClose接口
     * 
     * @param {*} [data] 关闭数据
     * @param {...any[]} args 其他参数
     * @returns {*} 返回自身引用
     * @memberof Mediator
     */
    public close(data?:any):any
    {
        if(this._status === ComponentStatus.OPENED)
        {
            var doClose:()=>void = ()=>{
                // 调用模板方法
                this.__beforeOnClose(data);
                // 修改状态
                this._status = ComponentStatus.CLOSING;
                // 调用自身onClose方法
                this.onClose(data);
                // 修改状态
                this._status = ComponentStatus.CLOSED;
                // 调用模板方法
                this.__afterOnClose(data);
            };
            var subCount:number = this._children.length;
            if(subCount > 0)
            {
                var handler:(comp:IComponent)=>void = (comp:IComponent)=>{
                    if(this._children.indexOf(comp) >= 0 && --subCount === 0)
                    {
                        // 取消监听
                        this.unlisten(ComponentMessageType.COMPONENT_CLOSED, handler);
                        // 执行关闭
                        doClose();
                    }
                };
                this.listen(ComponentMessageType.COMPONENT_CLOSED, handler);
                // 调用所有已托管组件的close方法
                for(var child of this._children.concat())
                {
                    child.close(data);
                }
            }
            else
            {
                // 没有子组件，直接执行
                doClose();
            }
        }
        // 返回自身引用
        return this;
    }

    protected __beforeOnClose(data?:any):void
    {
        // 给子类用的模板方法
    }

    protected __afterOnClose(data?:any):void
    {
        // 派发关闭事件
        this.dispatch(ComponentMessageType.COMPONENT_CLOSED, this);
        // 给子类用的模板方法
        this.dispose();
    }
    
    /**
     * 当打开时调用
     * 
     * @param {*} [data] 可能的打开参数
     * @param {...any[]} args 其他参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof Mediator
     */
    public onOpen(data?:any):any
    {
        // 可重写
    }

    /**
     * 当关闭时调用
     * 
     * @param {*} [data] 可能的关闭参数
     * @param {...any[]} args 其他参数
     * @memberof Mediator
     */
    public onClose(data?:any):void
    {
        // 可重写
    }


    /******************** 下面是组件的销毁功能实现 ********************/

    /**
     * 获取组件是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Mediator
     */
    public get disposed():boolean
    {
        return (this._status === ComponentStatus.DISPOSED);
    }
    
    /**
     * 销毁组件
     * 
     * @memberof Mediator
     */
    public dispose():void
    {
        // 判断状态
        if(this.status >= ComponentStatus.DISPOSING) return;
        // 修改状态
        this._status = ComponentStatus.DISPOSING;
        // 移除绑定
        unbind(this);
        // 注销事件监听
        this.unmapAllListeners();
        // 调用模板方法
        this.onDispose();
        // 移除显示，只移除没有原始皮肤的，因为如果有原始皮肤，其原始parent可能不希望子节点被移除
        if(!this.oriSkin)
        {
            if(this.skin && this.bridge)
            {
                var parent:any = this.bridge.getParent(this.skin);
                if(parent) this.bridge.removeChild(parent, this.skin);
            }
        }
        // 移除表现层桥
        this.bridge = null;
        // 移除ViewModel
        this._viewModel = null;
        // 移除绑定目标数组
        this.bindTargets = null;
        // 移除皮肤
        this.skin = null;
        this.oriSkin = null;
        // 将所有子组件销毁
        for(var i:number = 0, len:number = this._children.length; i < len; i++)
        {
            var child:IComponent = this._children.pop();
            this.undelegate(child);
            child.dispose();
        }
        // 将observable的销毁拖延到下一帧，因为虽然执行了销毁，但有可能这之后还会使用observable发送消息
        system.nextFrame(()=>{
            // 移除observable
            this._observable.dispose();
            this._observable = null;
            // 修改状态
            this._status = ComponentStatus.DISPOSED;
        });
    }

    /**
     * 当销毁时调用
     * 
     * @memberof Mediator
     */
    public onDispose():void
    {
        // 可重写
    }
}

interface ListenerData
{
    target:any;
    type:string;
    handler:Function;
    thisArg?:any;
}