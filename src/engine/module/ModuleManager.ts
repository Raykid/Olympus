import {core} from "../../core/Core"
import IModule from "./IModule"
import IModuleConstructor from "./IModuleConstructor"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
*/
@Injectable
export default class ModuleManager
{
    private _moduleStack:IModuleConstructor[] = [];

    /**
     * 打开模块
     * 
     * @param {IModuleConstructor} moduleCls 
     * @param {*} [data] 
     * @param {boolean} [replace=false] 
     * @memberof ModuleManager
     */
    public openModule(moduleCls:IModuleConstructor, data?:any, replace:boolean=false):void
    {
    }

    /**
     * 
     * 
     * @param {IModuleConstructor} moduleCls 
     * @param {*} [data] 
     * @param {boolean} [replace=false] 
     * @memberof ModuleManager
     */
    public closeModule(moduleCls:IModuleConstructor, data?:any, replace:boolean=false):void
    {
    }
}
/** 再额外导出一个单例 */
export const moduleManager:ModuleManager = core.getInject(ModuleManager)