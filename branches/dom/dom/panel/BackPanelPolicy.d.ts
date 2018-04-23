import IPanel from "olympus-r/engine/panel/IPanel";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 回弹效果
*/
export default class BackPanelPolicy implements IPanelPolicy {
    private _reg;
    /**
     * 显示时调用
     * @param panel 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    pop(panel: IPanel, callback: () => void, from?: {
        x: number;
        y: number;
    }): void;
    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    drop(panel: IPanel, callback: () => void, to?: {
        x: number;
        y: number;
    }): void;
}
