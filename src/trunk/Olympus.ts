import { engine } from "./engine/Engine";
import IModuleConstructor from "./engine/module/IModuleConstructor";
import { view } from "./view/View";
import IBridge from "./view/bridge/IBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * Olympus框架便捷启动模块
*/
export default class Olympus
{
    /**
     * 启动Olympus框架
     * 
     * @static
     * @param {IModuleConstructor} firstModule 应用程序的首个模块
     * @param {...IBridge[]} bridges 所有可能用到的表现层桥
     * @memberof Olympus
     */
    public static startup(firstModule:IModuleConstructor, ...bridges:IBridge[]):void
    {
        // 注册首个模块
        engine.registerFirstModule(firstModule);
        // 注册并初始化表现层桥实例
        view.registerBridge(...bridges);
    }
}