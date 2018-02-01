import IObservable from "../../core/observable/IObservable";
import IMediator from "./IMediator";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 *
 * 该接口规定了中介者具有的树状嵌套结构功能
*/
export default interface IMediatorTreePart extends IObservable {
    /**
     * 获取父中介者
     *
     * @type {IMediator}
     * @memberof IMediatorTreePart
     */
    parent: IMediator;
    /**
     * 获取根级中介者（当做模块直接被打开的中介者）
     *
     * @type {IMediator}
     * @memberof IMediatorTreePart
     */
    readonly root: IMediator;
    /**
     * 获取所有子中介者
     *
     * @type {IMediator[]}
     * @memberof IMediatorTreePart
     */
    readonly children: IMediator[];
    /**
     * 托管子中介者
     *
     * @param {IMediator} child 要托管的中介者
     * @memberof IMediatorTreePart
     */
    delegateMediator(child: IMediator): void;
    /**
     * 取消托管子中介者
     *
     * @param {IMediator} child 要取消托管的中介者
     * @memberof IMediatorTreePart
     */
    undelegateMediator(child: IMediator): void;
    /**
     * 判断指定中介者是否包含在该中介者里（判断范围包括当前中介者和子孙级中介者）
     *
     * @param {IMediator} child 要判断的中介者
     * @returns {boolean}
     * @memberof IMediatorTreePart
     */
    containsMediator(child: IMediator): boolean;
}
