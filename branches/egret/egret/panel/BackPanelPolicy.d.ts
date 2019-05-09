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
    /**
     * 显示时调用
     *
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [from] 动画起始点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    pop(panel: IPanel, from?: {
        x: number;
        y: number;
    }): Promise<void>;
    /**
     * 关闭时调用
     *
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [to] 动画完结点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    drop(panel: IPanel, to?: {
        x: number;
        y: number;
    }): Promise<void>;
}
