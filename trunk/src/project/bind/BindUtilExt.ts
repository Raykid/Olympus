import { evalExp, EvalExp } from '../../kernel/bind/Utils';
import IComponent from '../../kernel/interfaces/IComponent';
import IObservable from '../../kernel/interfaces/IObservable';
import { core } from '../core/Core';
import { netManager } from "../net/NetManager";
import { IResponseDataConstructor } from '../net/ResponseData';

/**
 * 绑定Message
 * 
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IConstructor|string} type 绑定的消息类型字符串
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export function bindMessage(comp:IComponent, currentTarget:any, target:any, envModels:any[], type:IConstructor|string, name:string, exp:EvalExp, observable?:IObservable):void
{
    if(!observable) observable = core.observable;
    var handler:(...args:any[])=>void = (...args:any[])=>{
        if(comp.disposed)
        {
            // comp已销毁，取消监听
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
                $this: comp,
                $data: comp.viewModel,
                $bridge: comp.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            currentTarget[name] = evalExp(exp, comp.viewModel, msg, ...envModels, comp.viewModel, commonScope);
        }
    };
    // 添加监听
    observable.listen(type, handler);
}

/**
 * 绑定Response
 * 
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export function bindResponse(comp:IComponent, currentTarget:any, target:any, envModels:any[], type:IResponseDataConstructor|string, name:string, exp:EvalExp, observable?:IObservable):void
{
    if(!observable) observable = core.observable;
    var handler:(response:any)=>void = (response:any)=>{
        if(comp.disposed)
        {
            // comp已销毁，取消监听
            netManager.unlistenResponse(type, handler, null, null, observable);
        }
        else
        {
            // 设置通用属性
            var commonScope:any = {
                $this: comp,
                $data: comp.viewModel,
                $bridge: comp.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            currentTarget[name] = evalExp(exp, comp.viewModel, response, ...envModels, comp.viewModel, commonScope);
        }
    };
    // 添加监听
    netManager.listenResponse(type, handler, null, null, observable);
    // 如果comp所依赖的模块有初始化消息，则要额外触发初始化消息的绑定
    if(comp["dependModuleInstance"])
    {
        for(var response of comp["dependModuleInstance"].responses)
        {
            handler(response);
        }
    }
}