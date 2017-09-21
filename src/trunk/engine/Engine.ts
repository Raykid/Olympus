import { core } from "../core/Core";
import { Injectable } from "../core/injector/Injector";
import BridgeManager from "./bridge/BridgeManager";
import BridgeMessage from "./bridge/BridgeMessage";
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
import Environment from "./env/Environment";
import Explorer from "./env/Explorer";
import WindowExternal from "./env/WindowExternal";
import Hash from "./env/Hash";
import Query from "./env/Query";
import NetManager, { netManager } from "./net/NetManager";
import HTTPRequestPolicy from "./net/policies/HTTPRequestPolicy";
import { IResponseDataConstructor } from "./net/ResponseData";
import * as Injector from "./injector/Injector"
import ModuleMessage from "./module/ModuleMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
@Injectable
export default class Engine
{
    private _firstModule:IModuleConstructor;
    private _loadElement:Element;

    /**
     * 注册首个模块
     * 
     * @param {IModuleConstructor} cls 首个模块类型
     * @memberof Engine
     */
    public registerFirstModule(cls:IModuleConstructor):void
    {
        this._firstModule = cls;
        // 监听Bridge初始化完毕事件，显示第一个模块
        core.listen(BridgeMessage.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
    }

    /**
     * 注册程序启动前的Loading DOM节点，当首个模块显示出来后会移除该DOM节点
     * 
     * @param {Element|string} element loading DOM节点或其ID值
     * @memberof Engine
     */
    public registerLoadElement(element:Element|string):void
    {
        this._loadElement = (typeof element == "string" ? document.getElementById(element) : element);
    }

    private onAllBridgesInit():void
    {
        // 注销监听
        core.unlisten(BridgeMessage.BRIDGE_ALL_INIT, this.onAllBridgesInit, this);
        // 监听首个模块开启
        core.listen(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 打开首个模块
        moduleManager.open(this._firstModule);
    }

    private onModuleChange(from:IModuleConstructor):void
    {
        // 注销监听
        core.unlisten(ModuleMessage.MODULE_CHANGE, this.onModuleChange, this);
        // 移除loadElement显示
        if(this._loadElement)
        {
            var parent:Element = this._loadElement.parentElement;
            parent && parent.removeChild(this._loadElement);
        }
    }
}
/** 再额外导出一个单例 */
export const engine:Engine = core.getInject(Engine);