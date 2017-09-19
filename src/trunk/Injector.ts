/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * 统一的Injector输出口，所有框架内的装饰器注入方法都可以从这个模块找到
*/

/** 导出core模组的注入方法 */
export * from "./core/injector/Injector";
/** 导出engine模组的注入方法 */
export * from "./engine/injector/Injector";