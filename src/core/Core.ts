/// <reference path="./global/Patch.ts"/>
/// <reference path="./global/Decorator.ts"/>

import IDisposable from "./interfaces/IDisposable"
import IConstructor from "./interfaces/IConstructor"
import IMessage from "./message/IMessage"
import Message from "./message/Message"
import CoreMessage from "./message/CoreMessage"
import ICommandConstructor from "./command/ICommandConstructor"
import Command from "./command/Command"
import {listenConstruct, listenDispose, wrapConstruct} from "../utils/ConstructUtil"
import IDispatcher from "./interfaces/IDispatcher"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * Core模组是Olympus框架的核心模组，负责实现框架内消息转发、对象注入等核心功能
 * Core模组是一切其他模组实现的基础和围绕的核心
*/

/**
 * 上下文模块内部使用的记录转发数据的接口
 * 
 * @interface IMessageData
 */
interface IMessageData
{
    handler:(msg:IMessage)=>void;
    thisArg:any;
}

export interface IInjectableParams
{
    type:IConstructor;
}

/**
 * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
 * 
 * @export
 * @class Core
 */
export default class Core implements IDispatcher
{
    private static _instance:Core;
    
    public constructor()
    {
        // 进行单例判断
        if(Core._instance) throw new Error("已生成过Core实例，不允许多次生成");
        // 赋值单例
        Core._instance = this;
        // 注入自身
        this.mapInjectValue(this);
    }

    /*********************** 下面是内核消息系统 ***********************/

    private _listenerDict:{[type:string]:IMessageData[]} = {};

    private handleMessages(msg:IMessage):void
    {
        var listeners:IMessageData[] = this._listenerDict[msg.getType()];
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var temp:IMessageData = listeners[i];
                try {
                    // 调用处理函数
                    temp.handler.call(temp.thisArg, msg);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    private doDispatch(msg:IMessage):void
    {
        // 触发命令
        this.handleCommands(msg);
        // 触发用listen形式监听的消息
        this.handleMessages(msg);
    }

    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(typeOrMsg:string|IMessage, ...params:any[]):void
    {
        // 统一消息对象
        var msg:IMessage = typeOrMsg as IMessage;
        if(typeof typeOrMsg == "string")
        {
            msg = new Message(typeOrMsg);
            (msg as Message).params = params;
        }
        // 派发消息
        this.doDispatch(msg);
        // 额外派发一个通用事件
        this.doDispatch(new CoreMessage(CoreMessage.MESSAGE_DISPATCHED, msg));
    }

    /**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Core
     */
    public listen(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
    {
        var listeners:IMessageData[] = this._listenerDict[type];
        if(!listeners) this._listenerDict[type] = listeners = [];
        // 检查存在性
        for(var i:number = 0, len:number = listeners.length; i < len; i++)
        {
            var temp:IMessageData = listeners[i];
            // 如果已经存在监听则直接返回
            if(temp.handler == handler && temp.thisArg == thisArg) return;
        }
        // 添加监听
        listeners.push({handler: handler, thisArg: thisArg});
    }

    /**
     * 移除内核消息监听
     * 
     * @param {string} type 消息类型
     * @param {(msg:IMessage)=>void} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof Core
     */
    public unlisten(type:string, handler:(msg:IMessage)=>void, thisArg?:any):void
    {
        var listeners:IMessageData[] = this._listenerDict[type];
        // 检查存在性
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var temp:IMessageData = listeners[i];
                // 如果已经存在监听则直接返回
                if(temp.handler == handler && temp.thisArg == thisArg)
                {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    /*********************** 下面是依赖注入系统 ***********************/
    private _injectDict:{[key:string]:any} = {};
    /**
     * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
     * 
     * @param {IConstructor} target 要注入的类型（注意不是实例）
     * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
     * @memberof Core
     */
    public mapInject(target:IConstructor, type?:IConstructor):void
    {
        var value:any = new target();
        this.mapInjectValue(value, type);
    }

    /**
     * 注入一个对象实例
     * 
     * @param {*} value 要注入的对象实例
     * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
     * @memberof Core
     */
    public mapInjectValue(value:any, type?:IConstructor):void
    {
        var key:string = (type || value.constructor).toString();
        this._injectDict[key] = value;
    }

    /**
     * 移除类型注入
     * 
     * @param {IConstructor} target 要移除注入的类型
     * @memberof Core
     */
    public unmapInject(target:IConstructor):void
    {
        var key:string = target.toString();
        delete this._injectDict[key];
    }

    /**
     * 获取注入的对象实例
     * 
     * @param {(IConstructor)} type 注入对象的类型
     * @returns {*} 注入的对象实例
     * @memberof Core
     */
    public getInject(type:IConstructor):any
    {
        // 需要用原始的构造函数取
        type = type["__ori_constructor__"] || type;
        return this._injectDict[type.toString()];
    }

    /*********************** 下面是内核命令系统 ***********************/

    private _commandDict:{[type:string]:(ICommandConstructor)[]} = {};

    private handleCommands(msg:IMessage):void
    {
        var commands:(ICommandConstructor)[] = this._commandDict[msg.getType()];
        if(!commands) return;
        for(var i:number = 0, len:number = commands.length; i < len; i++)
        {
            var cls:ICommandConstructor = commands[i];
            try {
                // 执行命令
                var cmd:Command = new cls(msg);
                cmd.exec();
            } catch(error) {
                console.error(error);
            }
        }
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Core
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) this._commandDict[type] = commands = [];
        if(commands.indexOf(cmd) < 0) commands.push(cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof Core
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) return;
        var index:number = commands.indexOf(cmd);
        if(index < 0) return;
        commands.splice(index, 1);
    }
}
/** 再额外导出一个单例 */
export const core:Core = new Core();

/*********************** 下面是装饰器方法实现 ***********************/

/** Injectable，仅生成类型实例并注入 */
window["Injectable"] = function Injectable(cls:IInjectableParams|IConstructor):ClassDecorator|void
{
    var params:IInjectableParams = cls as IInjectableParams;
    if(params.type instanceof Function)
    {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function(realCls:IConstructor):void
        {
            core.mapInject(realCls, params.type);
        } as ClassDecorator;
    }
    else
    {
        // 不需要转换注册类型，直接注册
        core.mapInject(cls as IConstructor);
    }
};

/** Model */
window["Model"] = function Model(cls:IConstructor):IConstructor
{
    // Model先进行托管
    var result:IConstructor = wrapConstruct(cls);
    // 然后要注入新生成的类
    core.mapInject(result);
    // 返回结果
    return result;
}

/** Mediator */
window["Mediator"] = function Mediator(cls:IConstructor):IConstructor
{
    // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
    return wrapConstruct(cls);
}

/** Inject */
window["Inject"] = function Inject(cls:IConstructor):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):void
    {
        // 监听实例化
        listenConstruct(prototype.constructor, function(instance:any):void
        {
            Object.defineProperty(instance, propertyKey, {
                configurable: true,
                enumerable: true,
                get: ()=>core.getInject(cls)
            });
        });
    };
};

/** Handler */
window["Handler"] = function Handler(type:string):MethodDecorator
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