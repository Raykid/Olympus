/// <reference path="../egret-libs/egret/egret.d.ts"/>
/// <reference path="../egret-libs/eui/eui.d.ts"/>
/// <reference path="./Declaration.ts"/>
/// <reference path="../../../../dist/Olympus.d.ts"/>

import { listenConstruct } from "utils/ConstructUtil";
import { wrapSkin } from "../utils/SkinUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * 负责注入的模块
*/

/** 定义数据模型，支持实例注入，并且自身也会被注入 */
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