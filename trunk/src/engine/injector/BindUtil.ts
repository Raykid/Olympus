import IObservable from "../../core/observable/IObservable";
import Dictionary from "../../utils/Dictionary";
import { bindManager } from "../bind/BindManager";
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

export interface IBindCommand
{
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
    (mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], ...args:any[]):void;
}

export interface IBindParams
{
    /**
     * 绑定命令原本所在对象
     * 
     * @type {*}
     * @memberof IBindParams
     */
    target:any;
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

export interface IStopLeftHandler
{
    (target:any, bindTargets:Dictionary<any, any>[], leftHandlers:IStopLeftHandler[]):void;
}

function getBindParams(currentTarget:ICompileTarget):IBindParams[]
{
    var bindParams:IBindParams[] = currentTarget.__bind_commands__;
    if(!bindParams)
    {
        bindParams = [];
        Object.defineProperty(currentTarget, "__bind_commands__", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: bindParams
        });
    }
    return bindParams;
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
export function pushCompileCommand(currentTarget:ICompileTarget, target:any, cmd:IBindCommand, ...args:any[]):void
{
    // 添加编译指令
    getBindParams(currentTarget).push({cmd: cmd, target: target, args: args});
}

/**
 * 添加编译命令到显示对象上（反向）
 * 
 * @export
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {*} target 编译命令本来所在的对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function unshiftCompileCommand(currentTarget:ICompileTarget, target:any, cmd:IBindCommand, ...args:any[]):void
{
    getBindParams(currentTarget).unshift({cmd: cmd, target: target, args: args});
}

/**
 * 编译显示对象，会先编译自身，然后再递归编译子对象
 * 
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {any[]} [envModels] 环境变量数组
 */
export function compile(mediator:IMediator, currentTarget:ICompileTarget, envModels?:any[]):void
{
    // 取到编译参数列表
    var bindParams:IBindParams[] = currentTarget.__bind_commands__;
    // 编译currentTarget自身
    if(bindParams)
    {
        // 这里没有提前读取出length属性，因为需要动态判断数组长度
        for(var i:number = 0; i < bindParams.length; )
        {
            // 使用shift按顺序取出编译命令
            var params:IBindParams = bindParams.shift();
            // 调用编译命令，并且更新中止状态
            params.cmd(mediator, currentTarget, params.target, envModels || [], ...params.args);
        }
    }
}

/**
 * 编译bindValue命令，不会中止编译
 */
export function compileValue(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], name:string, exp:string):void
{
    bindManager.bindValue(mediator, currentTarget, target, envModels, name, exp);
}

/**
 * 编译bindExp命令，不会中止编译
 */
export function compileExp(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], exp:string):void
{
    bindManager.bindExp(mediator, currentTarget, target, envModels, exp);
}

/**
 * 编译bindFunc命令，不会中止编译
 */
export function compileFunc(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], name:string, ...argExps:string[]):void
{
    bindManager.bindFunc(mediator, currentTarget, target, envModels, name, ...argExps);
}

/**
 * 编译bindOn命令，不会中止编译
 */
export function compileOn(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], type:string, exp:string):void
{
    bindManager.bindOn(mediator, currentTarget, target, envModels, type, exp);
}

function isPosterity(mediator:IMediator, target:ICompileTarget, parent:ICompileTarget):boolean
{
    var tempParent:ICompileTarget = mediator.bridge.getParent(target);
    if(!tempParent) return false;
    else if(tempParent === parent) return true;
    else return isPosterity(mediator, tempParent, parent);
}

function getAllSubTargets(mediator:IMediator, target:ICompileTarget):ICompileTarget[]
{
    var bindTargets:Dictionary<any, any>[] = mediator.bindTargets;
    var subTargets:ICompileTarget[] = [];
    for(var bindTarget of bindTargets)
    {
        bindTarget && bindTarget.forEach(tempTarget=>{
            if(isPosterity(mediator, tempTarget, target))
                subTargets.push(tempTarget);
        });
    }
    return subTargets;
}

