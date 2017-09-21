import { engine } from "./engine/Engine";
import IModuleConstructor from "./engine/module/IModuleConstructor";
import { bridgeManager } from "./engine/bridge/BridgeManager";
import IBridge from "./engine/bridge/IBridge";
import { environment } from "./engine/env/Environment";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Olympus框架便捷启动与框架外观模块
*/
export default class Olympus
{
    /**
     * 启动Olympus框架
     * 
     * @static
     * @param {IInitParams} params 启动参数
     * @memberof Olympus
     */
    public static startup(params:IInitParams):void
    {
        // 注册首个模块
        engine.registerFirstModule(params.firstModule);
        // 注册加载DOM节点
        engine.registerLoadElement(params.loadElement);
        // 初始化环境参数
        environment.initialize(params.env, params.hostsDict, params.cdnsDict);
        // 注册并初始化表现层桥实例
        bridgeManager.registerBridge(...params.bridges);
    }
}

export interface IInitParams
{
    /**
     * 表现层桥数组，所有可能用到的表现层桥都要在此实例化并传入
     * 
     * @type {IBridge[]}
     * @memberof OlympusInitParams
     */
    bridges:IBridge[];
    /**
     * 首模块类型，框架初始化完毕后进入的模块
     * 
     * @type {IModuleConstructor}
     * @memberof OlympusInitParams
     */
    firstModule:IModuleConstructor;
    /**
     * 会在首个模块被显示出来后从页面中移除
     * 
     * @type {(Element|string)}
     * @memberof OlympusInitParams
     */
    loadElement?:Element|string;
    /**
     * 环境字符串，默认为"dev"
     * 
     * @type {string}
     * @memberof IInitParams
     */
    env?:string;
    /**
     * 消息域名字典数组，首个字典会被当做默认字典，没传递则会用当前域名代替
     * 
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    hostsDict?:{[env:string]:string[]};
    /**
     * CDN域名列表，若没有提供则使用host代替
     * 
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    cdnsDict?:{[env:string]:string[]};
}