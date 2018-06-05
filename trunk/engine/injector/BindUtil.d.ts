import IObservable from "../../core/observable/IObservable";
import Dictionary from "../../utils/Dictionary";
import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
import { IResponseDataConstructor } from "../net/ResponseData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-24
 * @modify date 2017-11-24
 *
 * 绑定工具集
*/
export interface IBindCommand {
    /**
     * 执行绑定命令
     *
     * @export
     * @param {IMediator} mediator 所属的中介者
     * @param {ICompileTarget} currentTarget 要编译的目标显示对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {...any[]} args 命令参数列表
     */
    (mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], ...args: any[]): void;
}
export interface IBindParams {
    /**
     * 绑定命令原本所在对象
     *
     * @type {*}
     * @memberof IBindParams
     */
    target: any;
    /**
     * 绑定命令函数
     *
     * @type {IBindCommand}
     * @memberof IBindParams
     */
    cmd: IBindCommand;
    /**
     * 绑定命令参数列表
     *
     * @type {any[]}
     * @memberof IBindParams
     */
    args: any[];
    /**
     * 指令可以自己设置所需记录的属性
     *
     * @memberof IBindParams
     */
    [key: string]: any;
}
export interface ICompileTarget {
    /**
     * 绑定命令列表
     *
     * @type {IBindParams[]}
     * @memberof ICompileTarget
     */
    __bind_commands__?: IBindParams[];
    /**
     * 其他可能的属性或方法
     */
    [key: string]: any;
}
export interface IStopLeftHandler {
    (target: any, bindTargets: Dictionary<any, any>[], leftHandlers: IStopLeftHandler[]): void;
}
/**
 * 添加编译命令到显示对象上（正向）
 *
 * @export
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {*} target 编译命令本来所在的对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export declare function pushCompileCommand(currentTarget: ICompileTarget, target: any, cmd: IBindCommand, ...args: any[]): void;
/**
 * 添加编译命令到显示对象上（反向）
 *
 * @export
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {*} target 编译命令本来所在的对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export declare function unshiftCompileCommand(currentTarget: ICompileTarget, target: any, cmd: IBindCommand, ...args: any[]): void;
/**
 * 编译显示对象，会先编译自身，然后再递归编译子对象
 *
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {any[]} [envModels] 环境变量数组
 */
export declare function compile(mediator: IMediator, currentTarget: ICompileTarget, envModels?: any[]): void;
/**
 * 编译bindValue命令，不会中止编译
 */
export declare function compileValue(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], name: string, exp: string): void;
/**
 * 编译bindExp命令，不会中止编译
 */
export declare function compileExp(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], exp: string): void;
/**
 * 编译bindFunc命令，不会中止编译
 */
export declare function compileFunc(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], name: string, ...argExps: string[]): void;
/**
 * 编译bindOn命令，不会中止编译
 */
export declare function compileOn(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], type: string, exp: string): void;
/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export declare function compileIf(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], exp: string): void;
/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export declare function compileFor(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], name: string, exp: string, mediatorCls?: IMediatorConstructor, declaredMediatorCls?: IMediatorConstructor, dataExp?: string): void;
/**
 * 编译bindMessage命令，不会中止编译
 */
export declare function compileMessage(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], type: IConstructor | string, name: string, exp: string, observable?: IObservable): void;
/**
 * 编译bindResponse命令，不会中止编译
 */
export declare function compileResponse(mediator: IMediator, currentTarget: ICompileTarget, target: any, envModels: any[], type: IResponseDataConstructor | string, name: string, exp: string, observable?: IObservable): void;
/**
 * 搜索UI，取到目标节点，执行回调
 *
 * @export
 * @param {*} values 值结构字典
 * @param {*} ui ui实体
 * @param {(ui:any, key:string, value:any, depth?:number)=>void} callback 回调
 * @param {number} [depth=0] 遍历深度，方法会继续增加这个深度
 */
export declare function searchUI(values: any, ui: any, callback: (ui: any, key: string, value: any, depth?: number) => void, depth?: number): void;
