/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 *
 * Egret缓动工具集，用来弥补Egret的Tween的不足
*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tweenTo(target, props, duration, ease) {
        return egret.Tween.get(target).to(props, duration, ease);
    }
    exports.tweenTo = tweenTo;
    function tweenFrom(target, props, duration, ease) {
        // 对换参数状态
        var toProps = {};
        for (var key in props) {
            toProps[key] = target[key];
            target[key] = props[key];
        }
        // 开始缓动
        return egret.Tween.get(target).to(toProps, duration, ease);
    }
    exports.tweenFrom = tweenFrom;
});
//# sourceMappingURL=TweenUtil.js.map