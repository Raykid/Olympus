import IObservable from "../../core/observable/IObservable";
import { IResponseDataConstructor } from "../net/ResponseData";
import IMediator from "../mediator/IMediator";
import Dictionary from "../../utils/Dictionary";
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
     * @param {ICompileTarget} target 要编译的目标显示对象
     * @param {...any[]} args 命令参数列表
     */
    (mediator: IMediator, target: ICompileTarget, ...args: any[]): void;
}
export interface IBindParams {
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
 * @param {ICompileTarget} target 显示对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export declare function pushCompileCommand(target: ICompileTarget, cmd: IBindCommand, ...args: any[]): void;
/**
 * 添加编译命令到显示对象上（反向）
 *
 * @export
 * @param {ICompileTarget} target 显示对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export declare function unshiftCompileCommand(target: ICompileTarget, cmd: IBindCommand, ...args: any[]): void;
/**
 * 编译显示对象，会先编译自身，然后再递归编译子对象
 *
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} target 显示对象
 */
export declare function compile(mediator: IMediator, target: ICompileTarget): void;
/**
 * 编译bindValue命令，不会中止编译
 */
export declare function compileValue(mediator: IMediator, target: ICompileTarget, name: string, exp: string): void;
/**
 * 编译bindFunc命令，不会中止编译
 */
export declare function compileFunc(mediator: IMediator, target: ICompileTarget, name: string, ...argExps: string[]): void;
/**
 * 编译bindOn命令，不会中止编译
 */
export declare function compileOn(mediator: IMediator, target: ICompileTarget, type: string, exp: string): void;
/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export declare function compileIf(mediator: IMediator, target: ICompileTarget, exp: string): void;
/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export declare function compileFor(mediator: IMediator, target: ICompileTarget, exp: string): void;
/**
 * 编译bindMessage命令，不会中止编译
 */
export declare function compileMessage(mediator: IMediator, target: ICompileTarget, type: IConstructor | string, name: string, exp: string, observable?: IObservable): void;
/**
 * 编译bindResponse命令，不会中止编译
 */
export declare function compileResponse(mediator: IMediator, target: ICompileTarget, type: IResponseDataConstructor | string, name: string, exp: string, observable?: IObservable): void;
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
