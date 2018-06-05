import "reflect-metadata";
import { core } from "../../core/Core";
import { decorateThis } from "../../core/global/Patch";
import { Injectable } from "../../core/injector/Injector";
import Message from "../../core/message/Message";
import IObservable from "../../core/observable/IObservable";
import { listenApply, listenConstruct, listenDispose, wrapConstruct } from "../../utils/ConstructUtil";
import Dictionary from "../../utils/Dictionary";
import { replaceDisplay } from "../../utils/DisplayUtil";
import { EvalExp, evalExp } from "../bind/Utils";
import { bridgeManager } from "../bridge/BridgeManager";
import IBridge from "../bridge/IBridge";
import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
import Mediator, { registerModule } from "../mediator/Mediator";
import MediatorStatus from "../mediator/MediatorStatus";
import { netManager } from "../net/NetManager";
import ResponseData, { IResponseDataConstructor } from "../net/ResponseData";
import * as BindUtil from "./BindUtil";
import { searchUI } from "./BindUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * 负责注入的模块
*/

/** 定义数据模型，支持实例注入，并且自身也会被注入 */
export function ModelClass(...args:any[]):any
{
    // 转调Injectable方法
    if(this === decorateThis)
    {
        var cls:IConstructor = wrapConstruct(args[0]);
        Injectable.call(this, cls);
        return cls;
    }
    else
    {
        var result:ClassDecorator = Injectable.apply(this, args);
        return function(realCls:IConstructor):IConstructor
        {
            realCls = wrapConstruct(realCls);
            result.call(this, realCls);
            return realCls;
        };
    }
}

/** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
export function MediatorClass(moduleName:string):ClassDecorator
{
    return function(cls:IConstructor):IConstructor
    {
        // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
        if(!cls.prototype.dispose)
            console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
        // 监听实例化
        listenConstruct(cls, function(instance:IMediator):void
        {
            // 替换skin属性
            var $skin:any;
            var oriSkin = instance.skin;
            Object.defineProperty(instance, "skin", {
                configurable: true,
                enumerable: true,
                get: function():any
                {
                    return $skin;
                },
                set: function(value:any):void
                {
                    if(value === $skin) return;
                    var lastBridge:IBridge = this.bridge;
                    // 根据skin类型选取表现层桥
                    this.bridge = bridgeManager.getBridgeBySkin(value);
                    // 记录值
                    if(this.bridge)
                    {
                        if(this.bridge === lastBridge && $skin)
                        {
                            // 需要判断桥的类型是否相同，且之前有皮肤，则替换皮肤
                            $skin = this.bridge.replaceSkin(this, $skin, value);
                        }
                        else
                        {
                            // 否则直接包装一下皮肤
                            $skin = this.bridge.wrapSkin(this, value);
                        }
                    }
                    else 
                    {
                        // 不认识的皮肤类型，直接赋值
                        $skin = value;
                    }
                }
            });
            // 如果本来就有皮肤，则赋值皮肤
            if(oriSkin)
                instance.skin = oriSkin;
        });
        // 包装类
        var wrapperCls:IMediatorConstructor = <IMediatorConstructor>wrapConstruct(cls);
        // 注册模块，每一个Mediator都有成为独立Module的能力
        registerModule(moduleName, wrapperCls);
        // 返回包装类
        return wrapperCls;
    } as ClassDecorator;
}

/** 处理消息 */
export function MessageHandler(prototype:any, propertyKey:string):void;
export function MessageHandler(type:string):MethodDecorator;
export function MessageHandler(target:string|any, key?:string):MethodDecorator
{
    if(key)
    {
        var defs:[IConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IConstructor = defs[0];
        if(!(resClass.prototype instanceof Message))
            throw new Error("@MessageHandler装饰器装饰的方法的首个参数必须是Message");
        doMessageHandler(target.constructor, key, resClass, true);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doMessageHandler(prototype.constructor, propertyKey, target, true);
        };
    }
};

