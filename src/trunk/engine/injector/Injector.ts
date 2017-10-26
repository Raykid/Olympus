import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { wrapConstruct, listenConstruct, listenDispose, getConstructor } from "../../utils/ConstructUtil";
import ResponseData, { IResponseDataConstructor } from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import IModule from "../module/IModule";
import IModuleConstructor from "../module/IModuleConstructor";
import { bridgeManager } from "../bridge/BridgeManager";
import IMediator from "../mediator/IMediator";
import { moduleManager } from "../module/ModuleManager";

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
        doResponseHandler(target.constructor, key, defs[0]);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doResponseHandler(prototype.constructor, propertyKey, target);
        };
    }
}
function doResponseHandler(cls:IConstructor, key:string, type:IResponseDataConstructor):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:any):void
    {
        netManager.listenResponse(type, instance[key], instance);
    });
    // 监听销毁
    listenDispose(cls, function(instance:any):void
    {
        netManager.unlistenResponse(type, instance[key], instance);
    });
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
            var mediator:IMediator = instance[propertyKey];
            if(mediator === undefined)
            {
                var cls:IConstructor = Reflect.getMetadata("design:type", prototype, propertyKey);
                instance[propertyKey] = mediator = new cls();
            }
            // 赋值所属模块
            mediator["_dependModuleInstance"] = instance;
            mediator["_dependModule"] = getConstructor(prototype.constructor);
        });
        // 监听销毁
        listenDispose(prototype.constructor, function(instance:IMediator):void
        {
            var mediator:IMediator = instance[propertyKey];
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
        var mediator:IMediator;
        return {
            configurable: true,
            enumerable: true,
            get: function():IMediator
            {
                return mediator;
            },
            set: function(value:IMediator):void
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