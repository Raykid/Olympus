import { ICompileTarget } from '../../kernel/injector/BindUtil';
import IComponent from '../../kernel/interfaces/IComponent';
import IObservable from '../../kernel/interfaces/IObservable';
import { bindMessage, bindResponse } from '../bind/BindUtilExt';
import { IResponseDataConstructor } from '../net/ResponseData';

/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator:IComponent, currentTarget:ICompileTarget, target:any, envModels:any[], type:IConstructor|string, name:string, exp:string, observable?:IObservable):void
{
    bindMessage(mediator, currentTarget, target, envModels, type, name, exp, observable);
}

/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator:IComponent, currentTarget:ICompileTarget, target:any, envModels:any[], type:IResponseDataConstructor|string, name:string, exp:string, observable?:IObservable):void
{
    bindResponse(mediator, currentTarget, target, envModels, type, name, exp, observable);
}