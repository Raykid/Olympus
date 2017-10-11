/// <reference path="./Declaration.ts"/>

import { core } from "../Core";
import { listenConstruct, listenDispose } from "../../utils/ConstructUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * Core模组的装饰器注入模块
*/

/** 生成类型实例并注入，可以进行类型转换注入（既注入类型可以和注册类型不一致，采用@Injectable({type: AnotherClass})的形式即可） */
export function Injectable(cls:IConstructor):void;
export function Injectable(name:string):ClassDecorator;
export function Injectable(params:{type:IConstructor}):ClassDecorator;
export function Injectable(cls:{type:IConstructor}|IConstructor|string):ClassDecorator|void
{
    var params:{type:IConstructor} = cls as {type:IConstructor};
    if(typeof cls == "string" || params.type instanceof Function)
    {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function(realCls:IConstructor):void
        {
            core.mapInject(realCls, typeof cls == "string" ? cls : params.type);
        } as ClassDecorator;
    }
    else
    {
        // 不需要转换注册类型，直接注册
        core.mapInject(cls as IConstructor);
    }
};
// 赋值全局方法
window["Injectable"] = Injectable;

/** 赋值注入的实例 */
export function Inject(prototype:any, propertyKey:string):void;
export function Inject(name:string):PropertyDecorator;
export function Inject(cls:IConstructor):PropertyDecorator;
export function Inject(target:IConstructor|string|any, key?:string):PropertyDecorator|void
{
    if((typeof target == "string" || target instanceof Function) && !key)
    {
        return function(prototype:any, propertyKey:string):void
        {
            doInject(prototype.constructor, propertyKey, target);
        };
    }
    else
    {
        var cls:IConstructor = Reflect.getMetadata("design:type", target, key);
        doInject(target.constructor, key, cls);
    }
};
function doInject(cls:IConstructor, key:string, type:IConstructor|string):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:any):void
    {
        Object.defineProperty(instance, key, {
            configurable: true,
            enumerable: true,
            get: ()=>core.getInject(type)
        });
    });
}
// 赋值全局方法
window["Inject"] = Inject;

/** 处理内核消息 */
export function MessageHandler(type:string):MethodDecorator
{
    return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
    {
        // 监听实例化
        listenConstruct(prototype.constructor, function(instance:any):void
        {
            core.listen(type, instance[propertyKey], instance);
        });
        // 监听销毁
        listenDispose(prototype.constructor, function(instance:any):void
        {
            core.unlisten(type, instance[propertyKey], instance);
        });
    };
};
// 赋值全局方法
window["MessageHandler"] = MessageHandler;