/** 处理全局消息 */
export function GlobalMessageHandler(prototype:any, propertyKey:string):void;
export function GlobalMessageHandler(type:string):MethodDecorator;
export function GlobalMessageHandler(target:string|any, key?:string):MethodDecorator
{
    if(key)
    {
        var defs:[IConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IConstructor = defs[0];
        if(!(resClass.prototype instanceof Message))
            throw new Error("@GlobalMessageHandler装饰器装饰的方法的首个参数必须是Message");
            doMessageHandler(target.constructor, key, resClass, false);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doMessageHandler(prototype.constructor, propertyKey, target, false);
        };
    }
};
function doMessageHandler(cls:IConstructor, key:string, type:IConstructor, inModule:boolean):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:IObservable):void
    {
        if(instance instanceof Mediator && instance.parent)
        {
            // 如果是被托管的Mediator，则需要等到被托管后再执行注册
            addSubHandler(instance, ()=>{
                var observable:IObservable = inModule ? instance.observable || core.observable : core.observable;
                observable.listen(type, instance[key], instance);
            });
        }
        else
        {
            var observable:IObservable = inModule ? instance.observable || core.observable : core.observable;
            observable.listen(type, instance[key], instance);
        }
    });
    // 监听销毁
    listenDispose(cls, function(instance:IObservable):void
    {
        var observable:IObservable = inModule ? instance.observable || core.observable : core.observable;
        observable.unlisten(type, instance[key], instance);
    });
}

/** 处理通讯消息返回 */
export function ResponseHandler(prototype:any, propertyKey:string):void;
export function ResponseHandler(cls:IResponseDataConstructor):MethodDecorator;
export function ResponseHandler(target:any, key?:string):MethodDecorator|void
{
    if(key)
    {
        var defs:[IResponseDataConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IResponseDataConstructor = defs[0];
        if(!(resClass.prototype instanceof ResponseData))
            throw new Error("无参数@ResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
        doResponseHandler(target.constructor, key, defs[0], true);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doResponseHandler(prototype.constructor, propertyKey, target, true);
        };
    }
}
/** 处理全局通讯消息返回 */
export function GlobalResponseHandler(prototype:any, propertyKey:string):void;
export function GlobalResponseHandler(cls:IResponseDataConstructor):MethodDecorator;
export function GlobalResponseHandler(target:any, key?:string):MethodDecorator|void
{
    if(key)
    {
        var defs:[IResponseDataConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IResponseDataConstructor = defs[0];
        if(!(resClass.prototype instanceof ResponseData))
            throw new Error("无参数@GlobalResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
        doResponseHandler(target.constructor, key, defs[0], false);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doResponseHandler(prototype.constructor, propertyKey, target, false);
        };
    }
}
function doResponseHandler(cls:IConstructor, key:string, type:IResponseDataConstructor, inModule:boolean):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:IObservable):void
    {
        if(instance instanceof Mediator && instance.parent)
        {
            // 如果是被托管的Mediator，则需要等到被托管后再执行注册
            addSubHandler(instance, ()=>{
                netManager.listenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
            });
        }
        else
        {
            netManager.listenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
        }
    });
    // 监听销毁
    listenDispose(cls, function(instance:IObservable):void
    {
        netManager.unlistenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
    });
}

var subHandlerDict:Dictionary<IMediator, ((instance:IMediator)=>void)[]> = new Dictionary();
function addSubHandler(instance:IMediator, handler:(instance?:IMediator)=>void):void
{
    if(!instance) return;
    var handlers:((instance:IMediator)=>void)[] = subHandlerDict.get(instance);
    if(!handlers) subHandlerDict.set(instance, handlers = []);
    if(handlers.indexOf(handler) < 0) handlers.push(handler);
}

function isMediator(target:any):boolean
{
    return (target.delegateMediator instanceof Function && target.undelegateMediator instanceof Function);
}

