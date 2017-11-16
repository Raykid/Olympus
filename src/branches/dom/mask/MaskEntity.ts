import { IMaskEntity } from "engine/mask/MaskManager";
import IBridge from "engine/bridge/IBridge";
import { bridgeManager } from "engine/bridge/BridgeManager";
import IPanel from "engine/panel/IPanel";
import IMaskData from "engine/mask/IMaskData";
import DOMBridge from "../DOMBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 * 
 * DOM遮罩实现
*/
export default class MaskEntityImpl implements IMaskEntity
{
    private _showing:boolean = false;

    public loadingSkin:HTMLElement;
    public maskData:MaskData;

    public constructor(params?:MaskData)
    {
        if(params)
        {
            if(typeof params.loadingSkin == "string")
            {
                var temp:HTMLElement = document.createElement("div");
                temp.innerHTML = params.loadingSkin;
                params.loadingSkin = temp;
            }
            this.loadingSkin = params.loadingSkin;
        }
        this.maskData = params || {};
    }

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
        // DOM框架不需要遮罩，全部依赖CSS实现
    }

    /**
     * 隐藏遮罩
     */
    public hideMask():void
    {
        // DOM框架不需要遮罩，全部依赖CSS实现
    }

    /**当前是否在显示遮罩*/
    public isShowingMask():boolean
    {
        // DOM框架不需要遮罩，全部依赖CSS实现
        return false;
    }

    /**
     * 显示加载图
     */
    public showLoading(alpha?:number):void
    {
        if(this.loadingSkin == null || this._showing) return;
        this._showing = true;
        // 显示
        var bridge:IBridge = bridgeManager.getBridge(DOMBridge.TYPE);
        bridge.addChild(bridge.maskLayer, this.loadingSkin);
    }

    /**
     * 隐藏加载图
     */
    public hideLoading():void
    {
        if(this.loadingSkin == null || !this._showing) return;
        this._showing = false;
        // 隐藏
        var bridge:IBridge = bridgeManager.getBridge(DOMBridge.TYPE);
        bridge.removeChild(bridge.maskLayer, this.loadingSkin);
    }

    /**当前是否在显示loading*/
    public isShowingLoading():boolean
    {
        return this._showing;
    }

    /** 显示模态窗口遮罩 */
    public showModalMask(panel:IPanel, alpha?:number):void
    {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
    }

    /** 隐藏模态窗口遮罩 */
    public hideModalMask(panel:IPanel):void
    {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
    }

    /** 当前是否在显示模态窗口遮罩 */
    public isShowingModalMask(panel:IPanel):boolean
    {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
        return false;
    }
}

export interface MaskData extends IMaskData
{
    loadingSkin?:HTMLElement|string;
}