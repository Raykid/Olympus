/// <reference types="phaser-ce/typescript/phaser" />
import IMaskData from "olympus-r/engine/mask/IMaskData";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IPanel from "olympus-r/engine/panel/IPanel";
/**
 * PhaserCE遮罩实现
 *
 * @author Raykid
 * @date 2019-12-05
 * @export
 * @class MaskEntityImpl
 * @implements {IMaskEntity}
 */
export default class MaskEntityImpl implements IMaskEntity {
    private _maskAlpha;
    private _loadingAlpha;
    private _modalPanelAlpha;
    private _mask;
    private _loadingSkin;
    private _loadingSkinFactory;
    private _loadingMask;
    private _modalPanelList;
    private _modalPanelMask;
    maskData: MaskData;
    readonly loadingSkin: PIXI.DisplayObject;
    constructor(params: MaskData);
    /**
     * 显示遮罩
     */
    showMask(alpha?: number): void;
    /**
     * 隐藏遮罩
     */
    hideMask(): void;
    /**
     * 显示加载图
     */
    showLoading(alpha?: number): void;
    /**
     * 隐藏加载图
     */
    hideLoading(): void;
    /** 显示模态窗口遮罩 */
    showModalMask(panel: IPanel, alpha?: number): void;
    /** 隐藏模态窗口遮罩 */
    hideModalMask(panel: IPanel): void;
}
export interface MaskData extends IMaskData {
    game?: Phaser.Game;
    maskAlpha?: number;
    loadingAlpha?: number;
    modalPanelAlpha?: number;
    loadingSkinFactory?: () => PIXI.DisplayObject;
}
