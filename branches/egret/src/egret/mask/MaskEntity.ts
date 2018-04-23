import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IPanel from "olympus-r/engine/panel/IPanel";
import IBridge from "olympus-r/engine/bridge/IBridge";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import Dictionary from "olympus-r/utils/Dictionary";
import IMaskData from "olympus-r/engine/mask/IMaskData";
import EgretBridge from "../../EgretBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 * 
 * Egret遮罩实现
*/
export default class MaskEntityImpl implements IMaskEntity
{
    private _maskAlpha:number = 0.5;
    private _loadingAlpha:number = 0.5;
    private _modalPanelAlpha:number = 0.5;

    private _mask:egret.Shape;

    private _loadingSkin:egret.DisplayObject;
    private _loadingSkinFactory:()=>egret.DisplayObject;
    private _loadingMask:egret.Shape;

    private _modalPanelList:IPanel[];
    private _modalPanelMask:egret.Shape;

    public maskData:MaskData;
    public get loadingSkin():egret.DisplayObject
    {
        // 初始化皮肤
        if(!this._loadingSkin && this._loadingSkinFactory)
            this._loadingSkin = this._loadingSkinFactory();
        return this._loadingSkin;
    }

    public constructor(params?:MaskData)
    {
        if(params != null)
        {
            this._maskAlpha = (params.maskAlpha != null ? params.maskAlpha : 0.5);
            this._loadingAlpha = (params.loadingAlpha != null ? params.loadingAlpha : 0.5);
            this._modalPanelAlpha = (params.modalPanelAlpha != null ? params.modalPanelAlpha : 0.5);
            this._loadingSkinFactory = params.loadingSkinFactory;
        }
        this.maskData = params || {};

        this._mask = new egret.Shape();
        this._mask.touchEnabled = true;

        this._loadingMask = new egret.Shape();
        this._loadingMask.touchEnabled = true;

        this._modalPanelList = [];
        this._modalPanelMask = new egret.Shape();
        this._modalPanelMask.touchEnabled = true;
    }

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(EgretBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._maskAlpha;
        this._mask.graphics.clear();
        this._mask.graphics.beginFill(0, alpha);
        this._mask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
        this._mask.graphics.endFill();
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
        var bridge:IBridge = bridgeManager.getBridge(EgretBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._loadingAlpha;
        this._loadingMask.graphics.clear();
        this._loadingMask.graphics.beginFill(0, alpha);
        this._loadingMask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
        this._loadingMask.graphics.endFill();
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
        var bridge:IBridge = bridgeManager.getBridge(EgretBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._modalPanelAlpha;
        this._modalPanelMask.graphics.clear();
        this._modalPanelMask.graphics.beginFill(0, alpha);
        this._modalPanelMask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
        this._modalPanelMask.graphics.endFill();
        // 添加显示
        var entity:egret.DisplayObject = panel.skin;
        var parent:egret.DisplayObjectContainer = entity.parent;
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
            var entity:egret.DisplayObject = this._modalPanelList[this._modalPanelList.length - 1].skin;
            var parent:egret.DisplayObjectContainer = entity.parent;
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
    maskAlpha?:number;
    loadingAlpha?:number;
    modalPanelAlpha?:number;
    loadingSkinFactory?:()=>egret.DisplayObject;
}