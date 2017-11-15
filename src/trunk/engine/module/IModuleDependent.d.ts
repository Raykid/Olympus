import IModule from "./IModule";
import IModuleConstructor from "./IModuleConstructor";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 *
 * 模块依赖者接口
*/
export default interface IModuleDependent {
    /**
     * 所属的模块引用
     *
     * @memberof IModuleDependent
     */
    readonly dependModuleInstance: IModule;
    /**
     * 所属的模块类型
     *
     * @memberof IModuleDependent
     */
    readonly dependModule: IModuleConstructor;
}
