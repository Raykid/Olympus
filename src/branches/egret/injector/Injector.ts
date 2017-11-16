import { listenConstruct } from "../../../trunk/utils/ConstructUtil";
import { MediatorClass } from "../../../trunk/engine/injector/Injector";
import { bridgeManager } from "../../../trunk/engine/bridge/BridgeManager";
import { wrapSkin } from "../utils/SkinUtil";
import EgretBridge from "../EgretBridge";

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

export function EgretMediatorClass(cls:IConstructor):any
export function EgretMediatorClass(skin:string):ClassDecorator
export function EgretMediatorClass(target:IConstructor|string):any
{
    if(target instanceof Function)
    {
        // 调用MediatorClass方法
        var cls = MediatorClass(target);
        // 监听类型实例化，赋值表现层桥
        listenConstruct(cls, mediator=>mediator.bridge = bridgeManager.getBridge(EgretBridge.TYPE));
        // 返回结果类型
        return cls;
    }
    else
    {
        return function(cls:IConstructor):any
        {
            // 调用MediatorClass方法
            cls = MediatorClass(cls);
            // 监听类型实例化，转换皮肤格式
            listenConstruct(cls, mediator=>wrapSkin(mediator, target));
            // 返回结果类型
            return cls;
        } as ClassDecorator;
    }
}