import { Tween, Easing } from "@tweenjs/tween.js";
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
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    FadeScenePolicy.prototype.prepareSwitch = function (from, to) {
        if (from != null) {
            // 移除克隆节点
            if (this._stageClone && this._stageClone.parentElement) {
                this._stageClone.parentElement.removeChild(this._stageClone);
            }
            // 克隆当前屏幕
            var stage = from.bridge.stage;
            this._stageClone = stage.cloneNode(true);
            this._stageClone.style.position = "fixed";
            this._stageClone.style.left = "0";
            this._stageClone.style.top = "0";
            this._stageClone.style.zIndex = "2147483647"; // 层级要最高
            this._stageClone.style.pointerEvents = "none"; // 要屏蔽点击事件
            // 添加克隆节点
            from.bridge.htmlWrapper.appendChild(this._stageClone);
            // 移除from
            var fromDisplay = from.skin;
            if (fromDisplay.parentElement != null) {
                fromDisplay.parentElement.removeChild(fromDisplay);
            }
        }
    };
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    FadeScenePolicy.prototype.switch = function (from, to, callback) {
        var _this = this;
        if (from != null) {
            // 开始淡出
            var key = "__tween__step__";
            this._stageClone[key] = 1;
            var props = {};
            props[key] = 0;
            new Tween(this._stageClone)
                .end()
                .stop()
                .to(props, 300)
                .easing(Easing.Linear.None)
                .onUpdate(function () {
                _this._stageClone.style.opacity = _this._stageClone[key];
            })
                .onComplete(function () {
                delete _this._stageClone[key];
                // 移除截屏
                if (_this._stageClone.parentElement != null) {
                    _this._stageClone.parentElement.removeChild(_this._stageClone);
                }
                // 调用回调
                callback();
            })
                .start();
        }
        else {
            // 移除克隆节点
            if (this._stageClone && this._stageClone.parentElement) {
                this._stageClone.parentElement.removeChild(this._stageClone);
            }
            // 调用回调
            callback();
        }
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
