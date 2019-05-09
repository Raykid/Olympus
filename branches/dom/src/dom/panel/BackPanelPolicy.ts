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
    /**
     * 显示时调用
     * 
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [from] 动画起始点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    public pop(panel:IPanel, from?:{x:number, y:number}):Promise<void>
    {
        return new Promise(resolve=>{
            var entity:HTMLElement = panel.skin;
            // scale变换如果加在父容器上会导致子对象宽高获取错误，所以要尽可能加在子对象上
            var subEntity:HTMLElement = entity.childElementCount > 1 ? entity : <HTMLElement>entity.children[0];
            subEntity.style.transform = "scale(1)";
            var tween:Tween = new Tween(entity).end().stop();
            entity.style.position = "absolute";
            entity.style.left = `calc(50% - ${subEntity.offsetWidth * 0.5}px)`;
            entity.style.top = `calc(50% - ${subEntity.offsetHeight * 0.5}px)`;
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
                resolve();
            }).start();
        });
    }

    /**
     * 关闭时调用
     * 
     * @param {IPanel<S>} panel 弹出框对象
     * @param {{x:number, y:number}} [to] 动画完结点
     * @returns {Promise<void>}
     * @memberof IPanelPolicy
     */
    public drop(panel:IPanel, to?:{x:number, y:number}):Promise<void>
    {
        return new Promise(resolve=>{
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
                resolve();
            }).start();
        });
    }
}