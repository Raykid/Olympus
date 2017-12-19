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
    /**
     * 弹出当前弹窗（等同于调用PanelManager.pop方法）
     *
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    open(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): IPanel;
    /**
     * 弹出当前弹窗（只能由PanelManager调用）
     *
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @memberof PanelMediator
     */
    __open(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): void;
    /**
     * 关闭当前弹窗（等同于调用PanelManager.drop方法）
     *
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    close(data?: any, to?: {
        x: number;
        y: number;
    }): IPanel;
    /**
     * 关闭当前弹窗（只能由PanelManager调用）
     *
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @memberof PanelMediator
     */
    __close(data?: any, to?: {
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
