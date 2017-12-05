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
import IModuleMediator from "../mediator/IModuleMediator";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import { BindFuncDict } from "../bind/BindManager";
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
        if(instance instanceof Mediator)
        {
            // 如果是Mediator，则需要等到被托管后再执行注册
            addDelegateHandler(instance, ()=>{
                var observable:IObservable = inModule ? instance : core;
                observable.listen(type, instance[key], instance);
            });
        }
        else
        {
            var observable:IObservable = inModule ? instance : core;
            observable.listen(type, instance[key], instance);
        }
    });
    // 监听销毁
    listenDispose(cls, function(instance:IObservable):void
    {
        var observable:IObservable = inModule ? instance : core;
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
        if(instance instanceof Mediator)
        {
            // 如果是Mediator，则需要等到被托管后再执行注册
            addDelegateHandler(instance, ()=>{
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

var onOpenDict:Dictionary<any, number> = new Dictionary();
function listenOnOpen(prototype:any, propertyKey:string, before?:(mediator:IMediator)=>void, after?:(mediator:IMediator)=>void):void
{
    listenConstruct(prototype.constructor, function(mediator:IMediator):void
    {
        // 篡改onOpen方法
        var oriFunc:any = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function(...args:any[]):void
        {
            // 注册到字典中
            var target:any = mediator[propertyKey];
            var count:number = onOpenDict.get(target) || 0;
            onOpenDict.set(target, ++ count);
            // 调用回调
            before && before(mediator);
            // 恢复原始方法
            if(oriFunc) mediator.onOpen = oriFunc;
            else delete mediator.onOpen;
            // 调用原始方法
            mediator.onOpen.apply(this, args);
            // 调用回调
            after && after(mediator);
            // 判断是否所有onOpen都调用完毕，如果完毕了，则启动编译过程
            count = onOpenDict.get(target);
            onOpenDict.set(target, -- count);
            if(count == 0)
            {
                // 编译顺序反向
                BindUtil.reverseCompileCommand(target);
                // 全调用完毕了，启动编译
                BindUtil.compile(mediator, target);
                // 删除引用
                onOpenDict.delete(target);
            }
        };
    });
}

/**
 * 一次绑定多个属性
 * 
 * @export
 * @param {{[name:string]:any}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindValue(uiDict:{[name:string]:any}):PropertyDecorator;
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
export function BindValue(arg1:{[name:string]:any}|string, arg2?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
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
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileValue, uiDict);
        });
    };
}

/**
 * 一次绑定多个方法
 * 
 * @export
 * @param {BindFuncDict} funcDict ui方法和表达式字典
 * @returns {PropertyDecorator} 
 */
export function BindFunc(funcDict:BindFuncDict):PropertyDecorator;
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
export function BindFunc(arg1:BindFuncDict|string, arg2?:string[]|string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
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
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileFunc, funcDict);
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
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindOn(type:string, exp:string):PropertyDecorator;
/**
 * 为指定对象一次绑定一个事件
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} type 事件类型
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindOn(name:string, type:string, exp:string):PropertyDecorator;
/**
 * @private
 */
export function BindOn(arg1:{[type:string]:any}|string, arg2?:string, arg3?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 组织参数字典
            var evtDict:{[name:string]:any};
            if(typeof arg1 == "string")
            {
                if(arg3)
                {
                    // 指定了UI对象，先去寻找
                    var nameDict:any = {};
                    nameDict[arg1] = "";
                    searchUI(nameDict, target, (ui:any, key:string, value:any)=>{
                        target = ui[key];
                    });
                }
                evtDict = {};
                evtDict[arg1] = arg2;
            }
            else
            {
                evtDict = arg1;
            }
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileOn, evtDict);
        });
    };
}

/**
 * 绑定当前对象的显示判断，if不支持寻址功能
 * 
 * @export
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindIf(exp:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 获取编译启动目标
            var target:any = mediator[propertyKey];
            // 添加编译指令
            BindUtil.addCompileCommand(target, BindUtil.compileIf, exp);
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
 * 一次绑定一个数据集合
 * 
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 表达式
 * @returns {PropertyDecorator} 
 */
export function BindFor(name:string, exp:string):PropertyDecorator;
/**
 * 绑定数据集合到当前显示对象
 * 
 * @export
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @returns {PropertyDecorator} 
 */
export function BindFor(exp:string):PropertyDecorator;
/**
 * @private
 */
export function BindFor(arg1:{[name:string]:any}|string, arg2?:string):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
            // 组织参数字典
            var uiDict:{[name:string]:any};
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
            BindUtil.addCompileCommand(target, BindUtil.compileFor, uiDict);
        });
    };
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
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
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
                    // 添加编译指令
                    BindUtil.addCompileCommand(target, BindUtil.compileMessage, type, arg1[type], mediator.observable);
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
        listenOnOpen(prototype, propertyKey, null, (mediator:IModuleMediator)=>{
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
                    BindUtil.addCompileCommand(target, BindUtil.compileMessage, type, arg1[type]);
                }
            }
        });
    };
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
        listenOnOpen(prototype, propertyKey, null, (mediator:IMediator)=>{
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
        listenOnOpen(prototype, propertyKey, null, (mediator:IModuleMediator)=>{
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
        });
    };
}