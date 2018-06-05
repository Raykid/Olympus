import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import IObservable from "../../core/observable/IObservable";
import Dictionary from "../../utils/Dictionary";
import { replaceDisplay } from "../../utils/DisplayUtil";
import { extendObject, getObjectHashs } from "../../utils/ObjectUtil";
import IBridge from "../bridge/IBridge";
import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
import { netManager } from "../net/NetManager";
import { IResponseDataConstructor } from "../net/ResponseData";
import Bind from "./Bind";
import { EvalExp, createRunFunc, evalExp } from "./Utils";
import { IWatcher } from "./Watcher";

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
        if(bindData)
        {
            bindData.bind.dispose();
            this._bindDict.delete(mediator);
        }
        return bindData && bindData.bind;
    }

    private addBindHandler(mediator:IMediator, callback:()=>void):void
    {
        var handler:()=>void = ()=>{
            // 判断数据是否合法
            if(!mediator.viewModel) return;
            // 开始绑定
            callback();
        };
        // 添加绑定数据
        var bindData:BindData = this._bindDict.get(mediator);
        if(bindData.callbacks.indexOf(handler) < 0)
            bindData.callbacks.push(handler);
        // 立即调用一次
        handler();
    }

    private getNearestAncestor(bridge:IBridge, target:any, propName:string):any
    {
        if(!target || target[propName]) return target;
        else return this.getNearestAncestor(bridge, bridge.getParent(target), propName);
    }

    /**
     * 绑定属性值
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的属性名
     * @param {(EvalExp)} exp 绑定的表达式或方法
     * @memberof BindManager
     */
    public bindValue(mediator:IMediator, currentTarget:any, target:any, envModels:any[], name:string, exp:EvalExp):void
    {
        var watcher:IWatcher;
        var bindData:BindData = this._bindDict.get(mediator);
        this.addBindHandler(mediator, ()=>{
            // 如果之前绑定过，则要先销毁之
            if(watcher) watcher.dispose();
            // 绑定新的订阅者
            watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:any)=>{
                currentTarget[name] = value;
            }, mediator.viewModel, ...envModels, mediator.viewModel);
        });
    }

    /**
     * 绑定一个表达式，与bindValue类似，但不会给属性赋值
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {(EvalExp)} exp 绑定的表达式或方法
     * @memberof BindManager
     */
    public bindExp(mediator:IMediator, currentTarget:any, target:any, envModels:any[], exp:EvalExp):void
    {
        var watcher:IWatcher;
        var bindData:BindData = this._bindDict.get(mediator);
        this.addBindHandler(mediator, ()=>{
            // 如果之前绑定过，则要先销毁之
            if(watcher) watcher.dispose();
            // 绑定新的订阅者
            watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:any)=>{
                // 不干任何事情
            }, mediator.viewModel, ...envModels, mediator.viewModel);
        });
    }

    /**
     * 绑定方法执行
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的方法名
     * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
     * @memberof BindManager
     */
    public bindFunc(mediator:IMediator, currentTarget:any, target:any, envModels:any[], name:string, ...argExps:(EvalExp)[]):void
    {
        var watchers:IWatcher[] = [];
        var bindData:BindData = this._bindDict.get(mediator);
        this.addBindHandler(mediator, ()=>{
            // 判断参数数量，无参数方法一次性执行即可，无需绑定，有参数的方法则需要每次参数改变就执行一次
            if(argExps.length > 0)
            {
                // 将表达式中所有undefined和null变为内部值
                var undefinedValue:string = Date.now() * Math.random() + "_undefined";
                var nullValue:string = Date.now() * Math.random() + "_null";
                argExps = argExps.map(exp=>{
                    if(exp === undefined) return "'" + undefinedValue + "'";
                    else if(exp === null) return "'" + nullValue + "'";
                    else return exp;
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
                    currentTarget[name].apply(currentTarget, args);
                };
                // 清理旧的订阅者
                for(var i:number = 0, len:number = watchers.length; i < len; i++)
                {
                    watchers.shift().dispose();
                }
                // 循环绑定表达式到handler
                for(var i:number = 0, len:number = argExps.length; i < len; i++)
                {
                    // 记录一个初始值，用于判断参数列表是否已赋值完毕
                    args.push(initValue);
                }
                for(var i:number = 0, len:number = argExps.length; i < len; i++)
                {
                    // 绑定表达式
                    var watcher:IWatcher = bindData.bind.createWatcher(currentTarget, target, argExps[i], handler.bind(this, i), mediator.viewModel, ...envModels, mediator.viewModel);
                    // 记录订阅者
                    watchers.push(watcher);
                }
            }
            else
            {
                // 无参数执行，无需绑定，一次性执行即可
                target[name]();
            }
        });
    }

    /**
     * 绑定事件
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} type 绑定的事件类型
     * @param {EvalExp} exp 绑定的事件回调表达式或方法
     * @memberof BindManager
     */
    public bindOn(mediator:IMediator, currentTarget:any, target:any, envModels:any[], type:string, exp:EvalExp):void
    {
        this.addBindHandler(mediator, ()=>{
            var commonScope:any = {
                $this: mediator,
                $data: mediator.viewModel,
                $bridge: mediator.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            // 计算事件hash
            var onHash:string = getObjectHashs(currentTarget, type, exp);
            // 如果之前添加过监听，则先移除之
            var handler:Function = currentTarget[onHash];
            if(handler)
            {
                mediator.bridge.unmapListener(currentTarget, type, handler, mediator.viewModel);
                handler = null;
            }
            // 先尝试用exp当做方法名去viewModel里寻找，如果找不到则把exp当做一个执行表达式处理，外面包一层方法
            if(typeof exp === "string") handler = mediator.viewModel[exp];
            if(!(handler instanceof Function))
            {
                var func:Function = createRunFunc(exp, 3 + envModels.length);
                // 这里要转一手，记到闭包里一个副本，否则因为bindOn是延迟操作，到时envModel可能已被修改
                handler = function(event:any):void
                {
                    func.call(this, commonScope, ...envModels, mediator.viewModel, {$event: event});
                };
            }
            mediator.bridge.mapListener(currentTarget, type, handler, mediator.viewModel);
            // 将事件回调记录到显示对象上
            currentTarget[onHash] = handler;
            // 如果__bind_sub_events__列表存在，则将事件记录到其上
            var nearestAncestor:any = this.getNearestAncestor(mediator.bridge, target, "__bind_sub_events__");
            var events:BindEventData[] = (nearestAncestor || target).__bind_sub_events__;
            if(events)
            {
                events.push({
                    target: currentTarget,
                    type: type,
                    handler: handler,
                    thisArg: mediator.viewModel
                });
            }
        });
    }
    
    /**
     * 绑定显示
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {EvalExp} exp 绑定表达式或方法
     * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
     * @memberof BindManager
     */
    public bindIf(mediator:IMediator, currentTarget:any, target:any, envModels:any[], exp:EvalExp, callback?:(value:boolean)=>void):void
    {
        var watcher:IWatcher;
        var bindData:BindData = this._bindDict.get(mediator);
        var replacer:any = mediator.bridge.createEmptyDisplay();
        this.addBindHandler(mediator, ()=>{
            // 如果之前绑定过，则要先销毁之
            if(watcher) watcher.dispose();
            // 绑定表达式
            watcher = bindData.bind.createWatcher(currentTarget, target, exp, (value:boolean)=>{
                // 如果表达式为true则显示ui，否则移除ui
                if(value) replaceDisplay(mediator.bridge, replacer, currentTarget);
                else replaceDisplay(mediator.bridge, currentTarget, replacer);
                // 触发回调
                callback && callback(value);
            }, mediator.viewModel, ...envModels, mediator.viewModel);
        });
    }

    private _regExp:RegExp = /^\s*(\w+)\s+((in)|(of))\s+(.+?)\s*$/;
    /**
     * 绑定循环
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定本来所在的对象在Mediator中的名字
     * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
     * @param {IMediatorConstructor} [mediatorCls] 提供该参数将使用提供的中介者包装每一个渲染器
     * @param {IMediatorConstructor} [declaredMediatorCls] 声明的Mediator类型
     * @param {string} [dataExp] 提供给中介者包装器的数据表达式
     * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
     * @memberof BindManager
     */
    public bindFor(mediator:IMediator, currentTarget:any, target:any, envModels:any[], name:string, exp:string, mediatorCls?:IMediatorConstructor, declaredMediatorCls?:IMediatorConstructor, dataExp?:string, callback?:(data:any, renderer:any, envModels:any[])=>void):void
    {
        var watcher:IWatcher;
        var bindData:BindData = this._bindDict.get(mediator);
        var replacer:any = mediator.bridge.createEmptyDisplay();
        var subMediatorCache:IMediator[] = [];
        this.addBindHandler(mediator, ()=>{
            // 解析表达式
            var res:RegExpExecArray = this._regExp.exec(exp);
            if(!res) return;
            // 如果给出了声明的Mediator类型，则生成一个声明Mediator，替换掉mediator当前的皮肤
            var declaredMediator:IMediator
            if(declaredMediatorCls)
            {
                declaredMediator = new declaredMediatorCls(target);
                mediator.delegateMediator(declaredMediator);
                mediator[name] = declaredMediator;
            }
            // 包装渲染器创建回调
            var memento:any = mediator.bridge.wrapBindFor(currentTarget, (key:any, value:any, renderer:any)=>{
                // 设置环境变量
                var commonScope:any = {
                    $key: key,
                    $value: value,
                    $parent: envModels[0] || mediator.viewModel
                };
                // 填入用户声明的属性
                commonScope[res[1]] = (res[2] == "in" ? key : value);
                // 生成一个环境变量的副本
                var subEnvModels:any[] = envModels.concat();
                // 插入环境变量
                subEnvModels.unshift(commonScope);
                // 如果renderer已经有事件列表了，说明renderer是被重用的，删除所有事件
                var events:BindEventData[] = renderer.__bind_sub_events__;
                for(var i in events)
                {
                    var data:BindEventData = events.pop();
                    mediator.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
                }
                // 为renderer设置子对象事件列表
                if(!events) renderer.__bind_sub_events__ = [];
                // 为renderer套一个Mediator外壳
                if(mediatorCls)
                {
                    var subMediator:IMediator = new mediatorCls(renderer);
                    // 更新渲染器
                    if(subMediator.skin && subMediator.bridge === mediator.bridge)
                        renderer = subMediator.skin;
                    // 托管子中介者，优先托管在声明出来的中间中介者上
                    (declaredMediator || mediator).delegateMediator(subMediator);
                    // 开启该中介者，优先使用dataExp，如果没有则使用当前所有的数据
                    let data:any;
                    if(dataExp)
                    {
                        // 有数据表达式，求出数据表达式的值来
                        data = evalExp(dataExp, mediator.viewModel, ...subEnvModels.concat().reverse(), mediator.viewModel);
                    }
                    else
                    {
                        // 没有数据表达式，套用当前所在变量域，且要打平做成一个data
                        data = extendObject({}, mediator.viewModel, ...subEnvModels);
                    }
                    subMediator.open(data);
                    // 缓存子中介者
                    subMediatorCache.push(subMediator);
                }
                // 触发回调，进行内部编译
                callback && callback(value, renderer, subEnvModels);
            });
            // 如果之前绑定过，则要先销毁之
            if(watcher) watcher.dispose();
            // 获得要遍历的数据集合
            watcher = bindData.bind.createWatcher(currentTarget, target, res[5], (datas:any)=>{
                // 如果遍历的对象是个数字，则伪造一个临时数组供使用
                if(typeof datas === "number")
                {
                    var tempArr:number[] = [];
                    for(var i:number = 0; i < datas; i++)
                    {
                        tempArr.push(i);
                    }
                    datas = tempArr;
                }
                // 清空已有的子中介者
                for(var i:number = 0, len:number = subMediatorCache.length; i < len; i++)
                {
                    var subMediator:IMediator = subMediatorCache.shift();
                    mediator.undelegateMediator(subMediator);
                    subMediator.dispose();
                }
                // 赋值
                mediator.bridge.valuateBindFor(currentTarget, datas, memento);
            }, mediator.viewModel, ...envModels, mediator.viewModel);
        });
    }
    
    /**
     * 绑定Message
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindMessage(mediator:IMediator, currentTarget:any, target:any, envModels:any[], type:IConstructor|string, name:string, exp:EvalExp, observable?:IObservable):void
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
                // 设置通用属性
                var commonScope:any = {
                    $this: mediator,
                    $data: mediator.viewModel,
                    $bridge: mediator.bridge,
                    $currentTarget: currentTarget,
                    $target: target
                };
                currentTarget[name] = evalExp(exp, mediator.viewModel, msg, ...envModels, mediator.viewModel, commonScope);
            }
        };
        // 添加监听
        observable.listen(type, handler);
    }

    /**
     * 绑定Response
     * 
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    public bindResponse(mediator:IMediator, currentTarget:any, target:any, envModels:any[], type:IResponseDataConstructor|string, name:string, exp:EvalExp, observable?:IObservable):void
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
                // 设置通用属性
                var commonScope:any = {
                    $this: mediator,
                    $data: mediator.viewModel,
                    $bridge: mediator.bridge,
                    $currentTarget: currentTarget,
                    $target: target
                };
                currentTarget[name] = evalExp(exp, mediator.viewModel, response, ...envModels, mediator.viewModel, commonScope);
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

interface BindEventData
{
    target:any;
    type:string;
    handler:Function;
    thisArg:any;
}

/** 再额外导出一个单例 */
export const bindManager:BindManager = core.getInject(BindManager);