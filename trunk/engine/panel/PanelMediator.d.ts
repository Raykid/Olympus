import Mediator from "../mediator/Mediator";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * @export
 * @class PanelMediator
 * @extends {Mediator<S, OD, CD>}
 * @implements {IPanel<S, OD, CD>}
 * @template S 皮肤类型
 * @template OD 开启参数类型
 * @template CD 关闭参数类型
 *
 * 实现了IPanel接口的弹窗中介者基类
*/
export default class PanelMediator<S = any, OD = any, CD = any> extends Mediator<S, OD, CD> implements IPanel<S, OD, CD> {
    /**
     * 弹出策略
     *
     * @type {IPanelPolicy<S>}
     * @memberof PanelMediator
     */
    policy: IPanelPolicy<S>;
    constructor(skin?: S, policy?: IPanelPolicy<S>);
    __afterOnOpen(data?: OD, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    __afterOnClose(data?: CD, to?: {
        x: number;
        y: number;
    }): void;
    /** 在弹出前调用的方法 */
    onBeforePop(data?: OD, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    /** 在弹出后调用的方法 */
    onAfterPop(data?: OD, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    /** 在关闭前调用的方法 */
    onBeforeDrop(data?: CD, to?: {
        x: number;
        y: number;
    }): void;
    /** 在关闭后调用的方法 */
    onAfterDrop(data?: CD, to?: {
        x: number;
        y: number;
    }): void;
}
