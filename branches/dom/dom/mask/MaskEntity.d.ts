import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IPanel from "olympus-r/engine/panel/IPanel";
import IMaskData from "olympus-r/engine/mask/IMaskData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 *
 * DOM遮罩实现
*/
export default class MaskEntityImpl implements IMaskEntity {
    private _showing;
    loadingSkin: HTMLElement;
    maskData: MaskData;
    constructor(params?: MaskData);
    /**
     * 显示遮罩
     */
    showMask(alpha?: number): void;
    /**
     * 隐藏遮罩
     */
    hideMask(): void;
    /**当前是否在显示遮罩*/
    isShowingMask(): boolean;
    /**
     * 显示加载图
     */
    showLoading(alpha?: number): void;
    /**
     * 隐藏加载图
     */
    hideLoading(): void;
    /**当前是否在显示loading*/
    isShowingLoading(): boolean;
    /** 显示模态窗口遮罩 */
    showModalMask(panel: IPanel, alpha?: number): void;
    /** 隐藏模态窗口遮罩 */
    hideModalMask(panel: IPanel): void;
    /** 当前是否在显示模态窗口遮罩 */
    isShowingModalMask(panel: IPanel): boolean;
}
export interface MaskData extends IMaskData {
    loadingSkin?: HTMLElement | string;
}