/** 添加子Mediator */
export function SubMediator(dataExp?:string):PropertyDecorator;
export function SubMediator(mediatorCls:IMediatorConstructor, dataExp?:string):PropertyDecorator;
export function SubMediator(skin:any, mediatorCls?:IMediatorConstructor, dataExp?:string):PropertyDecorator;
export function SubMediator(prototype:any, propertyKey:string):void;
export function SubMediator(arg1:any, arg2?:any, arg3?:string):any
{
    var oriSkin:any;
    var mediatorCls:IMediatorConstructor;
    var dataExp:string;
    // 判断是否是参数化装饰
    if(this === decorateThis)
    {
        // 无参数
        doSubMediator(arg1, arg2);
    }
    else
    {
        // 有参数，分配参数
        if(typeof arg1 === "string" && !arg2 && !arg3)
        {
            dataExp = arg1;
        }
        else if(arg1 instanceof Function)
        {
            mediatorCls = arg1;
            dataExp = arg2;
        }
        else
        {
            oriSkin = arg1;
            mediatorCls = arg2;
            dataExp = arg3;
        }
        // 返回装饰器方法
        return doSubMediator;
    }

    function doSubMediator(prototype:any, propertyKey:string):void
    {
        if(isMediator(prototype))
        {
            // 监听实例化
            listenConstruct(prototype.constructor, function(instance:IMediator):void
            {
                var skin:any = oriSkin;
                var declaredCls:any = Reflect.getMetadata("design:type", prototype, propertyKey);
                var declaredMediatorCls:any;
                if(isMediator(declaredCls.prototype))
                    declaredMediatorCls = declaredCls;
                var mediator:IMediator;
                var temp:IMediator = instance[propertyKey];
                // 篡改属性
                Object.defineProperty(instance, propertyKey, {
                    configurable: true,
                    enumerable: true,
                    get: function():any
                    {
                        // 如果类型声明为Mediator，则返回Mediator，否则返回皮肤本身
                        return (declaredMediatorCls ? mediator : skin);
                    },
                    set: function(value:any):void
                    {
                        if(value instanceof Mediator)
                        {
                            // 取消托管中介者
                            if(mediator)
                            {
                                this.undelegateMediator(mediator);
                            }
                            // 设置中介者
                            mediator = value;
                            // 托管新的中介者
                            if(mediator)
                            {
                                // 如果当前中介者没有皮肤就用装饰器皮肤
                                if(skin && !mediator.skin) mediator.skin = skin;
                            }
                        }
                        else if(value)
                        {
                            // 赋值皮肤
                            skin = value;
                            // 如果存在中介者，则额外赋值中介者皮肤
                            if(mediator)
                            {
                                if(mediator.skin && mediator.status < MediatorStatus.OPENED)
                                {
                                    // 当前有皮肤且中介者尚未打开完毕，说明是现在是皮肤转发阶段，要用老皮肤替换新皮肤的位置
                                    replaceDisplay(mediator.bridge, value, mediator.skin);
                                    // 同步位置
                                    mediator.bridge.syncSkin(value, mediator.skin);
                                }
                                else
                                {
                                    // 当前没皮肤，或者中介者已经打开完毕了，说明新皮肤就是要替换老皮肤
                                    mediator.skin = value;
                                }
                            }
                        }
                        else
                        {
                            // mediator和skin都赋值为空
                            skin = value;
                            if(mediator)
                            {
                                mediator.skin = value;
                            }
                            mediator = value;
                        }
                        // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                        if(mediator)
                        {
                            // 托管中介者
                            this.delegateMediator(mediator);
                            // 如果当前中介者已经为正在打开或已打开状态，则额外调用open
                            if(mediator.skin)
                            {
                                if(mediator.status === MediatorStatus.UNOPEN)
                                {
                                    var getCommonScope:()=>any = ()=>{
                                        return {
                                            $this: this,
                                            $data: this.viewModel,
                                            $bridge: this.bridge,
                                            $currentTarget: mediator,
                                            $target: mediator
                                        };
                                    };
                                    // 子Mediator还没有open，open之
                                    if(this.status === MediatorStatus.OPENED)
                                    {
                                        // 父Mediator已经open了，直接open之
                                        var data:any = dataExp ? evalExp(dataExp, this.viewModel, this.viewModel, this.data, getCommonScope()) : this.data;
                                        if(!data) data = this.data;
                                        // 执行open方法
                                        mediator.open(data);
                                    }
                                    else if(this.status < MediatorStatus.OPENED && dataExp)
                                    {
                                        // 父Mediator也没有open，监听子Mediator的open，篡改参数
                                        listenApply(mediator, "open", ()=>{
                                            var data:any = evalExp(dataExp, this.viewModel, this.viewModel, this.data, getCommonScope());
                                            if(data) return [data];
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                // 实例化
                if(temp)
                {
                    instance[propertyKey] = temp;
                }
                else if(temp === undefined)
                {
                    // 优先使用是中介者类的元数据类型，其次使用装饰器提供的中介者类型
                    var cls:IConstructor = declaredMediatorCls || mediatorCls;
                    if(!cls) throw new Error("必须在类型声明或装饰器中至少一处提供Mediator的类型");
                    instance[propertyKey] = temp = new cls(skin);
                }
                // 执行回调
                var handlers:((instance:IMediator)=>void)[] = subHandlerDict.get(mediator);
                if(handlers)
                {
                    for(var handler of handlers)
                    {
                        handler(mediator);
                    }
                    // 移除记录
                    subHandlerDict.delete(mediator);
                }
            });
            // 监听销毁
            listenDispose(prototype.constructor, function(instance:IMediator):void
            {
                var mediator:IMediator = instance[propertyKey];
                if(mediator)
                {
                    // 移除实例
                    instance[propertyKey] = undefined;
                }
            });
        }
    }
}

var onOpenDict:Dictionary<IMediator, number> = new Dictionary();
function _listenOnOpen(prototype:any, before?:(mediator:IMediator)=>void, after?:(mediator:IMediator)=>void):void
{
    listenApply(prototype.constructor, "onOpen", function(mediator:IMediator):void
    {
        // 记录onOpen篡改次数
        var count:number = onOpenDict.get(mediator) || 0;
        onOpenDict.set(mediator, count + 1);
        // 调用回调
        before && before(mediator);
    }, function(mediator:IMediator):void
    {
        // 调用回调
        after && after(mediator);
        // 递减篡改次数
        var count:number = onOpenDict.get(mediator) - 1;
        onOpenDict.set(mediator, count);
        // 判断是否所有onOpen都调用完毕，如果完毕了，则启动编译过程
        if(count <= 0)
        {
            // 移除数据
            onOpenDict.delete(mediator);
            // 全调用完毕了，按层级顺序由浅入深编译
            var bindTargets:Dictionary<any, any>[] = mediator.bindTargets;
            for(var depth in bindTargets)
            {
                var dict:Dictionary<any, any> = bindTargets[depth];
                dict.forEach(currentTarget=>BindUtil.compile(mediator, currentTarget));
            }
        }
    });
}

/**
 * 获取显示对象在mediator.skin中的嵌套层级
 * 
 * @param {IMediator} mediator 中介者
 * @param {*} target 目标显示对象
 * @returns {number} 
 */
function getDepth(mediator:IMediator, target:any):number
{
    var skin:any = mediator.skin;
    var bridge:IBridge = mediator.bridge;
    var depth:number = 0;
    if(bridge.isMySkin(target))
    {
        while(target && target !== skin)
        {
            depth ++;
            target = bridge.getParent(target);
        }
        // 如果显示对象是没有根的，或者不在skin的显示树中，则返回0
        if(!target) depth = 0;
    }
    return depth;
}

function searchUIDepth(values:any, mediator:IMediator, target:any, callback:(currentTarget:any, target:any, key:string, value:any, leftHandlers?:BindUtil.IStopLeftHandler[], index?:number)=>void, addressing:boolean=false):void
{
    // 获取显示层级
    var depth:number = getDepth(mediator, target);
    // 如果有中断编译则将遍历的工作推迟到中断重启后，否则直接开始遍历
    var stopLeftHandlers:BindUtil.IStopLeftHandler[] = target.__stop_left_handlers__;
    if(stopLeftHandlers) stopLeftHandlers.push(handler);
    else handler(target, mediator.bindTargets, stopLeftHandlers);

    function handler(target:any, bindTargets:Dictionary<any, any>[], leftHandlers:BindUtil.IStopLeftHandler[]):void
    {
        var index:number = -1;
        if(leftHandlers) index = leftHandlers.indexOf(handler);
        // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
        searchUI(values, target, (currentTarget:any, name:string, exp:string, depth:number)=>{
            if(addressing) currentTarget = currentTarget[name];
            // 记录当前编译目标和命令本体目标到bindTargets中
            var dict:Dictionary<any, any> = bindTargets[depth];
            if(!dict) bindTargets[depth] = dict = new Dictionary();
            dict.set(currentTarget, target);
            // 调用回调
            callback(currentTarget, target, name, exp, leftHandlers, index);
        }, depth);
    }
}

/**
 * 一次绑定多个属性
 * 
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindValue(uiDict:{[path:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个属性
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindValue(path:string, exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindValue(arg1:{[path:string]:any}|string, arg2?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            // 组织参数字典
            var uiDict:{[name:string]:any};
            if(typeof arg1 == "string")
            {
                uiDict = {};
                uiDict[arg1] = arg2;
            }
            else
            {
                uiDict = arg1;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = mediator[propertyKey];
            searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileValue, name, exp);
            });
        });
    };
}

/**
 * 只执行表达式，不赋值
 * 
 * @export
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindExp(exp:EvalExp):PropertyDecorator;
/**
 * 只执行表达式，不赋值
 * 
 * @export
 * @param {EvalExp[]} exps 表达式或方法数组
 * @returns {PropertyDecorator} 
 */
export function BindExp(exps:EvalExp[]):PropertyDecorator;
/**
 * @private
 */
export function BindExp(exp:EvalExp|EvalExp[]):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            // 组织参数字典
            var uiDict:{[name:string]:any} = {};
            if(exp instanceof Array)
            {
                for(var key in exp)
                {
                    uiDict[key] = exp[key];
                }
            }
            else
            {
                uiDict[""] = exp;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = mediator[propertyKey];
            searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileExp, exp);
            });
        });
    };
}

export interface BindFuncDict
{
    [path:string]:(EvalExp)|(EvalExp)[]|undefined|BindFuncDict;
}

/**
 * 一次绑定多个方法
 * 
 * @export
 * @param {BindFuncDict} funcDict ui方法和表达式或方法字典
 * @returns {PropertyDecorator} 
 */
export function BindFunc(funcDict:BindFuncDict):PropertyDecorator;
/**
 * 一次绑定一个方法
 * 
 * @export
 * @param {string} path ui方法路径
 * @param {(EvalExp)|(EvalExp)[]} [exp] 参数表达式或参数表达式数组
 * @returns {PropertyDecorator} 
 */
export function BindFunc(path:string, exp?:(EvalExp)|(EvalExp)[]):PropertyDecorator;
/**
 * @private
 */
export function BindFunc(arg1:BindFuncDict|string, arg2?:(EvalExp)|(EvalExp)[]):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            // 组织参数字典
            var funcDict:BindFuncDict;
            if(typeof arg1 == "string")
            {
                funcDict = {};
                funcDict[arg1] = arg2;
            }
            else
            {
                funcDict = arg1;
            }
            // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
            var target:any = mediator[propertyKey];
            searchUIDepth(funcDict, mediator, target, (currentTarget:any, target:any, name:string, argExps:(EvalExp)|(EvalExp)[])=>{
                // 统一参数类型为字符串数组
                if(!(argExps instanceof Array)) argExps = [argExps];
                // 添加编译指令
                BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFunc, name, ...argExps);
            });
        });
    };
}

