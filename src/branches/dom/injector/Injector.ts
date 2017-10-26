import { listenConstruct } from "utils/ConstructUtil";
import { MediatorClass } from "engine/injector/Injector";
import { bridgeManager } from "engine/bridge/BridgeManager";
import DOMBridge from "../../DOMBridge";
import { wrapSkin } from "../utils/SkinUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 负责注入的模块
*/
export function DOMMediatorClass(cls:IConstructor):any
export function DOMMediatorClass(...skins:string[]):ClassDecorator
export function DOMMediatorClass(...args:any[]):any
{
    if(args[0] instanceof Function)
    {
        // 调用MediatorClass方法
        var cls = MediatorClass(args[0]);
        // 监听类型实例化，赋值表现层桥
        listenConstruct(cls, mediator=>mediator.bridge = bridgeManager.getBridge(DOMBridge.TYPE));
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
            listenConstruct(cls, mediator=>wrapSkin(mediator, args));
            // 返回结果类型
            return cls;
        } as ClassDecorator;
    }
}