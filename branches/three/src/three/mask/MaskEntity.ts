import { IMaskEntity } from "olympus-r/engine/mask/MaskManager";
import IPanel from "olympus-r/engine/panel/IPanel";
import IMaskData from "olympus-r/engine/mask/IMaskData";
import ThreeBridge from "../../ThreeBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 * 
 * Three.js遮罩实现，因为纯3D不方便做UI，因此暂时不实现
*/
export default class MaskEntityImpl implements IMaskEntity
{
    public maskData:IMaskData;
    public loadingSkin:any;

    /**
     * 显示遮罩
     */
    public showMask(alpha?:number):void
    {
    }

    /**
     * 隐藏遮罩
     */
    public hideMask():void
    {
    }

    /**当前是否在显示遮罩*/
    public isShowingMask():boolean
    {
        return false;
    }

    /**
     * 显示加载图
     */
    public showLoading(alpha?:number):void
    {
    }

    /**
     * 隐藏加载图
     */
    public hideLoading():void
    {
    }

    /**当前是否在显示loading*/
    public isShowingLoading():boolean
    {
        return false;
    }

    /** 显示模态窗口遮罩 */
    public showModalMask(panel:IPanel, alpha?:number):void
    {
    }

    /** 隐藏模态窗口遮罩 */
    public hideModalMask(panel:IPanel):void
    {
    }

    /** 当前是否在显示模态窗口遮罩 */
    public isShowingModalMask(panel:IPanel):boolean
    {
        return false;
    }
}