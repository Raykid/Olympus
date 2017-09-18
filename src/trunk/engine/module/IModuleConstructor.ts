import IModule from "./IModule";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * 模块构造器接口
*/
export default interface IModuleConstructor
{
    new():IModule;
}