/**
 * 一次绑定多个事件
 * 
 * @export
 * @param {{[type:string]:any}} evtDict 事件类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindOn(evtDict:{[type:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个事件
 * 
 * @export
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindOn(type:string, exp:EvalExp):PropertyDecorator;
/**
 * 为指定对象一次绑定一个事件
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindOn(path:string, type:string, exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindOn(arg1:{[type:string]:any}|string, arg2?:EvalExp, arg3?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 组织参数字典
            if(typeof arg1 == "string")
            {
                if(arg3)
                {
                    // 指定了UI对象，先去寻找
                    var nameDict:any = {};
                    nameDict[arg1] = "";
                    searchUIDepth(nameDict, mediator, target, function (currentTarget, target, type, exp) {
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, arg2, arg3);
                    }, true);
                }
                else
                {
                    var evtDict:any = {};
                    evtDict[arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(evtDict, mediator, target, (currentTarget:any, target:any, type:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                    });
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, mediator, target, (currentTarget:any, target:any, type:string, exp:string)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileOn, type, exp);
                });
            }
        });
    };
}

/**
 * 一次绑定多个显示判断
 * 
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindIf(uiDict:{[path:string]:any}):PropertyDecorator;
/**
 * 一次绑定一个显示判断
 * 
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindIf(path:string, exp:EvalExp):PropertyDecorator;
/**
 * 绑定当前显示对象的显示判断
 * 
 * @export
 * @param {string} exp 表达式或方法
 * @returns {PropertyDecorator} 
 */
