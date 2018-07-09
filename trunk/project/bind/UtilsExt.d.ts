import { EvalExp } from '../../kernel/bind/Utils';
import IComponent from '../../kernel/interfaces/IComponent';
import IObservable from '../../kernel/interfaces/IObservable';
import { IResponseDataConstructor } from '../net/ResponseData';
/**
 * 绑定Message
 *
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IConstructor|string} type 绑定的消息类型字符串
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export declare function bindMessage(comp: IComponent, currentTarget: any, target: any, envModels: any[], type: IConstructor | string, name: string, exp: EvalExp, observable?: IObservable): void;
/**
 * 绑定Response
 *
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export declare function bindResponse(comp: IComponent, currentTarget: any, target: any, envModels: any[], type: IResponseDataConstructor | string, name: string, exp: EvalExp, observable?: IObservable): void;
