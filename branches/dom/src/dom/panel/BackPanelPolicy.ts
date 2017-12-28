import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import IPanel from "olympus-r/engine/panel/IPanel";
import { TweenLite, Back } from "gsap";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * 回弹效果
*/
export default class BackPanelPolicy implements IPanelPolicy
{
    private _reg:RegExp = /(\w*)(\d+)(\w*)/;

    /**
     * 显示时调用
     * @param panel 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    public pop(panel:IPanel, callback:()=>void, from?:{x:number, y:number}):void
    {
        var entity:HTMLElement = panel.skin;
        var curStyle:CSSStyleDeclaration = getComputedStyle(entity);
        TweenLite.killTweensOf(entity, false, {transform: true});
        entity.style.position = "fixed";
        entity.style.left = "calc(50% - " + curStyle.width + " * 0.5)";
        entity.style.top = "calc(50% - " + curStyle.height + " * 0.5)";
        entity.style.transform = "scale(0, 0)";
        // 开始缓动
        TweenLite.to(entity, 0.3, {transform: "scale(1, 1)", ease: Back.easeOut, onComplete: ()=>{
            entity.style.transform = "";
            callback();
        }});
    }

    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    public drop(panel:IPanel, callback:()=>void, to?:{x:number, y:number}):void
    {
        var entity:HTMLElement = panel.skin;
        TweenLite.killTweensOf(entity, false, {transform: true});
        entity.style.transform = "scale(1, 1)";
        // 开始缓动
        TweenLite.to(entity, 0.3, {transform: "scale(0, 0)", ease: Back.easeIn, onComplete: ()=>{
            callback();
            entity.style.transform = "";
        }});
    }
}