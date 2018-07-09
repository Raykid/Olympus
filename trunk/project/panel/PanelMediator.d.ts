import Mediator from "../mediator/Mediator";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 实现了IPanel接口的弹窗中介者基类
*/
export default class PanelMediator extends Mediator implements IPanel {
    /**
     * 弹出策略
     *
     * @type {IPanelPolicy}
     * @memberof PanelMediator
     */
    policy: IPanelPolicy;
    constructor(skin?: any, policy?: IPanelPolicy);
    __afterOnOpen(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    __afterOnClose(data?: any, to?: {
        x: number;
        y: number;
    }): void;
    /** 在弹出前调用的方法 */
    onBeforePop(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    /** 在弹出后调用的方法 */
    onAfterPop(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    /** 在关闭前调用的方法 */
    onBeforeDrop(data?: any, to?: {
        x: number;
        y: number;
    }): void;
    /** 在关闭后调用的方法 */
    onAfterDrop(data?: any, to?: {
        x: number;
        y: number;
    }): void;
}
