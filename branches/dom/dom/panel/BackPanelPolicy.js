import { TweenLite, Back } from "gsap";
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
        this._reg = /(\w*)(\d+)(\w*)/;
    }
    /**
     * 显示时调用
     * @param panel 弹出框对象
     * @param callback 完成回调，必须调用
     * @param from 动画起始点
     */
    BackPanelPolicy.prototype.pop = function (panel, callback, from) {
        var entity = panel.skin;
        var curStyle = getComputedStyle(entity);
        TweenLite.killTweensOf(entity, false, { transform: true });
        entity.style.position = "fixed";
        entity.style.left = "calc(50% - " + curStyle.width + " * 0.5)";
        entity.style.top = "calc(50% - " + curStyle.height + " * 0.5)";
        entity.style.transform = "scale(0, 0)";
        // 开始缓动
        TweenLite.to(entity, 0.3, { transform: "scale(1, 1)", ease: Back.easeOut, onComplete: function () {
                entity.style.transform = "";
                callback();
            } });
    };
    /**
     * 关闭时调用
     * @param popup 弹出框对象
     * @param callback 完成回调，必须调用
     * @param to 动画完结点
     */
    BackPanelPolicy.prototype.drop = function (panel, callback, to) {
        var entity = panel.skin;
        TweenLite.killTweensOf(entity, false, { transform: true });
        entity.style.transform = "scale(1, 1)";
        // 开始缓动
        TweenLite.to(entity, 0.3, { transform: "scale(0, 0)", ease: Back.easeIn, onComplete: function () {
                callback();
                entity.style.transform = "";
            } });
    };
    return BackPanelPolicy;
}());
export default BackPanelPolicy;
