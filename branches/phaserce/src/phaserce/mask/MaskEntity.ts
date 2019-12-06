import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import IBridge from "olympus-r/engine/bridge/IBridge";
import IMaskData from "olympus-r/engine/mask/IMaskData";
import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IPanel from "olympus-r/engine/panel/IPanel";
import PhaserCEBridge from "../../PhaserCEBridge";

/**
 * PhaserCE遮罩实现
 *
 * @author Raykid
 * @date 2019-12-05
 * @export
 * @class MaskEntityImpl
 * @implements {IMaskEntity}
 */
export default class MaskEntityImpl implements IMaskEntity
{
    private _maskAlpha:number = 0.5;
    private _loadingAlpha:number = 0.5;
    private _modalPanelAlpha:number = 0.5;

    private _mask:Phaser.Graphics;

    private _loadingSkin:PIXI.DisplayObject;
    private _loadingSkinFactory:()=>PIXI.DisplayObject;
    private _loadingMask:Phaser.Graphics;

    private _modalPanelList:IPanel[];
    private _modalPanelMask:Phaser.Graphics;

    public maskData:MaskData;
    public get loadingSkin():PIXI.DisplayObject
    {
        // 初始化皮肤
        if(!this._loadingSkin && this._loadingSkinFactory)
            this._loadingSkin = this._loadingSkinFactory();
        return this._loadingSkin;
    }

    public constructor(params:MaskData)
    {
        if(params != null)
        {
            this._maskAlpha = (params.maskAlpha != null ? params.maskAlpha : 0.5);
            this._loadingAlpha = (params.loadingAlpha != null ? params.loadingAlpha : 0.5);
            this._modalPanelAlpha = (params.modalPanelAlpha != null ? params.modalPanelAlpha : 0.5);
            this._loadingSkinFactory = params.loadingSkinFactory;
        }
        this.maskData = params;

        this._mask = params.game.add.graphics();

        this._loadingMask = params.game.add.graphics();

        this._modalPanelList = [];
        this._modalPanelMask = params.game.add.graphics();
    }

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(PhaserCEBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._maskAlpha;
        this._mask.clear();
        this._mask.beginFill(0, alpha);
        this._mask.drawRect(0, 0, bridge.stage.width, bridge.stage.height);
        this._mask.endFill();
        // 添加显示
        bridge.maskLayer.addChild(this._mask);
    }

    /**
     * 隐藏遮罩
     */
    public hideMask():void
    {
        // 隐藏
        if(this._mask.parent != null) this._mask.parent.removeChild(this._mask);
    }

    /**
     * 显示加载图
     */
    public showLoading(alpha?:number):void
    {
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(PhaserCEBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._loadingAlpha;
        this._loadingMask.clear();
        this._loadingMask.beginFill(0, alpha);
        this._loadingMask.drawRect(0, 0, bridge.stage.width, bridge.stage.height);
        this._loadingMask.endFill();
        // 添加显示
        bridge.maskLayer.addChild(this._loadingMask);
        // 添加loading皮肤
        if(this.loadingSkin)
            bridge.maskLayer.addChild(this.loadingSkin);
    }

    /**
     * 隐藏加载图
     */
    public hideLoading():void
    {
        // 隐藏
        if(this._loadingMask.parent != null) this._loadingMask.parent.removeChild(this._loadingMask);
        if(this.loadingSkin != null && this.loadingSkin.parent != null) this.loadingSkin.parent.removeChild(this._loadingSkin);
    }

    /** 显示模态窗口遮罩 */
    public showModalMask(panel:IPanel, alpha?:number):void
    {
        this._modalPanelList.push(panel);
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(PhaserCEBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._modalPanelAlpha;
        this._modalPanelMask.clear();
        this._modalPanelMask.beginFill(0, alpha);
        this._modalPanelMask.drawRect(0, 0, bridge.stage.width, bridge.stage.height);
        this._modalPanelMask.endFill();
        // 添加显示
        var entity:PIXI.DisplayObject = panel.skin;
        var parent:PIXI.DisplayObjectContainer = entity.parent;
        if(parent != null)
        {
            if(this._modalPanelMask.parent) {
                this._modalPanelMask.parent.removeChild(this._modalPanelMask);
            }
            var index:number = parent.getChildIndex(entity);
            parent.addChildAt(this._modalPanelMask, index);
        }
    }

    /** 隐藏模态窗口遮罩 */
    public hideModalMask(panel:IPanel):void
    {
        this._modalPanelList.splice(this._modalPanelList.indexOf(panel), 1);
        // 判断是否还需要Mask
        if(this._modalPanelList.length <= 0)
        {
            // 隐藏
            if(this._modalPanelMask.parent != null) this._modalPanelMask.parent.removeChild(this._modalPanelMask);
        }
        else
        {
            // 移动Mask
            var entity:PIXI.DisplayObject = this._modalPanelList[this._modalPanelList.length - 1].skin;
            var parent:PIXI.DisplayObjectContainer = entity.parent;
            if(parent != null)
            {
                if(this._modalPanelMask.parent) {
                    this._modalPanelMask.parent.removeChild(this._modalPanelMask);
                }
                var index:number = parent.getChildIndex(entity);
                parent.addChildAt(this._modalPanelMask, index);
            }
        }
    }
}

export interface MaskData extends IMaskData
{
    game?:Phaser.Game;
    maskAlpha?:number;
    loadingAlpha?:number;
    modalPanelAlpha?:number;
    loadingSkinFactory?:()=>PIXI.DisplayObject;
}