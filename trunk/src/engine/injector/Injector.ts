import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import Message from "../../core/message/Message";
import IObservable from "../../core/observable/IObservable";
import { wrapConstruct, listenConstruct, listenDispose, getConstructor } from "../../utils/ConstructUtil";
import ResponseData, { IResponseDataConstructor } from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";
import { bridgeManager } from "../bridge/BridgeManager";
import Mediator from "../mediator/Mediator";
import { moduleManager } from "../module/ModuleManager";
import IModuleDependent from "../module/IModuleDependent";
import IModuleMediator from "../mediator/IModuleMediator";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import * as BindUtil from "./BindUtil";

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
    if(this === undefined)
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
export function MediatorClass(cls:IConstructor):IConstructor
{
    // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
    // 监听实例化
    listenConstruct(cls, function(instance:any):void
    {
        // 替换setSkin方法
        var $skin:any;
        Object.defineProperty(instance, "skin", {
            configurable: true,
            enumerable: true,
            get: function():any
            {
                return $skin;
            },
            set: function(value:any):void
            {
                // 记录值
                $skin = value;
                // 根据skin类型选取表现层桥
                this.bridge = bridgeManager.getBridgeBySkin(value);
            }
        });
    });
    return wrapConstruct(cls);
}

/** 定义模块，支持实例注入 */
export function ModuleClass(cls:IModuleConstructor):IConstructor
{
    // 判断一下Module是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Module[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Module实现IDisposable接口");
    // 包装类
    var wrapperCls:IModuleConstructor = wrapConstruct(cls);
    // 注册模块
    moduleManager.registerModule(wrapperCls);
    // 返回包装类
    return wrapperCls;
}

/** 处理模块消息 */
export function ModuleMessageHandler(prototype:any, propertyKey:string):void;
export function ModuleMessageHandler(type:string):MethodDecorator;
export function ModuleMessageHandler(target:string|any, key?:string):MethodDecorator
{
    if(key)
    {
        var defs:[IConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IConstructor = defs[0];
        if(!(resClass.prototype instanceof Message))
            throw new Error("@ModuleMessageHandler装饰器装饰的方法的首个参数必须是Message");
        doModuleMessageHandler(target.constructor, key, resClass);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doModuleMessageHandler(prototype.constructor, propertyKey, target);
        };
    }
};
function doModuleMessageHandler(cls:IConstructor, key:string, type:IConstructor):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:IModuleDependent):void
    {
        if(instance instanceof Mediator)
        {
            // 如果是Mediator，则需要等到被托管后再执行注册
            addDelegateHandler(instance, ()=>{
                instance.dependModuleInstance.listenModule(type, instance[key], instance);
            });
        }
        else
        {
            var module:IModule = instance.dependModuleInstance;
            module && module.listenModule(type, instance[key], instance);
        }
    });
    // 监听销毁
    listenDispose(cls, function(instance:IModuleDependent):void
    {
        var module:IModule = instance.dependModuleInstance;
        module && module.unlistenModule(type, instance[key], instance);
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
/** 处理模块通讯消息返回 */
export function ModuleResponseHandler(prototype:any, propertyKey:string):void;
export function ModuleResponseHandler(cls:IResponseDataConstructor):MethodDecorator;
export function ModuleResponseHandler(target:any, key?:string):MethodDecorator|void
{
    if(key)
    {
        var defs:[IResponseDataConstructor] = Reflect.getMetadata("design:paramtypes", target, key);
        var resClass:IResponseDataConstructor = defs[0];
        if(!(resClass.prototype instanceof ResponseData))
            throw new Error("无参数@ModuleResponseHandler装饰器装饰的方法的首个参数必须是ResponseData");
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
function doResponseHandler(cls:IConstructor, key:string, type:IResponseDataConstructor, inModule:boolean):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:{observable:IObservable}):void
    {
        netManager.listenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
    });
    // 监听销毁
    listenDispose(cls, function(instance:{observable:IObservable}):void
    {
        netManager.unlistenResponse(type, instance[key], instance, false, (inModule ? instance.observable : undefined));
    });
}

var delegateHandlerDict:Dictionary<IModuleMediator, ((instance:IModuleMediator)=>void)[]> = new Dictionary();
function addDelegateHandler(instance:IModuleMediator, handler:(instance?:IModuleMediator)=>void):void
{
    if(!instance) return;
    var handlers:((instance:IModuleMediator)=>void)[] = delegateHandlerDict.get(instance);
    if(!handlers) delegateHandlerDict.set(instance, handlers = []);
    if(handlers.indexOf(handler) < 0) handlers.push(handler);
}

/** 在Module内托管Mediator */
export function DelegateMediator(prototype:any, propertyKey:string):any
{
    if(prototype.delegateMediator instanceof Function && prototype.undelegateMediator instanceof Function)
    {
        // 监听实例化
        listenConstruct(prototype.constructor, function(instance:IModule):void
        {
            // 实例化
            var mediator:IModuleMediator = instance[propertyKey];
            if(mediator === undefined)
            {
                var cls:IConstructor = Reflect.getMetadata("design:type", prototype, propertyKey);
                instance[propertyKey] = mediator = new cls();
            }
            // 赋值所属模块
            mediator["_dependModuleInstance"] = instance;
            mediator["_dependModule"] = getConstructor(prototype.constructor);
            // 执行回调
            var handlers:((instance:IModuleMediator)=>void)[] = delegateHandlerDict.get(mediator);
            if(handlers)
            {
                for(var handler of handlers)
                {
                    handler(mediator);
                }
                // 移除记录
                delegateHandlerDict.delete(mediator);
            }
        });
        // 监听销毁
        listenDispose(prototype.constructor, function(instance:IModule):void
        {
            var mediator:IModuleMediator = instance[propertyKey];
            if(mediator)
            {
                // 移除所属模块
                mediator["_dependModuleInstance"] = undefined;
                mediator["_dependModule"] = undefined;
                // 移除实例
                instance[propertyKey] = undefined;
            }
        });
        // 篡改属性
        var mediator:IModuleMediator;
        return {
            configurable: true,
            enumerable: true,
            get: function():IModuleMediator
            {
                return mediator;
            },
            set: function(value:IModuleMediator):void
            {
                if(value == mediator) return;
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
                    this.delegateMediator(mediator);
                }
            }
        };
    }
}

