import IModule from "./IModule";
import IModuleConstructor from "./IModuleConstructor";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-15
 *
 * 模块管理器，管理模块相关的所有操作。模块具有唯一性，同一时间不可以打开两个相同模块，如果打开则会退回到先前的模块处
*/
export default class ModuleManager {
    private _moduleDict;
    private _moduleStack;
    private _openCache;
    private _opening;
    /**
     * 获取当前模块
     *
     * @readonly
     * @type {IModuleConstructor|undefined}
     * @memberof ModuleManager
     */
    readonly currentModule: IModuleConstructor | undefined;
    /**
     * 获取当前模块的实例
     *
     * @readonly
     * @type {(IModule|undefined)}
     * @memberof ModuleManager
     */
    readonly currentModuleInstance: IModule | undefined;
    /**
     * 获取活动模块数量
     *
     * @readonly
     * @type {number}
     * @memberof ModuleManager
     */
    readonly activeCount: number;
    /**
     * 获取模块在栈中的索引
     *
     * @param {IModuleConstructor} cls 模块类型
     * @returns {number} 索引值
     * @memberof ModuleManager
     */
    getIndex(cls: IModuleConstructor): number;
    /**
     * 获取索引处模块类型
     *
     * @param {number} index 模块索引值
     * @returns {IModuleConstructor} 模块类型
     * @memberof ModuleManager
     */
    getModule(index: number): IModuleConstructor;
    private getAfter(cls);
    private getCurrent();
    registerModule(cls: IModuleConstructor): void;
    /**
     * 获取模块是否开启中
     *
     * @param {IModuleConstructor} cls 要判断的模块类型
     * @returns {boolean} 是否开启
     * @memberof ModuleManager
     */
    isOpened(cls: IModuleConstructor): boolean;
    private activateModule(module, from, data);
    private deactivateModule(module, to, data);
    /**
     * 打开模块
     *
     * @param {IModuleConstructor|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @param {boolean} [replace=false] 是否替换当前模块
     * @memberof ModuleManager
     */
    open(clsOrName: IModuleConstructor | string, data?: any, replace?: boolean): void;
    private onFinishOpen();
    /**
     * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发close
     *
     * @param {IModuleConstructor|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @memberof ModuleManager
     */
    close(clsOrName: IModuleConstructor | string, data?: any): void;
}
/** 再额外导出一个单例 */
export declare const moduleManager: ModuleManager;
