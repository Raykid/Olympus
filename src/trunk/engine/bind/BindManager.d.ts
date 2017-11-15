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
    private search(values, ui, callback);
    private delaySearch(mediator, values, ui, callback);
    /**
     * 绑定属性值
     *
     * @param {IMediator} mediator 中介者
     * @param {{[name:string]:string}} uiDict ui属性字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    bindValue(mediator: IMediator, uiDict: {
        [name: string]: string;
    }, ui: any): void;
    /**
     * 绑定事件
     *
     * @param {IMediator} mediator 中介者
     * @param {{[type:string]:string}} evtDict 事件字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    bindOn(mediator: IMediator, evtDict: {
        [type: string]: string;
    }, ui: any): void;
    private replaceDisplay(bridge, ori, cur);
    /**
     * 绑定显示
     *
     * @param {IMediator} mediator 中介者
     * @param {{[name:string]:string}} uiDict 判断字典
     * @param {*} ui 绑定到的ui实体对象
     * @memberof BindManager
     */
    bindIf(mediator: IMediator, uiDict: {
        [name: string]: string;
    }, ui: any): void;
    /**
     * 绑定全局Message
     *
     * @param {IMediator} mediator 中介者
     * @param {IConstructor|string} type 绑定的消息类型字符串
     * @param {{[name:string]:string}} uiDict ui表达式字典
     * @param {*} ui 绑定到的ui实体对象
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindMessage(mediator: IMediator, type: IConstructor | string, uiDict: {
        [name: string]: string;
    }, ui: any, observable?: IObservable): void;
    /**
     * 绑定全局Response
     *
     * @param {IMediator} mediator 中介者
     * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
     * @param {{[name:string]:string}} uiDict ui表达式字典
     * @param {*} ui 绑定到的ui实体对象
     * @param {IObservable} [observable] 绑定的消息内核，默认是core
     * @memberof BindManager
     */
    bindResponse(mediator: IMediator, type: IResponseDataConstructor | string, uiDict: {
        [name: string]: string;
    }, ui: any, observable?: IObservable): void;
}
/** 再额外导出一个单例 */
export declare const bindManager: BindManager;
