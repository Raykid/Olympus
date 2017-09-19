import { core } from "../../core/Core";
import { wrapConstruct, listenConstruct, listenDispose } from "../../utils/ConstructUtil";
import { IResponseDataConstructor } from "../net/ResponseData";
import { netManager } from "../net/NetManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * 负责注入的模块
*/

/** 定义数据模型，支持实例注入，并且自身也会被注入 */
export function ModelClass(cls:IConstructor):IConstructor
{
    // Model先进行托管
    var result:IConstructor = wrapConstruct(cls);
    // 然后要注入新生成的类
    core.mapInject(result);
    // 返回结果
    return result;
}

/** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
export function MediatorClass(cls:IConstructor):IConstructor
{
    // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
    return wrapConstruct(cls);
}

/** 定义模块，支持实例注入 */
export function ModuleClass(cls:IConstructor):IConstructor
{
    // 判断一下Module是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Module[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Module实现IDisposable接口");
    return wrapConstruct(cls);
}

/** 处理通讯消息返回 */
export function ResponseHandler(clsOrType:IResponseDataConstructor|string):MethodDecorator
{
    return function(prototype:any, propertyKey:string, descriptor:PropertyDescriptor):void
    {
        // 监听实例化
        listenConstruct(prototype.constructor, function(instance:any):void
        {
            netManager.listenResponse(clsOrType, instance[propertyKey], instance);
        });
        // 监听销毁
        listenDispose(prototype.constructor, function(instance:any):void
        {
            netManager.unlistenResponse(clsOrType, instance[propertyKey], instance);
        });
    };
};