/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export function compileIf(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], exp:string):void
{
    // 将后面的编译命令缓存起来
    var bindParams:IBindParams[] = currentTarget.__bind_commands__;
    var caches:{target:ICompileTarget, params: IBindParams[]}[] = [{target: currentTarget, params: bindParams.splice(0, bindParams.length)}];
    // 后代节点的也要缓存住
    var subTargets:ICompileTarget[] = getAllSubTargets(mediator, currentTarget);
    for(var subTarget of subTargets)
    {
        var subBindParams:IBindParams[] = subTarget.__bind_commands__;
        caches.push({target: subTarget, params: subBindParams.splice(0, subBindParams.length)});
    }
    // 绑定if命令
    var terminated:boolean = false;
    bindManager.bindIf(mediator, currentTarget, target, envModels, exp, (value:boolean)=>{
        // 如果条件为true，则启动继续编译，但只编译一次，编译过就不需要再编译了
        if(!terminated && value)
        {
            // 恢复后面的命令
            for(var cache of caches)
            {
                cache.target.__bind_commands__ = cache.params;
                // 继续编译
                compile(mediator, cache.target, envModels);
            }
            // 设置已终结标识
            terminated = true;
        }
    });
}

/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export function compileFor(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], name:string, exp:string, mediatorCls?:IMediatorConstructor, declaredMediatorCls?:IMediatorConstructor, dataExp?:string):void
{
    // 将后面的编译命令缓存起来
    var leftHandlers:IStopLeftHandler[] = target.__stop_left_handlers__;
    // 绑定for命令
    bindManager.bindFor(mediator, currentTarget, target, envModels, name, exp, mediatorCls, declaredMediatorCls, dataExp, (data:any, renderer:ICompileTarget, subEnvModels:any[])=>{
        var subLeftHandlers:IStopLeftHandler[] = leftHandlers.concat();
        var bindTargets:Dictionary<any, any>[] = [];
        // 针对每一个renderer赋值后续编译指令
        for(var leftHandler of subLeftHandlers)
        {
            leftHandler(renderer, bindTargets, subLeftHandlers);
        }
        // 编译renderer实例
        for(var depth in bindTargets)
        {
            var dict:Dictionary<any, any> = bindTargets[depth];
            dict.forEach(currentTarget=>compile(mediator, currentTarget, subEnvModels));
        }
    });
}

/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], type:IConstructor|string, name:string, exp:string, observable?:IObservable):void
{
    bindManager.bindMessage(mediator, currentTarget, target, envModels, type, name, exp, observable);
}

/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator:IMediator, currentTarget:ICompileTarget, target:any, envModels:any[], type:IResponseDataConstructor|string, name:string, exp:string, observable?:IObservable):void
{
    bindManager.bindResponse(mediator, currentTarget, target, envModels, type, name, exp, observable);
}

/**
 * 搜索UI，取到目标节点，执行回调
 * 
 * @export
 * @param {*} values 值结构字典
 * @param {*} ui ui实体
 * @param {(ui:any, key:string, value:any, depth?:number)=>void} callback 回调
 * @param {number} [depth=0] 遍历深度，方法会继续增加这个深度
 */
export function searchUI(values:any, ui:any, callback:(ui:any, key:string, value:any, depth?:number)=>void, depth:number=0):void
{
    for(var key in values)
    {
        var value:any = values[key];
        var index:number = key.indexOf(".");
        if(index >= 0)
        {
            // 是表达式寻址，递归寻址
            var newValue:any = {};
            newValue[key.substr(index + 1)] = value;
            searchUI(newValue, ui[key.substring(0, index)], callback, depth + 1);
        }
        else if(typeof value == "object" && !(value instanceof Array))
        {
            // 是子对象寻址，递归寻址
            searchUI(value, ui[key], callback, depth + 1);
        }
        else
        {
            // 是表达式，调用回调，将调用层级也传递回去
            callback(ui, key, value, depth);
        }
    }
}