/// <reference path="global/Decorator.ts"/>

import { core } from "../core/Core";
import IMessage from "../core/message/IMessage";
import ViewMessage from "../view/message/ViewMessage";
import { wrapConstruct, listenConstruct, listenDispose } from "../utils/ConstructUtil";
import System from "./system/System";
import Model from "./model/Model";
import Mediator from "./mediator/Mediator";
import PanelManager from "./panel/PanelManager";
import PanelMediator from "./panel/PanelMediator";
import SceneManager from "./scene/SceneManager";
import SceneMediator from "./scene/SceneMediator";
import ModuleManager, {moduleManager} from "./module/ModuleManager";
import IModuleConstructor from "./module/IModuleConstructor";
import Module from "./module/Module";
import Explorer from "./env/Explorer";
import External from "./env/External";
import Hash from "./env/Hash";
import Query from "./env/Query";
import NetManager, { netManager } from "./net/NetManager";
import HTTPRequestPolicy from "./net/policies/HTTPRequestPolicy";
import { IResponseDataConstructor } from "./net/ResponseData";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
@injectable
export default class Engine
{
    /**
     * 注册首个模块
     * 
     * @param {IModuleConstructor} cls 
     * @memberof Engine
     */
    public registerFirstModule(cls:IModuleConstructor):void
    {
        // 监听Bridge初始化完毕事件，显示第一个模块
        core.listen(ViewMessage.BRIDGE_ALL_INIT, onAllBridgesInit);

        function onAllBridgesInit():void
        {
            // 注销监听
            core.unlisten(ViewMessage.BRIDGE_ALL_INIT, onAllBridgesInit);
            // 打开模块
            moduleManager.open(cls);
        }
    }
}
/** 再额外导出一个单例 */
export const engine:Engine = core.getInject(Engine);

/*********************** 下面是装饰器方法实现 ***********************/

/** model */
window["model"] = function(cls:IConstructor):IConstructor
{
    // Model先进行托管
    var result:IConstructor = wrapConstruct(cls);
    // 然后要注入新生成的类
    core.mapInject(result);
    // 返回结果
    return result;
}

/** mediator */
window["mediator"] = function(cls:IConstructor):IConstructor
{
    // 判断一下Mediator是否有dispose方法，没有的话弹一个警告
    if(!cls.prototype.dispose)
        console.warn("Mediator[" + cls["name"] + "]不具有dispose方法，可能会造成内存问题，请让该Mediator实现IDisposable接口");
    return wrapConstruct(cls);
}

/** result */
window["result"] = function(clsOrType:IResponseDataConstructor|string):MethodDecorator
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