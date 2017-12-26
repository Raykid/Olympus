import IMediator from "../mediator/IMediator";
import Bind from "./Bind";
import { IResponseDataConstructor } from "../net/ResponseData";
import IObservable from "../../core/observable/IObservable";
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
    private _envModel;
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
    /**
     * 绑定属性值
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {string} name 绑定的属性名
     * @param {string} exp 绑定的属性表达式
     * @memberof BindManager
     */
    bindValue(mediator: IMediator, target: any, name: string, exp: string): void;
    /**
     * 绑定方法执行
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {string} name 绑定的方法名
     * @param {...string[]} argExps 执行方法的参数表达式列表
     * @memberof BindManager
     */
    bindFunc(mediator: IMediator, target: any, name: string, ...argExps: string[]): void;
    /**
     * 绑定事件
     *
     * @param {IMediator} mediator 中介者
     * @param {*} ui 绑定到的ui实体对象
     * @param {string} type 绑定的事件类型
     * @param {string} exp 绑定的事件回调表达式
     * @memberof BindManager
     */
    bindOn(mediator: IMediator, target: any, type: string, exp: string): void;
    private replaceDisplay(bridge, ori, cur);
    /**
     * 绑定显示
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {string} exp 绑定表达式
     * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
     * @memberof BindManager
     */
    bindIf(mediator: IMediator, target: any, exp: string, callback?: (value: boolean) => void): void;
    private _regExp;
    private _regExpNum;
    /**
     * 绑定循环
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
     * @param {(data?:any, renderer?:any)=>void} [callback] 每次生成新的renderer实例时调用这个回调
     * @memberof BindManager
     */
    bindFor(mediator: IMediator, target: any, exp: string, callback?: (data?: any, renderer?: any) => void): void;
    /**
     * 绑定Message
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {string} name 绑定的属性名
     * @param {string} exp 绑定的表达式
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindMessage(mediator: IMediator, target: any, type: IConstructor | string, name: string, exp: string, observable?: IObservable): void;
    /**
     * 绑定Response
     *
     * @param {IMediator} mediator 中介者
     * @param {*} target 绑定到的target实体对象
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {string} name 绑定的属性名
     * @param {string} exp 绑定的表达式
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindResponse(mediator: IMediator, target: any, type: IResponseDataConstructor | string, name: string, exp: string, observable?: IObservable): void;
}
/** 再额外导出一个单例 */
export declare const bindManager: BindManager;
