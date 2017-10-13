/// <reference path="./Declaration.ts"/>

import { listenConstruct } from "utils/ConstructUtil";
import { wrapSkin } from "../utils/SkinUtil";
import { MediatorClass } from "engine/injector/Injector";

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
// 赋值全局方法
window["EgretSkin"] = EgretSkin;

export function EgretMediatorClass(skin:any):ClassDecorator
{
    return function(cls:IConstructor):any
    {
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, mediator=>wrapSkin(mediator, skin));
        // 调用MediatorClass方法
        return MediatorClass(cls);
    } as ClassDecorator;
}
// 赋值全局方法
window["EgretMediatorClass"] = EgretMediatorClass;