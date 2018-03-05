import IDisposable from "../../core/interfaces/IDisposable";
import IHasBridge from "../bridge/IHasBridge";
import IPanelPolicy from "./IPanelPolicy";
import IOpenClose from "../../core/interfaces/IOpenClose";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 弹窗接口
*/
export default interface IPanel extends IHasBridge, IOpenClose, IDisposable {
    /** 实际显示对象 */
    skin: any;
    /** 弹出策略 */
    policy: IPanelPolicy;
    /** 弹出当前弹窗（等同于调用PanelManager.pop方法） */
    open(data?: any, isModel?: boolean, from?: {
        x: number;
        y: number;
    }): IPanel;
    /** 关闭当前弹窗（等同于调用PanelManager.drop方法） */
    close(data?: any, to?: {
        x: number;
        y: number;
    }): IPanel;
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
