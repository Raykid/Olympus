import IPanel from "../panel/IPanel";
import IMaskData from "./IMaskData";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 *
 * 遮罩管理器
*/
export default class MaskManager {
    private _entityDict;
    private _loadingMaskDict;
    private getLoadingMaskCount();
    private plusLoadingMaskCount(key);
    private minusLoadingMaskCount(key);
    /**
     * 初始化MaskUtil
     * @param type 所属表现层桥
     * @param entity 遮罩实体
     */
    registerMask(type: string, entity: IMaskEntity): void;
    private _isShowingMask;
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
    showLoading(alpha?: number, key?: string): void;
    /**
     * 隐藏加载图
     */
    hideLoading(key?: string): void;
    /**当前是否在显示loading*/
    isShowingLoading(): boolean;
    private _modalMaskDict;
    /** 显示模态窗口遮罩 */
    showModalMask(popup: IPanel, alpha?: number): void;
    /** 隐藏模态窗口遮罩 */
    hideModalMask(popup: IPanel): void;
    /** 当前是否在显示模态窗口遮罩 */
    isShowingModalMask(popup: IPanel): boolean;
}
export interface IMaskEntity {
    readonly maskData: IMaskData;
    readonly loadingSkin: any;
    showMask(alpha?: number): void;
    hideMask(): void;
    showLoading(alpha?: number): void;
    hideLoading(): void;
    showModalMask(popup: IPanel, alpha?: number): void;
    hideModalMask(popup: IPanel): void;
}
/** 再额外导出一个单例 */
export declare const maskManager: MaskManager;
