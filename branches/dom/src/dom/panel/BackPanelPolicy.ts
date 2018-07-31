import { Easing, Tween } from "@tweenjs/tween.js";
import IPanel from "olympus-r/engine/panel/IPanel";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";

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
        // scale变换如果加在父容器上会导致子对象宽高获取错误，所以要尽可能加在子对象上
        var subEntity:HTMLElement = entity.childElementCount > 1 ? entity : <HTMLElement>entity.children[0];
        var tween:Tween = new Tween(entity).end().stop();
        entity.style.position = "absolute";
        entity.style.left = "50%";
        entity.style.top = "50%";
        subEntity.style.transform = "scale(0)";
        // 开始缓动
        var key:string = "__tween__step__";
        entity[key] = 0;
        var props:any = {};
        props[key] = 1;
        tween.to(props, 300).easing(Easing.Back.Out).onUpdate(()=>{
            subEntity.style.transform = "scale(" + entity[key] + ")";
        }).onComplete(()=>{
            delete entity[key];
            subEntity.style.transform = "";
            callback();
        }).start();
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
        // scale变换如果加在父容器上会导致子对象宽高获取错误，所以要尽可能加在子对象上
        var subEntity:HTMLElement = entity.childElementCount > 1 ? entity : <HTMLElement>entity.children[0];
        var tween:Tween = new Tween(entity).end().stop();
        subEntity.style.transform = "scale(1)";
        // 开始缓动
        var key:string = "__tween__step__";
        entity[key] = 1;
        var props:any = {};
        props[key] = 0;
        tween.to(props, 300).easing(Easing.Back.In).onUpdate(()=>{
            subEntity.style.transform = "scale(" + entity[key] + ")";
        }).onComplete(()=>{
            delete entity[key];
            subEntity.style.transform = "";
            callback();
        }).start();
    }
}