function listenOnOpen(prototype:any, propertyKey:string, before?:(mediator:IMediator)=>void, after?:(mediator:IMediator)=>void):void
{
    listenConstruct(prototype.constructor, function(mediator:IMediator):void
    {
        // 篡改onOpen方法
        var oriFunc:any = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function(...args:any[]):void
        {
            // 调用回调
            before && before(mediator);
            // 恢复原始方法
            if(oriFunc) mediator.onOpen = oriFunc;
            else delete mediator.onOpen;
            // 调用原始方法
            mediator.onOpen.apply(this, args);
            // 调用回调
            after && after(mediator);
        };
    });
}

/**
 * 一次绑定多个属性
 * 
 * @export
 * @param {{[name:string]:string}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindValue(uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * 一次绑定一个属性
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindValue(name:string, exp:string):PropertyDecorator;
/**
 * @private
 */
export function BindValue(arg1:{[name:string]:string}|string, arg2?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 组织参数字典
            var uiDict:{[name:string]:string};
            if(typeof arg1 == "string")
            {
                uiDict = {};
                uiDict[arg1] = arg2;
            }
            else
            {
                uiDict = arg1;
            }
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileValue, uiDict);
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个方法
 * 
 * @export
 * @param {{[name:string]:string}} funcDict ui方法和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindFunc(funcDict:{[name:string]:string[]|string|undefined}):PropertyDecorator;
/**
 * 一次绑定一个方法
 * 
 * @export
 * @param {string} name ui方法名称
 * @param {string[]|string} [exp] 参数表达式或参数表达式数组
 * @returns {PropertyDecorator} 
 */
export function BindFunc(name:string, exp?:string[]|string):PropertyDecorator;
/**
 * @private
 */
export function BindFunc(arg1:{[name:string]:string[]|string|undefined}|string, arg2?:string[]|string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 组织参数字典
            var funcDict:{[name:string]:string[]|string|undefined};
            if(typeof arg1 == "string")
            {
                funcDict = {};
                funcDict[arg1] = arg2;
            }
            else
            {
                funcDict = arg1;
            }
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileFunc, funcDict);
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个事件
 * 
 * @export
 * @param {{[type:string]:string}} evtDict 事件类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindOn(evtDict:{[type:string]:string}):PropertyDecorator;
