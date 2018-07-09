import { ICompileTarget } from '../../kernel/injector/BindUtil';
import IComponent from '../../kernel/interfaces/IComponent';
import IObservable from '../../kernel/interfaces/IObservable';
import { IResponseDataConstructor } from '../net/ResponseData';
/**
 * 编译bindMessage命令，不会中止编译
 */
export declare function compileMessage(mediator: IComponent, currentTarget: ICompileTarget, target: any, envModels: any[], type: IConstructor | string, name: string, exp: string, observable?: IObservable): void;
/**
 * 编译bindResponse命令，不会中止编译
 */
export declare function compileResponse(mediator: IComponent, currentTarget: ICompileTarget, target: any, envModels: any[], type: IResponseDataConstructor | string, name: string, exp: string, observable?: IObservable): void;
