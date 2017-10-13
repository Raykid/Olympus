/// <reference path="./Declaration.ts"/>

import { listenConstruct } from "utils/ConstructUtil";
import { MediatorClass } from "engine/injector/Injector";
import { bridgeManager } from "engine/bridge/BridgeManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 负责注入的模块
*/
export function DOMMediatorClass(cls:IConstructor):any
{
    // 监听类型实例化，赋值表现层桥
    listenConstruct(cls, mediator=>mediator.bridge = bridgeManager.getBridge("DOM"));
    // 调用MediatorClass方法
    return MediatorClass(cls);
}
// 赋值全局方法
window["DOMMediatorClass"] = DOMMediatorClass;