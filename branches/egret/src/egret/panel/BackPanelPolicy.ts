import IPanel from "olympus-r/engine/panel/IPanel";
import IPanelPolicy from "olympus-r/engine/panel/IPanelPolicy";
import { tweenFrom, tweenTo } from "../utils/TweenUtil";

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
            // 开始动画弹出
            var entity:egret.DisplayObject = panel.skin;
            egret.Tween.removeTweens(entity);
    
            // 恢复体积
            entity.scaleX = 1;
            entity.scaleY = 1;
    
            var fromX:number = 0;
            var fromY:number = 0;
    
            if(from != null) {
                fromX = from.x;
                fromY = from.y;
            } else {
                fromX = entity.stage.stageWidth * 0.5;
                fromY = entity.stage.stageHeight * 0.5;
            }
            
            // 更新弹出后位置
            entity.x = fromX - entity.width * 0.5;
            entity.y = fromY - entity.height * 0.5;
    
            // 开始缓动
            tweenFrom(entity, {
                x: fromX,
                y: fromY,
                scaleX: 0,
                scaleY: 0
            }, 300, egret.Ease.backOut).call(resolve);
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
            // 开始动画关闭
            var entity:egret.DisplayObject = panel.skin;
            egret.Tween.removeTweens(entity);
    
            var toX:number = 0;
            var toY:number = 0;
    
            if(to != null) {
                toX = to.x;
                toY = to.y;
            } else {
                toX = entity.x + entity.width * 0.5;
                toY = entity.y + entity.height * 0.5;
            }
    
            tweenTo(entity, {
                x: toX,
                y: toY,
                scaleX: 0,
                scaleY: 0
            }, 300, egret.Ease.backIn).call(resolve);
        });
    }
}