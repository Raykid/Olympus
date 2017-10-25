import { IMaskEntity } from "engine/mask/Mask";
import IPanel from "engine/panel/IPanel";
import IBridge from "engine/bridge/IBridge";
import { bridgeManager } from "engine/bridge/BridgeManager";
import DOMBridge from "../../DOMBridge";
import Dictionary from "utils/Dictionary";

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
    private _maskAlpha:number;
    private _loadingAlpha:number;
    private _modalPanelAlpha:number;

    private _showingMask:boolean = false;
    private _mask:egret.Shape;

    private _skin:egret.DisplayObject;
    private _showingLoading:boolean = false;
    private _loadingMask:egret.Shape;

    private _modalPanelDict:Dictionary<IPanel, IPanel>;
    private _modalPanelList:IPanel[];
    private _modalPanelMask:egret.Shape;

    public constructor(params?:MaskData)
    {
        if(params != null)
        {
            this._maskAlpha = (params.maskAlpha != null ? params.maskAlpha : 0.5);
            this._loadingAlpha = (params.loadingAlpha != null ? params.loadingAlpha : 0.5);
            this._modalPanelAlpha = (params.modalPanelAlpha != null ? params.modalPanelAlpha : 0.5);
            this._skin = params.skin;
        }

        this._mask = new egret.Shape();
        this._mask.touchEnabled = true;

        this._loadingMask = new egret.Shape();
        this._loadingMask.touchEnabled = true;

        this._modalPanelDict = new Dictionary();
        this._modalPanelList = [];
        this._modalPanelMask = new egret.Shape();
        this._modalPanelMask.touchEnabled = true;
    }

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
        if(this._showingMask) return;
        this._showingMask = true;
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(DOMBridge.TYPE);
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
        if(!this._showingMask) return;
        this._showingMask = false;
        // 隐藏
        if(this._mask.parent != null) this._mask.parent.removeChild(this._mask);
    }

    /**当前是否在显示遮罩*/
    public isShowingMask():boolean
    {
        return this._showingMask;
    }

    /**
     * 显示加载图
     */
    public showLoading(alpha?:number):void
    {
        if(this._showingLoading) return;
        this._showingLoading = true;
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(DOMBridge.TYPE);
        // 绘制遮罩
        if(alpha == null) alpha = this._loadingAlpha;
        this._loadingMask.graphics.clear();
        this._loadingMask.graphics.beginFill(0, alpha);
        this._loadingMask.graphics.drawRect(0, 0, bridge.root.stage.stageWidth, bridge.root.stage.stageHeight);
        this._loadingMask.graphics.endFill();
        // 添加显示
        bridge.maskLayer.addChild(this._loadingMask);
        if(this._skin != null) bridge.maskLayer.addChild(this._skin);
    }

    /**
     * 隐藏加载图
     */
    public hideLoading():void
    {
        if(!this._showingLoading) return;
        this._showingLoading = false;
        // 隐藏
        if(this._loadingMask.parent != null) this._loadingMask.parent.removeChild(this._loadingMask);
        if(this._skin != null && this._skin.parent != null) this._skin.parent.removeChild(this._skin);
    }

    /**当前是否在显示loading*/
    public isShowingLoading():boolean
    {
        return this._showingLoading;
    }

    /** 显示模态窗口遮罩 */
    public showModalMask(panel:IPanel, alpha?:number):void
    {
        if(this.isShowingModalMask(panel)) return;
        this._modalPanelDict.set(panel, panel);
        this._modalPanelList.push(panel);
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(DOMBridge.TYPE);
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
        if(!this.isShowingModalMask(panel)) return;
        this._modalPanelDict.delete(panel);
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

    /** 当前是否在显示模态窗口遮罩 */
    public isShowingModalMask(panel:IPanel):boolean
    {
        return (this._modalPanelDict.get(panel) != null);
    }
}

export interface MaskData
{
    maskAlpha?:number,
    loadingAlpha?:number,
    modalPanelAlpha?:number,
    skin?:egret.DisplayObject
}