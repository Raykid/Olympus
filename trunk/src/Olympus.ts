import { engine, IInitParams } from "./engine/Engine";
export { core } from "./core/Core";

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
        // 初始化引擎模块
        engine.initialize(params);
    }
}