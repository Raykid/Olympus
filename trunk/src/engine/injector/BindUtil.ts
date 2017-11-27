import IObservable from "../../core/observable/IObservable";
import { IResponseDataConstructor } from "../net/ResponseData";
import { bindManager, BindFuncDict } from "../bind/BindManager";
import IMediator from "../mediator/IMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-24
 * @modify date 2017-11-24
 * 
 * 绑定工具集
*/

export interface IBindCommand
{
    /**
     * 执行绑定命令
     * 
     * @export
     * @param {IMediator} mediator 所属的中介者
     * @param {ICompileTarget} target 要编译的目标显示对象
     * @param {...any[]} args 命令参数列表
     */
    (mediator:IMediator, target:ICompileTarget, ...args:any[]):void;
}

export interface IBindParams
{
    /**
     * 绑定命令函数
     * 
     * @type {IBindCommand}
     * @memberof IBindParams
     */
    cmd:IBindCommand;
    /**
     * 绑定命令参数列表
     * 
     * @type {any[]}
     * @memberof IBindParams
     */
    args:any[];
    /**
     * 指令可以自己设置所需记录的属性
     * 
     * @memberof IBindParams
     */
    [key:string]:any;
}

export interface ICompileTarget
{
    /**
     * 绑定命令列表
     * 
     * @type {IBindParams[]}
     * @memberof ICompileTarget
     */
    __bind_commands__?:IBindParams[];
    /**
     * 其他可能的属性或方法
     */
    [key:string]:any;
}

/**
 * 添加编译命令到显示对象上
 * 
 * @export
 * @param {ICompileTarget} target 显示对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function addCompileCommand(target:ICompileTarget, cmd:IBindCommand, ...args:any[]):void
{
    var bindParams:IBindParams[] = target.__bind_commands__;
    if(!bindParams) target.__bind_commands__ = bindParams = [];
    // 添加编译指令
    bindParams.push({cmd: cmd, args: args});
}

/**
 * 将显示对象中的命令顺序反转（因为在有些地方添加命令的顺序是反的，比如Injector中监听onOpen时）
 * 
 * @export
 * @param {ICompileTarget} target 
 */
export function reverseCompileCommand(target:ICompileTarget):void
{
    var bindParams:IBindParams[] = target.__bind_commands__;
    bindParams && bindParams.reverse();
}

/**
 * 将所有编译指令从一个对象移动到另一个对象，会移除源对象当前的所有编译命令
 * 
 * @export
 * @param {ICompileTarget} from 源对象
 * @param {ICompileTarget} to 目标对象
 */
export function moveCompileCommands(from:ICompileTarget, to:ICompileTarget):void
{
    var commands:IBindParams[] = from.__bind_commands__;
    if(!commands) return;
    if(!to.__bind_commands__)
        to.__bind_commands__ = from.__bind_commands__;
    else
        to.__bind_commands__.push(...from.__bind_commands__);
    // 移除源对象的指令
    from.__bind_commands__ = [];
}

/**
 * 编译显示对象
 * 
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} target 显示对象
 */
export function compile(mediator:IMediator, target:ICompileTarget):void
{
    // 取到编译参数列表
    var bindParams:IBindParams[] = target.__bind_commands__;
    if(!bindParams) return;
    // 这里没有提前读取出length属性，因为需要动态判断数组长度
    for(var i:number = 0; i < bindParams.length; )
    {
        // 使用shift按顺序取出编译命令
        var params:IBindParams = bindParams.shift();
        // 调用编译命令，并且更新中止状态
        params.cmd(mediator, target, ...params.args);
    }
}

/**
 * 编译bindValue命令，不会中止编译
 */
export function compileValue(mediator:IMediator, target:ICompileTarget, uiDict:{[name:string]:any}):void
{
    bindManager.bindValue(mediator, target, uiDict);
}

/**
 * 编译bindFunc命令，不会中止编译
 */
export function compileFunc(mediator:IMediator, target:ICompileTarget, funcDict:BindFuncDict):void
{
    bindManager.bindFunc(mediator, target, funcDict);
}

/**
 * 编译bindOn命令，不会中止编译
 */
export function compileOn(mediator:IMediator, target:ICompileTarget, evtDict:{[type:string]:any}):void
{
    bindManager.bindOn(mediator, target, evtDict);
}

/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export function compileIf(mediator:IMediator, target:ICompileTarget, uiDict:{[name:string]:any}):void
{
    // 将后面的编译命令缓存起来
    var bindParams:IBindParams[] = target.__bind_commands__;
    var cached:IBindParams[] = bindParams.splice(0, bindParams.length);
    // 绑定if命令
    var terminated:boolean = false;
    bindManager.bindIf(mediator, target, uiDict, (value:boolean)=>{
        // 如果条件为true，则启动继续编译，但只编译一次，编译过就不需要再编译了
        if(!terminated && value)
        {
            // 恢复后面的命令
            target.__bind_commands__ = cached;
            // 继续编译
            compile(mediator, target);
            // 设置已终结标识
            terminated = true;
        }
    });
}

/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export function compileFor(mediator:IMediator, target:ICompileTarget, uiDict:{[name:string]:any}):void
{
    // 将后面的编译命令缓存起来
    var bindParams:IBindParams[] = target.__bind_commands__;
    var cached:IBindParams[] = bindParams.splice(0, bindParams.length);
    // 绑定if命令
    bindManager.bindFor(mediator, target, uiDict, (data:any, renderer:ICompileTarget)=>{
        // 将缓存的命令复制到新的renderer实例中
        renderer.__bind_commands__ = cached.concat();
        // 编译renderer实例
        compile(mediator, renderer);
    });
}

/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator:IMediator, target:ICompileTarget, type:IConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    bindManager.bindMessage(mediator, target, type, uiDict, observable);
}

/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator:IMediator, target:ICompileTarget, type:IResponseDataConstructor|string, uiDict:{[name:string]:any}, observable?:IObservable):void
{
    bindManager.bindResponse(mediator, target, type, uiDict, observable);
}