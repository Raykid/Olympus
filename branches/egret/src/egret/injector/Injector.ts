import { listenConstruct } from "olympus-r/utils/ConstructUtil";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import EgretBridge from "../../EgretBridge";

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
        listenConstruct(cls, mediator=>mediator.skin = skin);
    } as ClassDecorator;
}

export function EgretMediatorClass(moduleName:string, skin:string):ClassDecorator
{
    return function(cls:IConstructor):any
    {
        // 调用MediatorClass方法
        cls = <IConstructor>MediatorClass(moduleName)(cls);
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, mediator=>mediator.skin = skin);
        // 返回结果类型
        return cls;
    } as ClassDecorator;
}