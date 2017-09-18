import {core} from "../core/Core"
import IMessage from "../core/message/IMessage"
import ViewMessage from "../view/message/ViewMessage"
import System from "./system/System"
import Model from "./model/Model"
import Mediator from "./mediator/Mediator"
import PanelManager from "./panel/PanelManager"
import PanelMediator from "./panel/PanelMediator"
import SceneManager from "./scene/SceneManager"
import SceneMediator from "./scene/SceneMediator"
import ModuleManager, {moduleManager} from "./module/ModuleManager"
import IModuleConstructor from "./module/IModuleConstructor"
import Module from "./module/Module"
import Explorer from "./env/Explorer"
import External from "./env/External"
import Hash from "./env/Hash"
import Query from "./env/Query"
import NetManager from "./net/NetManager"
import HTTPRequestPolicy from "./net/policies/HTTPRequestPolicy"

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

        function onAllBridgesInit(msg:IMessage):void
        {
            // 注销监听
            core.unlisten(ViewMessage.BRIDGE_ALL_INIT, onAllBridgesInit);
            // 打开模块
            moduleManager.open(cls);
        }
    }
}
/** 再额外导出一个单例 */
export const engine:Engine = core.getInject(Engine)