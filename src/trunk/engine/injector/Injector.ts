/// <reference path="./Declaration.ts"/>

import { core } from "../../core/Core";
import { wrapConstruct, listenConstruct, listenDispose } from "../../utils/ConstructUtil";
import ResponseData, { IResponseDataConstructor } from "../net/ResponseData";
import { netManager } from "../net/NetManager";
import IModule from "../module/IModule";
import { bridgeManager } from "../bridge/BridgeManager";
import IMediator from "../mediator/IMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * 负责注入的模块
*/

/** 定义数据模型，支持实例注入，并且自身也会被注入 */
export function ModelClass(cls:IConstructor):any
{
    // Model先进行托管
    var result:IConstructor = wrapConstruct(cls);
    // 然后要注入新生成的类
    core.mapInject(result);
    // 返回结果
    return result;
}
// 赋值全局方法
window["ModelClass"] = ModelClass;

/** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
export function MediatorClass(cls:IConstructor):any
{
    // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
    // 替换setSkin方法
    var $skin:any;
    Object.defineProperty(cls.prototype, "skin", {
        configurable: true,
        enumerable: true,
        get: function():any
        {
            return $skin;
        },
        set: function(value:any):void
        {
            // 根据skin类型选取表现层桥
            this.bridge = bridgeManager.getBridgeBySkin(value);
            // 记录值
            $skin = value;
        }
    });
    return wrapConstruct(cls);
}
// 赋值全局方法
window["MediatorClass"] = MediatorClass;

/** 定义模块，支持实例注入 */
export function ModuleClass(cls:IConstructor):any
{
    // 判断一下Module是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Module[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Module实现IDisposable接口");
    return wrapConstruct(cls);
}
// 赋值全局方法
window["ModuleClass"] = ModuleClass;

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
// 赋值全局方法
window["ResponseHandler"] = ResponseHandler;

/** 在Module内托管Mediator */
export function DelegateMediator(prototype:IModule, propertyKey:string):any
{
    if(prototype.delegateMediator instanceof Function && prototype.undelegateMediator instanceof Function)
    {
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
// 赋值全局方法
window["DelegateMediator"] = DelegateMediator;