/// <reference path="./global/Decorator.ts"/>

import System from "./system/System"
import Model from "./model/Model"
import Mediator from "./component/Mediator"
import PanelManager from "./panel/PanelManager"
import PanelMediator from "./panel/PanelMediator"
import SceneManager from "./scene/SceneManager"
import SceneMediator from "./scene/SceneMediator"
import ModuleManager from "./module/ModuleManager"
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