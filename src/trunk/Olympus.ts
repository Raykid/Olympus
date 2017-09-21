import { engine } from "./engine/Engine";
import IModuleConstructor from "./engine/module/IModuleConstructor";
import { bridgeManager } from "./engine/bridge/BridgeManager";
import IBridge from "./engine/bridge/IBridge";

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
     * @param {IBridge[]} bridges 
     * @param {IModuleConstructor} firstModule 
     * @memberof Olympus
     */
    /**
     * 启动Olympus框架
     * 
     * @static
     * @param {IBridge[]} bridges 表现层桥数组
     * @param {IModuleConstructor} firstModule 应用程序的首个模块
     * @param {Element} [loadElement] 会在首个模块被显示出来后从页面中移除
     * @memberof Olympus
     */
    public static startup(
        bridges:IBridge[],
        firstModule:IModuleConstructor,
        loadElement?:Element|string
    ):void
    {
        // 注册首个模块
        engine.registerFirstModule(firstModule);
        // 注册加载DOM节点
        engine.registerLoadElement(loadElement);
        // 注册并初始化表现层桥实例
        bridgeManager.registerBridge(...bridges);
    }
}