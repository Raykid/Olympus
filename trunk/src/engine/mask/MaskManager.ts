import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import IPanel from "../panel/IPanel";
import { bridgeManager } from "../bridge/BridgeManager";
import IMaskData from "./IMaskData";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 * 
 * 遮罩管理器
*/
@Injectable
export default class MaskManager
{
    private _entityDict:{[type:number]:IMaskEntity} = {};
    private _loadingMaskDict:{[key:string]:number} = {};

    private getLoadingMaskCount():number
    {
        var count:number = 0;
        for(var key in this._loadingMaskDict)
        {
            var temp:number = this._loadingMaskDict[key];
            if(temp > 0) count += temp;
        }
        return count;
    }

    private plusLoadingMaskCount(key:string):number
    {
        var count:number = this._loadingMaskDict[key] || 0;
        if(count < 0) count = 0;
        this._loadingMaskDict[key] = ++count;
        return count;
    }

    private minusLoadingMaskCount(key:string):number
    {
        var count:number = this._loadingMaskDict[key] || 0;
        count --;
        if(count < 0) count = 0;
        this._loadingMaskDict[key] = count;
        if(count == 0) delete this._loadingMaskDict[key];
        return count;
    }

    /**
     * 初始化MaskUtil
     * @param type 所属表现层桥
     * @param entity 遮罩实体
     */
    public registerMask(type:string, entity:IMaskEntity):void
    {
        this._entityDict[type] = entity;
    }

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
        var type:string = bridgeManager.currentBridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null)
        {
            // 显示遮罩
            entity.showMask(alpha);
            // 调用回调
            entity.maskData.onShowMask && entity.maskData.onShowMask();
        }
    }

    /**
     * 隐藏遮罩
     */
    public hideMask():void
    {
        var type:string = bridgeManager.currentBridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null)
        {
            // 调用回调
            entity.maskData.onHideMask && entity.maskData.onHideMask();
            // 隐藏遮罩
            entity.hideMask();
        }
    }

    /**当前是否在显示遮罩*/
    public isShowingMask():boolean
    {
        var type:string = bridgeManager.currentBridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null) return entity.isShowingMask();
        return false;
    }

    /**
     * 显示加载图
     */
    public showLoading(alpha?:number, key:string=null):void
    {
        // 若当前你没有loading则显示loading
        if(this.getLoadingMaskCount() == 0)
        {
            var type:string = bridgeManager.currentBridge.type;
            var entity:IMaskEntity = this._entityDict[type];
            if(entity != null)
            {
                // 显示遮罩
                entity.showLoading(alpha);
                // 调用回调
                entity.maskData.onShowLoading && entity.maskData.onShowLoading(entity.loadingSkin);
            }
        }
        // 增计数
        this.plusLoadingMaskCount(key);
    }

    /**
     * 隐藏加载图
     */
    public hideLoading(key:string=null):void
    {
        // 减计数
        this.minusLoadingMaskCount(key);
        if(this.getLoadingMaskCount() == 0)
        {
            // 移除loading
            var type:string = bridgeManager.currentBridge.type;
            var entity:IMaskEntity = this._entityDict[type];
            if(entity != null)
            {
                // 调用回调
                entity.maskData.onHideLoading && entity.maskData.onHideLoading(entity.loadingSkin);
                // 隐藏遮罩
                entity.hideLoading();
            }
        }
    }

    /**当前是否在显示loading*/
    public isShowingLoading():boolean
    {
        var type:string = bridgeManager.currentBridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null) return entity.isShowingLoading();
        return false;
    }

    /** 显示模态窗口遮罩 */
    public showModalMask(popup:IPanel, alpha?:number):void
    {
        var type:string = popup.bridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null)
        {
            // 显示遮罩
            entity.showModalMask(popup, alpha);
            // 调用回调
            entity.maskData.onShowModalMask && entity.maskData.onShowModalMask(popup);
        }
    }

    /** 隐藏模态窗口遮罩 */
    public hideModalMask(popup:IPanel):void
    {
        var type:string = popup.bridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null)
        {
            // 调用回调
            entity.maskData.onHideModalMask && entity.maskData.onHideModalMask(popup);
            // 隐藏遮罩
            entity.hideModalMask(popup);
        }
    }

    /** 当前是否在显示模态窗口遮罩 */
    public isShowingModalMask(popup:IPanel):boolean
    {
        var type:string = popup.bridge.type;
        var entity:IMaskEntity = this._entityDict[type];
        if(entity != null) return entity.isShowingModalMask(popup);
        return false;
    }
}

export interface IMaskEntity
{
    readonly maskData:IMaskData;
    readonly loadingSkin:any;

    showMask(alpha?:number):void;
    hideMask():void;
    isShowingMask():boolean;

    showLoading(alpha?:number):void;
    hideLoading():void;
    isShowingLoading():boolean;

    showModalMask(popup:IPanel, alpha?:number):void;
    hideModalMask(popup:IPanel):void;
    isShowingModalMask(popup:IPanel):boolean;
}
/** 再额外导出一个单例 */
export const maskManager:MaskManager = core.getInject(MaskManager);