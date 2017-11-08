import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import Bind from "./Bind";
import IBridge from "../bridge/IBridge";
import { evalExp, runExp, createRunFunc } from "./Utils";
import { IResponseDataConstructor } from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import IObservable from "../../core/observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 * 
 * 绑定管理器，可以将数据和显示对象绑定到一起，MVVM书写界面
*/
@Injectable
export default class BindManager
{
    private _bindDict:Dictionary<IMediator, BindData> = new Dictionary();

    /**
     * 绑定数据到UI上
     * 
     * @param {IMediator} mediator 中介者
     * @returns {Bind} 返回绑定实例
     * @memberof BindManager
     */
    public bind(mediator:IMediator):Bind
    {
        var bindData:BindData = this._bindDict.get(mediator);
        if(!bindData)
        {
            this._bindDict.set(mediator, bindData = {
                bind: new Bind(mediator),
                callbacks: []
            });
        }
        // 重新绑定所有
        for(var callback of bindData.callbacks)
        {
            callback();
        }
        // 返回Bind对象
        return bindData.bind;
    }

    /**
     * 移除绑定
     * 
     * @param {IMediator} mediator 
     * @returns {Bind} 
     * @memberof BindManager
     */
    public unbind(mediator:IMediator):Bind
    {
        var bindData:BindData = this._bindDict.get(mediator);
        if(bindData) this._bindDict.delete(mediator);
        return bindData && bindData.bind;
    }
    
    private search(values:any, ui:any, callback:(ui:any, key:string, exp:string)=>void):void
    {
        for(var key in values)
        {
            var value:any = values[key];
            var index:number = key.indexOf(".");
            if(index >= 0)
            {
                // 是表达式寻址，递归寻址
                var newValue:any = {};
                newValue[key.substr(index + 1)] = value;
                this.search(newValue, ui[key.substring(0, index)], callback);
            }
            else if(typeof value != "string")
            {
                // 是子对象寻址，递归寻址
                this.search(value, ui[key], callback);
            }
            else
            {
                // 是表达式，调用回调
                callback(ui, key, value);
            }
        }
    }

    private delaySearch(mediator:IMediator, values:any, ui:any, callback:(ui:any, key:string, exp:string)=>void):void
    {
        var handler:()=>void = ()=>{
            // 判断数据是否合法
            if(!mediator.viewModel) return;
            // 开始绑定
            this.search(values, ui, callback);
        };
        // 添加绑定数据
        var bindData:BindData = this._bindDict.get(mediator);
        if(bindData.callbacks.indexOf(handler) < 0)
            bindData.callbacks.push(handler);
        // 立即调用一次
        handler();
    }

