import { tweenFrom, tweenTo } from "../utils/TweenUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 回弹效果
*/
var BackPanelPolicy = /** @class */ (function () {
    function BackPanelPolicy() {
    }
    /**
     * 显示时调用
     * @param panel 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    BackPanelPolicy.prototype.pop = function (panel, callback, from) {
        // 开始动画弹出
        var entity = panel.skin;
        egret.Tween.removeTweens(entity);
        // 恢复体积
        entity.scaleX = 1;
        entity.scaleY = 1;
        var fromX = 0;
        var fromY = 0;
        if (from != null) {
            fromX = from.x;
            fromY = from.y;
        }
        else {
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
        }, 300, egret.Ease.backOut).call(callback);
    };
    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    BackPanelPolicy.prototype.drop = function (panel, callback, to) {
        // 开始动画关闭
        var entity = panel.skin;
        egret.Tween.removeTweens(entity);
        var toX = 0;
        var toY = 0;
        if (to != null) {
            toX = to.x;
            toY = to.y;
        }
        else {
            toX = entity.x + entity.width * 0.5;
            toY = entity.y + entity.height * 0.5;
        }
        tweenTo(entity, {
            x: toX,
            y: toY,
            scaleX: 0,
            scaleY: 0
        }, 300, egret.Ease.backIn).call(function () {
            // 恢复体积
            entity.scaleX = 1;
            entity.scaleY = 1;
            if (callback != null)
                callback();
        });
    };
    return BackPanelPolicy;
}());
export default BackPanelPolicy;
