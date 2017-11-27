import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import Bind from "./Bind";
import IBridge from "../bridge/IBridge";
import { evalExp, createRunFunc } from "./Utils";
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
    private _envModel:any[] = [];

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
            else if(typeof value == "object" && !(value instanceof Array))
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
     * @param {*} ui 绑定到的ui实体对象
     * @param {{[name:string]:any}} uiDict ui属性字典
     * @memberof BindManager
     */
    public bindValue(mediator:IMediator, ui:any, uiDict:{[name:string]:any}):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        this.delaySearch(mediator, uiDict, ui, (ui:any, key:string, exp:string)=>{
            bindData.bind.createWatcher(ui, exp, (value:any)=>{
                ui[key] = value;
            }, mediator.viewModel, ...this._envModel);
        });
    }

    /**
     * 绑定方法执行
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} ui 绑定到的ui实体对象
     * @param {BindFuncDict} funcDict 方法字典，值可以是参数表达式，或者参数表达式数组，或者一个undefined
     * @memberof BindManager
     */
    public bindFunc(mediator:IMediator, ui:any, funcDict:BindFuncDict):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        this.delaySearch(mediator, funcDict, ui, (ui:any, key:string, exp:string[]|string|undefined)=>{
            if(exp)
            {
                var exps:string[];
                if(typeof exp == "string")
                {
                    // 将裸的表达式形式参数转换为表达式参数数组形式
                    exps = [exp];
                }
                else
                {
                    // 本来就是表达式参数数组，直接赋值即可
                    exps = exp;
                }
                // 将表达式中所有undefined和null变为内部值
                var undefinedValue:string = Date.now() * Math.random() + "_undefined";
                var nullValue:string = Date.now() * Math.random() + "_null";
                exps = exps.map(value=>{
                    if(value === undefined) return "'" + undefinedValue + "'";
                    else if(value === null) return "'" + nullValue + "'";
                    else return value;
                });
                // 绑定表达式参数数组
                var initValue:any = {};
                var args:any[] = [];
                var argsInited:boolean = false;
                var handler:(index:number, value:any)=>void = (index:number, value:any)=>{
                    // 将value中的undefined和null恢复回去
                    if(value === undefinedValue) value = undefined;
                    else if(value == nullValue) value = null;
                    // 设置参数值
                    args[index] = value;
                    // 判断参数是否齐全
                    if(!argsInited)
                    {
                        for(var arg of args)
                        {
                            // 如果列表里存在初始值，表示没有赋值完毕，直接返回
                            if(arg === initValue) return;
                        }
                        // 设置初始化完毕状态
                        argsInited = true;
                    }
                    // 赋值已经完毕了，调用方法，this指向ui本身
                    ui[key].apply(ui, args);
                };
                // 循环绑定表达式到handler
                for(var i:number = 0, len:number = exps.length; i < len; i++)
                {
                    // 记录一个初始值，用于判断参数列表是否已赋值完毕
                    args.push(initValue);
                }
                for(var i:number = 0, len:number = exps.length; i < len; i++)
                {
                    // 绑定表达式
                    bindData.bind.createWatcher(ui, exps[i], handler.bind(this, i), mediator.viewModel, ...this._envModel);
                }
            }
            else
            {
                // 无参数执行，无需绑定，一次性执行即可
                ui[key]();
            }
        });
    }

    /**
     * 绑定事件
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} ui 绑定到的ui实体对象
     * @param {{[type:string]:any}} evtDict 事件字典
     * @memberof BindManager
     */
    public bindOn(mediator:IMediator, ui:any, evtDict:{[type:string]:any}):void
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
                var func:Function = createRunFunc(exp, 2 + this._envModel.length);
                // 这里要转一手，记到闭包里一个副本，否则因为bindOn是延迟操作，到时envModel可能已被修改
                var envModel:any[] = this._envModel.concat();
                handler = function():void
                {
                    func.call(this, mediator.viewModel, ...envModel, commonScope);
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
     * @param {*} ui 绑定到的ui实体对象
     * @param {{[name:string]:any}} uiDict 判断字典
     * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
     * @memberof BindManager
     */
    public bindIf(mediator:IMediator, ui:any, uiDict:{[name:string]:any}, callback?:(value:boolean)=>void):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        var replacer:any = mediator.bridge.createEmptyDisplay();
        this.delaySearch(mediator, uiDict, ui, (ui:any, key:string, exp:string)=>{
            // 寻址到指定目标
            ui = ui[key] || ui;
            // 绑定表达式
            bindData.bind.createWatcher(ui, exp, (value:boolean)=>{
                // 如果表达式为true则显示ui，否则移除ui
                if(value) this.replaceDisplay(mediator.bridge, replacer, ui);
                else this.replaceDisplay(mediator.bridge, ui, replacer);
                // 触发回调
                callback && callback(value);
            }, mediator.viewModel, ...this._envModel);
        });
    }

    private _regExp:RegExp = /^\s*(\w+)\s+((in)|(of))\s+(.+?)\s*$/;
    /**
     * 绑定循环
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} ui 绑定到的ui实体对象
     * @param {{[name:string]:any}} uiDict 循环表达式字典，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）
     * @param {(data?:any, renderer?:any)=>void} [callback] 每次生成新的renderer实例时调用这个回调
     * @memberof BindManager
     */
    public bindFor(mediator:IMediator, ui:any, uiDict:{[name:string]:any}, callback?:(data?:any, renderer?:any)=>void):void
    {
        var bindData:BindData = this._bindDict.get(mediator);
        var replacer:any = mediator.bridge.createEmptyDisplay();
        this.delaySearch(mediator, uiDict, ui, (ui:any, key:string, exp:string)=>{
            // 寻址到指定目标
            ui = ui[key] || ui;
            // 解析表达式
            var res:RegExpExecArray = this._regExp.exec(exp);
            if(!res) return;
            // 包装渲染器创建回调
            var memento:any = mediator.bridge.wrapBindFor(ui, (key:any, value:any, renderer:any)=>{
                // 设置环境变量
                var commonScope:any = {
                    $key: key,
                    $value: value,
                    $item: renderer
                };
                // 填入用户声明的属性
                commonScope[res[1]] = (res[2] == "in" ? key : value);
                // 插入环境变量
                this._envModel.push(commonScope);
                // 触发回调
                callback && callback(value, renderer);
                // 移除环境变量
                this._envModel.splice(this._envModel.indexOf(commonScope), 1);
            });
            // 获得要遍历的数据集合
            var bindData:BindData = this._bindDict.get(mediator);
            bindData.bind.createWatcher(ui, res[5], (datas:any)=>{
                // 赋值
                mediator.bridge.valuateBindFor(ui, datas, memento);
            }, mediator.viewModel, ...this._envModel);
        });
    }
    
    /**
     * 绑定全局Message
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} ui 绑定到的ui实体对象
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {{[name:string]:any}} uiDict ui表达式字典
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindMessage(mediator:IMediator, ui:any, type:IConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
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
                    ui[key] = evalExp(exp, mediator.viewModel, msg, mediator.viewModel, ...this._envModel, commonScope);
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
     * @param {*} ui 绑定到的ui实体对象
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {{[name:string]:any}} uiDict ui表达式字典
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindResponse(mediator:IMediator, ui:any, type:IResponseDataConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
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
                    ui[key] = evalExp(exp, mediator.viewModel, response, mediator.viewModel, ...this._envModel, commonScope);
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

export interface BindFuncDict
{
    [name:string]:string[]|string|undefined|BindFuncDict;
}

interface BindData
{
    bind:Bind;
    callbacks:(()=>void)[];
}

/** 再额外导出一个单例 */
export const bindManager:BindManager = core.getInject(BindManager);