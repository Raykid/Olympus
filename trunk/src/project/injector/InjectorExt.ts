import { EvalExp } from '../../kernel/bind/Utils';
import { decorateThis } from '../../kernel/global/Patch';
import * as BindUtil from "../../kernel/injector/BindUtil";
import { addSubHandler, isComponent, listenOnOpen, searchUIDepth } from '../../kernel/injector/Injector';
import IComponent from '../../kernel/interfaces/IComponent';
import IComponentConstructor from '../../kernel/interfaces/IComponentConstructor';
import IObservable from '../../kernel/interfaces/IObservable';
import Message from '../../kernel/observable/Message';
import { listenConstruct, listenDispose, wrapConstruct } from "../../utils/ConstructUtil";
import { bridgeManager } from "../bridge/BridgeManager";
import IBridge from "../bridge/IBridgeExt";
import { core } from '../core/Core';
import { registerModule } from "../mediator/Mediator";
import { netManager } from "../net/NetManager";
import ResponseData, { IResponseDataConstructor } from "../net/ResponseData";
import { compileMessage, compileResponse } from './BindUtilExt';

/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export function Injectable(...args:any[]):any
{
    if(this === decorateThis)
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
        listenConstruct(cls, function(instance:IComponent):void
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
        var wrapperCls:IComponentConstructor = <IComponentConstructor>wrapConstruct(cls);
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
    listenConstruct(cls, function(instance:IComponent):void
    {
        if(isComponent(instance) && instance.parent)
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
    listenConstruct(cls, function(instance:IComponent):void
    {
        if(isComponent(instance) && instance.parent)
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

function doBindMessage(comp:IComponent, target:any, type:IConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
        BindUtil.pushCompileCommand(currentTarget, target, compileMessage, type, name, exp, observable);
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
        listenOnOpen(prototype, (comp:IComponent)=>{
            var target:any = comp[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindMessage(comp, target, <any>arg1, arg2, comp.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindMessage(comp, target, type, arg1[type], comp.observable);
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
        listenOnOpen(prototype, (comp:IComponent)=>{
            var target:any = comp[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindMessage(comp, target, <any>arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindMessage(comp, target, type, arg1[type]);
                }
            }
        });
    };
}

function doBindResponse(comp:IComponent, target:any, type:IResponseDataConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    searchUIDepth(uiDict, comp, target, (currentTarget:any, target:any, name:string, exp:EvalExp)=>{
        BindUtil.pushCompileCommand(currentTarget, target, compileResponse, type, name, exp, observable);
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
        listenOnOpen(prototype, (comp:IComponent)=>{
            var target:any = comp[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindResponse(comp, target, <any>arg1, arg2, comp.observable);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindResponse(comp, target, type, arg1[type], comp.observable);
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
        listenOnOpen(prototype, (comp:IComponent)=>{
            var target:any = comp[propertyKey];
            if(typeof arg1 == "string" || arg1 instanceof Function)
            {
                // 是类型方式
                doBindResponse(comp, target, <any>arg1, arg2);
            }
            else
            {
                // 是字典方式
                for(var type in arg1)
                {
                    doBindResponse(comp, target, type, arg1[type]);
                }
            }
        });
    };
}