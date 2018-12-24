import { Easing, Tween } from "@tweenjs/tween.js";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * 淡入淡出场景切换策略
*/
var FadeScenePolicy = /** @class */ (function () {
    function FadeScenePolicy() {
    }
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    FadeScenePolicy.prototype.switch = function (from, to, callback) {
        if (from != null) {
            // 添加显示
            var position = to.skin.style.position;
            var left = to.skin.style.left;
            var top = to.skin.style.top;
            var width = to.skin.style.width;
            var height = to.skin.style.height;
            var opacity = to.skin.style.opacity;
            var zIndex = to.skin.style.zIndex;
            to.skin.style.position = "absolute";
            to.skin.style.left = "0";
            to.skin.style.top = "0";
            to.skin.style.width = "100%";
            to.skin.style.height = "100%";
            to.skin.style.opacity = "0";
            to.skin.style.display = "";
            to.skin.style.zIndex = "2147483647";
            // 开始淡出
            new Tween(to.skin.style)
                .end()
                .stop()
                .to({ opacity: opacity || "1" }, 300)
                .easing(Easing.Linear.None)
                .onComplete(function () {
                // 恢复to
                to.skin.style.position = position;
                to.skin.style.left = left;
                to.skin.style.top = top;
                to.skin.style.width = width;
                to.skin.style.height = height;
                to.skin.style.opacity = opacity;
                to.skin.style.zIndex = zIndex;
                // 隐藏from
                from.skin.style.display = "none";
                // 调用回调
                callback();
            })
                .start();
        }
        else {
            // 调用回调
            callback();
        }
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