    /**
     * 绑定属性值
     * 
     * @param {IMediator} mediator 中介者
     * @param {{[name:string]:string}} uiDict ui属性字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindValue(mediator:IMediator, uiDict:{[name:string]:string}, ui:any):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        this.delaySearch(mediator, uiDict, ui, (ui:any, key:string, exp:string)=>{
            bindData.bind.createWatcher(ui, exp, mediator.viewModel, (value:any)=>{
                ui[key] = value;
            });
        });
    }

    /**
     * 绑定事件
     * 
     * @param {IMediator} mediator 中介者
     * @param {{[type:string]:string}} evtDict 事件字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindOn(mediator:IMediator, evtDict:{[type:string]:string}, ui:any):void
    {
        this.delaySearch(mediator, evtDict, ui, (ui:any, key:string, exp:string)=>{
            var handler:Function = mediator.viewModel[exp];
            var commonScope:any = {
                $this: mediator,
                $bridge: mediator.bridge,
                $target: ui
            };
            // 如果取不到handler，则把exp当做一个执行表达式处理，外面包一层方法
            if(!handler)
            {
                var func:Function = createRunFunc(exp, 2);
                handler = function():void
                {
                    func.call(this, commonScope, mediator.viewModel);
                };
            }
            mediator.bridge.mapListener(ui, key, handler, mediator.viewModel);
        });
    }

    private replaceDisplay(bridge:IBridge, ori:any, cur:any):void
    {
        var parent:any = bridge.getParent(ori);
        if(parent)
        {
            // ori有父级，记录其当前索引
            var index:number = bridge.getChildIndex(parent, ori);
            // 移除ori
            bridge.removeChild(parent, ori);
            // 显示cur
            bridge.addChildAt(parent, cur, index);
        }
    }
    
    /**
     * 绑定显示
     * 
     * @param {IMediator} mediator 中介者
     * @param {{[name:string]:string}} uiDict 判断字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    public bindIf(mediator:IMediator, uiDict:{[name:string]:string}, ui:any):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        var replacer:any = mediator.bridge.createEmptyDisplay();
        this.delaySearch(mediator, uiDict, ui, (ui:any, key:string, exp:string)=>{
            // 寻址到指定目标
            ui = ui[key] || ui;
            // 绑定表达式
            bindData.bind.createWatcher(ui, exp, mediator.viewModel, (value:boolean)=>{
                // 如果表达式为true则显示ui，否则移除ui
                if(value) this.replaceDisplay(mediator.bridge, replacer, ui);
                else this.replaceDisplay(mediator.bridge, ui, replacer);
            });
        });
    }
    
    /**
     * 绑定全局Message
     * 
     * @param {IMediator} mediator 中介者
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {{[name:string]:string}} uiDict ui表达式字典
     * @param {*} ui 绑定到的ui实体对象
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindMessage(mediator:IMediator, type:IConstructor|string, uiDict:{[name:string]:string}, ui:any, observable?:IObservable):void
    {
        if(!observable) observable = core.observable;
        var bindData:BindData = this._bindDict.get(mediator);
        var handler:(...args:any[])=>void = (...args:any[])=>{
            if(mediator.disposed)
            {
                // mediator已销毁，取消监听
                observable.unlisten(type, handler);
            }
            else
            {
                var msg:any;
                if(args.length == 1 && typeof args[0] == "object" && args[0].type)
                    msg = args[0];
                else
                    msg = {$arguments: args};
                this.search(uiDict, ui, (ui:any, key:string, exp:string)=>{
                    // 设置通用属性
                    var commonScope:any = {
                        $this: mediator,
                        $bridge: mediator.bridge,
                        $target: ui
                    };
                    ui[key] = evalExp(exp, mediator.viewModel, commonScope, msg, mediator.viewModel);
                });
            }
        };
        // 添加监听
        observable.listen(type, handler);
    }

    /**
     * 绑定全局Response
     * 
     * @param {IMediator} mediator 中介者
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {{[name:string]:string}} uiDict ui表达式字典
     * @param {*} ui 绑定到的ui实体对象
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindResponse(mediator:IMediator, type:IResponseDataConstructor|string, uiDict:{[name:string]:string}, ui:any, observable?:IObservable):void
    {
        if(!observable) observable = core.observable;
        var bindData:BindData = this._bindDict.get(mediator);
        var handler:(response:any)=>void = (response:any)=>{
            if(mediator.disposed)
            {
                // mediator已销毁，取消监听
                netManager.unlistenResponse(type, handler, null, null, observable);
            }
            else
            {
                this.search(uiDict, ui, (ui:any, key:string, exp:string)=>{
                    // 设置通用属性
                    var commonScope:any = {
                        $this: mediator,
                        $bridge: mediator.bridge,
                        $target: ui
                    };
                    ui[key] = evalExp(exp, mediator.viewModel, commonScope, response, mediator.viewModel);
                });
            }
        };
        // 添加监听
        netManager.listenResponse(type, handler, null, null, observable);
        // 如果mediator所依赖的模块有初始化消息，则要额外触发初始化消息的绑定
        if(mediator["dependModuleInstance"])
        {
            for(var response of mediator["dependModuleInstance"].responses)
            {
                handler(response);
            }
        }
    }
}

interface BindData
{
    bind:Bind;
    callbacks:(()=>void)[];
}

/** 再额外导出一个单例 */
export const bindManager:BindManager = core.getInject(BindManager);