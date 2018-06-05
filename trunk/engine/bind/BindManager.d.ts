import IObservable from "../../core/observable/IObservable";
import IMediator from "../mediator/IMediator";
import IMediatorConstructor from "../mediator/IMediatorConstructor";
import { IResponseDataConstructor } from "../net/ResponseData";
import Bind from "./Bind";
import { EvalExp } from "./Utils";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 绑定管理器，可以将数据和显示对象绑定到一起，MVVM书写界面
*/
export default class BindManager {
    private _bindDict;
    /**
     * 绑定数据到UI上
     *
     * @param {IMediator} mediator 中介者
     * @returns {Bind} 返回绑定实例
     * @memberof BindManager
     */
    bind(mediator: IMediator): Bind;
    /**
     * 移除绑定
     *
     * @param {IMediator} mediator
     * @returns {Bind}
     * @memberof BindManager
     */
    unbind(mediator: IMediator): Bind;
    private addBindHandler(mediator, callback);
    private getNearestAncestor(bridge, target, propName);
    /**
     * 绑定属性值
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的属性名
     * @param {(EvalExp)} exp 绑定的表达式或方法
     * @memberof BindManager
     */
    bindValue(mediator: IMediator, currentTarget: any, target: any, envModels: any[], name: string, exp: EvalExp): void;
    /**
     * 绑定一个表达式，与bindValue类似，但不会给属性赋值
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {(EvalExp)} exp 绑定的表达式或方法
     * @memberof BindManager
     */
    bindExp(mediator: IMediator, currentTarget: any, target: any, envModels: any[], exp: EvalExp): void;
    /**
     * 绑定方法执行
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定的方法名
     * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
     * @memberof BindManager
     */
    bindFunc(mediator: IMediator, currentTarget: any, target: any, envModels: any[], name: string, ...argExps: (EvalExp)[]): void;
    /**
     * 绑定事件
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} type 绑定的事件类型
     * @param {EvalExp} exp 绑定的事件回调表达式或方法
     * @memberof BindManager
     */
    bindOn(mediator: IMediator, currentTarget: any, target: any, envModels: any[], type: string, exp: EvalExp): void;
    /**
     * 绑定显示
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {EvalExp} exp 绑定表达式或方法
     * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
     * @memberof BindManager
     */
    bindIf(mediator: IMediator, currentTarget: any, target: any, envModels: any[], exp: EvalExp, callback?: (value: boolean) => void): void;
    private _regExp;
    /**
     * 绑定循环
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {string} name 绑定本来所在的对象在Mediator中的名字
     * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
     * @param {IMediatorConstructor} [mediatorCls] 提供该参数将使用提供的中介者包装每一个渲染器
     * @param {IMediatorConstructor} [declaredMediatorCls] 声明的Mediator类型
     * @param {string} [dataExp] 提供给中介者包装器的数据表达式
     * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
     * @memberof BindManager
     */
    bindFor(mediator: IMediator, currentTarget: any, target: any, envModels: any[], name: string, exp: string, mediatorCls?: IMediatorConstructor, declaredMediatorCls?: IMediatorConstructor, dataExp?: string, callback?: (data: any, renderer: any, envModels: any[]) => void): void;
    /**
     * 绑定Message
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindMessage(mediator: IMediator, currentTarget: any, target: any, envModels: any[], type: IConstructor | string, name: string, exp: EvalExp, observable?: IObservable): void;
    /**
     * 绑定Response
     *
     * @param {IMediator} mediator 中介者
     * @param {*} currentTarget 绑定到的target实体对象
     * @param {*} target 绑定命令本来所在的对象
     * @param {any[]} envModels 环境变量数组
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {string} name 绑定的属性名
     * @param {EvalExp} exp 绑定的表达式或方法
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindResponse(mediator: IMediator, currentTarget: any, target: any, envModels: any[], type: IResponseDataConstructor | string, name: string, exp: EvalExp, observable?: IObservable): void;
}
/** 再额外导出一个单例 */
export declare const bindManager: BindManager;