export function BindIf(exp:EvalExp):PropertyDecorator;
/**
 * @private
 */
export function BindIf(arg1:{[path:string]:any}|EvalExp, arg2?:EvalExp):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 === "string" || arg1 instanceof Function)
            {
                if(!arg2)
                {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({r: 13}, mediator, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, arg1);
                    });
                }
                else
                {
                    // 指定了寻址路径，需要寻址
                    var uiDict:{[name:string]:any} = {};
                    uiDict[<string>arg1] = arg2;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                    }, true);
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(arg1, mediator, target, (currentTarget:any, target:any, name:string, exp:string)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileIf, exp);
                }, true);
            }
        });
    };
}


/**
 * 一次绑定多个数据集合，如果要指定当前显示对象请使用$target作为key
 * 
 * @export
 * @param {{[name:string]:any}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindFor(uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * 绑定数据集合到当前显示对象
 * 
 * @export
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IMediatorConstructor} [mediatorCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator} 
 */
export function BindFor(exp:string, mediatorCls?:IMediatorConstructor, dataExp?:string):PropertyDecorator;
/**
 * 绑定数据集合到指定对象
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IMediatorConstructor} [mediatorCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator} 
 */
export function BindFor(name:string, exp:string, mediatorCls?:IMediatorConstructor, dataExp?:string):PropertyDecorator;
/**
 * @private
 */
