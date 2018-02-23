import { listenConstruct } from "olympus-r/utils/ConstructUtil";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import ThreeBridge from "../../ThreeBridge";
import { wrapSkin } from "../utils/SkinUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-23
 * @modify date 2018-02-23
 * 
 * 负责注入的模块
*/

export function ThreeSkin(skin:any):ClassDecorator
{
    return function(cls:IConstructor):void
    {
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, mediator=>wrapSkin(mediator, skin));
    } as ClassDecorator;
}

export function ThreeMediatorClass(cls:IConstructor):any
export function ThreeMediatorClass(skin:string):ClassDecorator
export function ThreeMediatorClass(target:IConstructor|string):any
{
    if(target instanceof Function)
    {
        // 调用MediatorClass方法
        var cls = MediatorClass(target);
        // 监听类型实例化，赋值表现层桥
        listenConstruct(cls, mediator=>mediator.bridge = bridgeManager.getBridge(ThreeBridge.TYPE));
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