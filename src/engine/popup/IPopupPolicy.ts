import IPopup from "./IPopup"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 弹窗动画策略，负责将弹窗动画与弹窗实体解耦
*/
export default interface IPopupPolicy
{
    /**
     * 显示时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    open(popup:IPopup, callback:()=>void, from?:{x:number, y:number}):void;
    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    close(popup:IPopup, callback:()=>void, to?:{x:number, y:number}):void;
}