export function BindFor(arg1:{[name:string]:any}|string, arg2?:any, arg3?:any, arg4?:string):PropertyDecorator
{
    // 组织参数
    var uiDict:{[name:string]:any};
    var name:string;
    var exp:string;
    var mediatorCls:IMediatorConstructor;
    var dataExp:string;
    if(typeof arg1 === "string")
    {
        if(typeof arg2 === "string")
        {
            name = arg1;
            exp = arg2;
            mediatorCls = arg3;
            dataExp = arg4;
        }
        else
        {
            exp = arg1;
            mediatorCls = arg2;
            dataExp = arg3;
        }
    }
    else
    {
        uiDict = arg1;
    }
    return function(prototype:any, propertyKey:string):void
    {
        var declaredCls:any = Reflect.getMetadata("design:type", prototype, propertyKey);
        var declaredMediatorCls:any;
        if(isMediator(declaredCls.prototype))
            declaredMediatorCls = declaredCls;
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            // 取到编译目标对象
            var target:any = mediator[propertyKey];
            // 开始赋值指令
            if(!uiDict)
            {
                if(!name)
                {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({r: 13}, mediator, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, exp, mediatorCls, declaredMediatorCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    });
                }
                else
                {
                    // 指定了寻址路径，需要寻址
                    var uiDict:{[name:string]:any} = {};
                    uiDict[name] = exp;
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                        // 添加编译指令
                        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, mediatorCls, declaredMediatorCls, dataExp);
                        // 设置中断编译
                        target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                    }, true);
                }
            }
            else
            {
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, _name:string, _exp:string, leftHandlers:BindUtil.IStopLeftHandler[], index?:number)=>{
                    // 添加编译指令
                    BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileFor, propertyKey, _exp, mediatorCls, declaredMediatorCls, dataExp);
                    // 设置中断编译
                    target.__stop_left_handlers__ = leftHandlers ? leftHandlers.splice(index + 1, leftHandlers.length - index - 1) : [];
                }, true);
            }
        });
    };
}

