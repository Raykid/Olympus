import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
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
    private _moduleNameDict;
    private _moduleStack;
    private _openCache;
    private _opening;
    /**
     * 获取当前模块
     *
     * @readonly
     * @type {IMediatorConstructor|undefined}
     * @memberof ModuleManager
     */
    readonly currentModule: IMediatorConstructor | undefined;
    /**
     * 获取当前模块的实例
     *
     * @readonly
     * @type {(IMediator|undefined)}
     * @memberof ModuleManager
     */
    readonly currentModuleInstance: IMediator | undefined;
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
     * @param {IMediatorConstructor} cls 模块类型
     * @returns {number} 索引值
     * @memberof ModuleManager
     */
    getIndex(cls: IMediatorConstructor): number;
    /**
     * 获取索引处模块类型
     *
     * @param {number} index 模块索引值
     * @returns {IMediatorConstructor} 模块类型
     * @memberof ModuleManager
     */
    getModule(index: number): IMediatorConstructor;
    private getAfter(cls);
    private getCurrent();
    /**
     * 注册模块
     *
     * @param {string} moduleName 模块名
     * @param {IMediatorConstructor} cls 模块类型
     * @memberof ModuleManager
     */
    registerModule(moduleName: string, cls: IMediatorConstructor): void;
    /**
     * 获取模块名
     *
     * @param {ModuleType} type 模块实例或模块类型
     * @returns {string} 模块名
     * @memberof ModuleManager
     */
    getModuleName(type: ModuleType): string;
    /**
     * 获取模块是否开启中
     *
     * @param {IMediatorConstructor} cls 要判断的模块类型
     * @returns {boolean} 是否开启
     * @memberof ModuleManager
     */
    isOpened(cls: IMediatorConstructor): boolean;
    private activateModule(module, from, data);
    private deactivateModule(module, to, data);
    /**
     * 打开模块
     *
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @param {boolean} [replace=false] 是否替换当前模块
     * @memberof ModuleManager
     */
    open(module: ModuleType | string, data?: any, replace?: boolean): void;
    private onFinishOpen();
    /**
     * 关闭模块，只有关闭的是当前模块时才会触发onDeactivate和onActivate，否则只会触发close
     *
     * @param {ModuleType|string} clsOrName 模块类型或名称
     * @param {*} [data] 参数
     * @memberof ModuleManager
     */
    close(module: ModuleType | string, data?: any): void;
}
/** 规定ModuleManager支持的模块参数类型 */
export declare type ModuleType = IMediatorConstructor | IMediator;
/** 再额外导出一个单例 */
export declare const moduleManager: ModuleManager;