/**
 * 一次绑定一个事件
 * 
 * @export
 * @param {string} type 事件类型
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindOn(type:string, exp:string):PropertyDecorator;
/**
 * @private
 */
export function BindOn(arg1:{[type:string]:string}|string, arg2?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 组织参数字典
            var evtDict:{[name:string]:string};
            if(typeof arg1 == "string")
            {
                evtDict = {};
                evtDict[arg1] = arg2;
            }
            else
            {
                evtDict = arg1;
            }
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileOn, evtDict);
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个显示判断，如果要指定当前显示对象请使用$target作为key
 * 
 * @export
 * @param {{[name:string]:string}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindIf(uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * 一次绑定一个显示判断
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindIf(name:string, exp:string):PropertyDecorator;
/**
 * 绑定当前对象的显示判断
 * 
 * @export
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindIf(exp:string):PropertyDecorator;
/**
 * @private
 */
export function BindIf(arg1:{[name:string]:string}|string, arg2?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 组织参数字典
            var uiDict:{[name:string]:string};
            if(typeof arg1 == "string")
            {
                uiDict = {};
                if(arg2) uiDict[arg1] = arg2;// 有name寻址
                else uiDict["$target"] = arg1;// 没有name寻址，直接绑定表达式
            }
            else
            {
                uiDict = arg1;
            }
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileIf, uiDict);
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 遍历一个数据集合绑定当前显示对象
 * 
 * @export
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @returns {PropertyDecorator} 
 */
export function BindFor(exp:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileFor, exp);
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个全局消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindMessage(msgDict:{[type:string]:{[name:string]:string}}):PropertyDecorator;
/**
 * 一次绑定一个全局消息
 * 
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindMessage(type:IConstructor|string, uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * @private
 */
export function BindMessage(arg1:{[type:string]:{[name:string]:string}}|IConstructor|string, arg2?:{[name:string]:string}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                BindUtil.addCompileCommand(target, BindUtil.compileMessage, arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    // 添加编译指令
                    BindUtil.addCompileCommand(target, BindUtil.compileMessage, type, arg1[type]);
                }
            }
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个模块消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindModuleMessage(msgDict:{[type:string]:{[name:string]:string}}):PropertyDecorator;
/**
 * 一次绑定一个模块消息
 * 
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindModuleMessage(type:IConstructor|string, uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * @private
 */
export function BindModuleMessage(arg1:{[type:string]:{[name:string]:string}}|IConstructor|string, arg2?:{[name:string]:string}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IModuleMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                BindUtil.addCompileCommand(target, BindUtil.compileMessage, arg1, arg2, mediator.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    BindUtil.addCompileCommand(target, BindUtil.compileMessage, type, arg1[type], mediator.observable);
                }
            }
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个全局通讯消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindResponse(resDict:{[type:string]:{[name:string]:string}}):PropertyDecorator;
/**
 * 一次绑定一个全局通讯消息
 * 
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindResponse(type:IResponseDataConstructor|string, uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * @private
 */
export function BindResponse(arg1:{[type:string]:{[name:string]:string}}|IResponseDataConstructor|string, arg2?:{[name:string]:string}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        // Response需要在onOpen之后执行，因为可能有初始化消息需要绑定，要在onOpen后有了viewModel再首次更新显示
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                BindUtil.addCompileCommand(target, BindUtil.compileResponse, arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    BindUtil.addCompileCommand(target, BindUtil.compileResponse, type, arg1[type]);
                }
            }
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}

/**
 * 一次绑定多个模块通讯消息
 * 
 * @export
 * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindModuleResponse(resDict:{[type:string]:{[name:string]:string}}):PropertyDecorator;
/**
 * 一次绑定一个模块通讯消息
 * 
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindModuleResponse(type:IResponseDataConstructor|string, uiDict:{[name:string]:string}):PropertyDecorator;
/**
 * @private
 */
export function BindModuleResponse(arg1:{[type:string]:{[name:string]:string}}|IResponseDataConstructor|string, arg2?:{[name:string]:string}):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IModuleMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                BindUtil.addCompileCommand(target, BindUtil.compileResponse, arg1, arg2, mediator.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    BindUtil.addCompileCommand(target, BindUtil.compileResponse, type, arg1[type], mediator.observable);
                }
            }
            // 马上启动一次编译
            BindUtil.compile(mediator, target);
        });
    };
}