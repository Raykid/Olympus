import { core } from "../Core";
import { listenConstruct, listenDispose } from "../../utils/ConstructUtil";
import Message from "../message/Message";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * Core模组的装饰器注入模块
*/

/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export function Injectable(...args:any[]):any
{
    if(this === undefined)
    {
        // 不需要转换注册类型，直接注册
        core.mapInject(args[0]);
    }
    else
    {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function(realCls:IConstructor):void
        {
            for(var cls of args)
            {
                // 注入类型
                core.mapInject(realCls, cls);
            }
            // 需要转换的也要额外将自身注入一个
            core.mapInject(realCls);
        };
    }
};

/** 赋值注入的实例 */
export function Inject(prototype:any, propertyKey:string):void;
export function Inject(cls:any):PropertyDecorator;
export function Inject(target:any, key?:string):PropertyDecorator|void
{
    if(key)
    {
        var cls:IConstructor = Reflect.getMetadata("design:type", target, key);
        doInject(target.constructor, key, cls);
    }
    else
    {
        return function(prototype:any, propertyKey:string):void
        {
            doInject(prototype.constructor, propertyKey, target);
        };
    }
};
function doInject(cls:IConstructor, key:string, type:any):void
{
    // 监听实例化
    var target:any;
    listenConstruct(cls, function(instance:any):void
    {
        Object.defineProperty(instance, key, {
            configurable: true,
            enumerable: true,
            get: ()=>target || (target = core.getInject(type))
        });
    });
}

/** 处理内核消息 */
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
        doMessageHandler(target.constructor, key, resClass);
    }
    else
    {
        return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
        {
            doMessageHandler(prototype.constructor, propertyKey, target);
        };
    }
};
function doMessageHandler(cls:IConstructor, key:string, type:IConstructor):void
{
    // 监听实例化
    listenConstruct(cls, function(instance:any):void
    {
        core.listen(type, instance[key], instance);
    });
    // 监听销毁
    listenDispose(cls, function(instance:any):void
    {
        core.unlisten(type, instance[key], instance);
    });
}