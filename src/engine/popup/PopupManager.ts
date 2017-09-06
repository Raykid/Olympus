import Core from "../../core/Core"
import IConstructor from "../../core/interfaces/IConstructor"
import IPopup from "./IPopup"
import IPopupPolicy from "./IPopupPolicy"
import none from "./NonePopupPolicy"
import PopupMessage from "./PopupMessage"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
*/
@Injectable
export default class PopupManager
{
    @Inject(Core)
    private _core:Core;

    private _popups:IPopup[] = [];

    /**
     * 获取当前显示的弹窗数组（副本）
     * 
     * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
     * @returns {IPopup[]} 已打开弹窗数组
     * @memberof PopupManager
     */
    public getOpened(cls?:IConstructor):IPopup[]
    {
        if(!cls) return this._popups.concat();
        else return this._popups.filter(popup=>popup.constructor==cls);
    }

    /**
     * 打开一个弹窗
     * 
     * @param {IPopup} popup 要打开的弹窗
     * @param {boolean} [isModel=true] 是否模态弹出
     * @param {{x:number, y:number}} [from] 弹出起点位置
     * @returns {IPopup} 返回弹窗对象
     * @memberof PopupManager
     */
    public open(popup:IPopup, isModel:boolean=true, from?:{x:number, y:number}):IPopup
    {
        if(this._popups.indexOf(popup) < 0)
        {
            var policy:IPopupPolicy = popup.getPolicy();
            if(policy == null) policy = none;
            // 派发消息
            this._core.dispatch(PopupMessage.POPUP_BEFORE_OPEN, popup, isModel, from);
            // 调用回调
            popup.onBeforeOpen(isModel, from);
            // 调用策略接口
            policy.open(popup, ()=>{
                // 派发消息
                this._core.dispatch(PopupMessage.POPUP_AFTER_OPEN, popup, isModel, from);
                // 调用回调
                popup.onAfterOpen(isModel, from);
            }, from);
        }
        return popup;
    }

    /**
     * 关闭一个弹窗
     * 
     * @param {IPopup} popup 要关闭的弹窗
     * @param {{x:number, y:number}} [to] 关闭终点位置
     * @returns {IPopup} 返回弹窗对象
     * @memberof PopupManager
     */
    public close(popup:IPopup, to?:{x:number, y:number}):IPopup
    {
        var index:number = this._popups.indexOf(popup);
        if(index >= 0)
        {
            var policy:IPopupPolicy = popup.getPolicy();
            if(policy == null) policy = none;
            // 派发消息
            this._core.dispatch(PopupMessage.POPUP_BEFORE_CLOSE, popup, to);
            // 调用回调
            popup.onBeforeClose(to);
            // 调用策略接口
            policy.close(popup, ()=>{
                // 派发消息
                this._core.dispatch(PopupMessage.POPUP_AFTER_CLOSE, popup, to);
                // 调用回调
                popup.onAfterClose(to);
            }, to);
        }
        return popup;
    }
}