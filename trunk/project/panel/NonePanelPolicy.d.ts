import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 无任何动画的弹出策略，可应用于任何显示层实现
*/
export declare class NonePanelPolicy implements IPanelPolicy {
    pop(panel: IPanel, callback: () => void, from?: {
        x: number;
        y: number;
    }): void;
    drop(panel: IPanel, callback: () => void, from?: {
        x: number;
        y: number;
    }): void;
}
declare const _default: NonePanelPolicy;
export default _default;