function doBindMessage(mediator:IMediator, target:any, type:IConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileMessage, type, name, exp, observable);
    });
}

/**
 * 一次绑定多个消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:any}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindMessage(msgDict:{[type:string]:{[name:string]:any}}):PropertyDecorator;
/**
 * 一次绑定一个消息
 * 
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindMessage(type:IConstructor|string, uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * @private
 */
export function BindMessage(arg1:{[type:string]:{[name:string]:any}}|IConstructor|string, arg2?:{[name:string]:any}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindMessage(mediator, target, <any>arg1, arg2, mediator.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindMessage(mediator, target, type, arg1[type], mediator.observable);
                }
            }
        });
    };
}

/**
 * 一次绑定多个全局消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:any}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindGlobalMessage(msgDict:{[type:string]:{[name:string]:any}}):PropertyDecorator;
/**
 * 一次绑定一个全局消息
 * 
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindGlobalMessage(type:IConstructor|string, uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * @private
 */
export function BindGlobalMessage(arg1:{[type:string]:{[name:string]:any}}|IConstructor|string, arg2?:{[name:string]:any}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindMessage(mediator, target, <any>arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindMessage(mediator, target, type, arg1[type]);
                }
            }
        });
    };
}

function doBindResponse(mediator:IMediator, target:any, type:IResponseDataConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    searchUIDepth(uiDict, mediator, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
        BindUtil.pushCompileCommand(currentTarget, target, BindUtil.compileResponse, type, name, exp, observable);
    });
}

/**
 * 一次绑定多个通讯消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:any}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindResponse(resDict:{[type:string]:{[name:string]:any}}):PropertyDecorator;
/**
 * 一次绑定一个通讯消息
 * 
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindResponse(type:IResponseDataConstructor|string, uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * @private
 */
export function BindResponse(arg1:{[type:string]:{[name:string]:any}}|IResponseDataConstructor|string, arg2?:{[name:string]:any}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        // Response需要在onOpen之后执行，因为可能有初始化消息需要绑定，要在onOpen后有了viewModel再首次更新显示
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindResponse(mediator, target, <any>arg1, arg2, mediator.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindResponse(mediator, target, type, arg1[type], mediator.observable);
                }
            }
        });
    };
}

/**
 * 一次绑定多个全局通讯消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:any}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindGlobalResponse(resDict:{[type:string]:{[name:string]:any}}):PropertyDecorator;
/**
 * 一次绑定一个全局通讯消息
 * 
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindGlobalResponse(type:IResponseDataConstructor|string, uiDict:{[name:string]:any}):PropertyDecorator;
/**
 * @private
 */
export function BindGlobalResponse(arg1:{[type:string]:{[name:string]:any}}|IResponseDataConstructor|string, arg2?:{[name:string]:any}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        _listenOnOpen(prototype, (mediator:IMediator)=>{
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindResponse(mediator, target, <any>arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindResponse(mediator, target, type, arg1[type]);
                }
            }
        });
    };
}