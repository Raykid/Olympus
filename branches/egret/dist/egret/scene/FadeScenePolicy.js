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
        this._tempSnapshot = new egret.Bitmap();
    }
    /**
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    FadeScenePolicy.prototype.prepareSwitch = function (from, to) {
        if (from != null) {
            var root = from.bridge.root;
            // 截取当前屏幕
            var texture = new egret.RenderTexture();
            texture.drawToTexture(root);
            this._tempSnapshot.texture = texture;
            this._tempSnapshot.alpha = 1;
            root.addChild(this._tempSnapshot);
            // 移除from
            var fromDisplay = from.skin;
            if (fromDisplay.parent != null) {
                fromDisplay.parent.removeChild(fromDisplay);
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
        if (from != null) {
            // 开始淡出
            egret.Tween.removeTweens(this._tempSnapshot);
            egret.Tween.get(this._tempSnapshot).to({
                alpha: 0
            }, 300).call(function () {
                // 移除截屏
                if (this._tempSnapshot.parent != null) {
                    this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                }
                // 回收资源
                if (this._tempSnapshot.texture != null) {
                    this._tempSnapshot.texture.dispose();
                    this._tempSnapshot.texture = null;
                }
                // 调用回调
                callback();
            }, this);
        }
        else {
            // 移除截屏
            if (this._tempSnapshot.parent != null) {
                this._tempSnapshot.parent.removeChild(this._tempSnapshot);
            }
            // 调用回调
            callback();
        }
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
