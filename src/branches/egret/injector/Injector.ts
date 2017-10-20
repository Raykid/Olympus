import { listenConstruct } from "utils/ConstructUtil";
import { MediatorClass } from "engine/injector/Injector";
import { wrapSkin } from "../utils/SkinUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 负责注入的模块
*/

export function EgretSkin(skin:any):ClassDecorator
{
    return function(cls:IConstructor):void
    {
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, mediator=>wrapSkin(mediator, skin));
    } as ClassDecorator;
}

export function EgretMediatorClass(skin:any):ClassDecorator
{
    return function(cls:IConstructor):any
    {
        // 调用MediatorClass方法
        cls = MediatorClass(cls);
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, mediator=>wrapSkin(mediator, skin));
        // 返回结果类型
        return cls;
    } as ClassDecorator;
}