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
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
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
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    FadeScenePolicy.prototype.switch = function (from, to) {
        var _this = this;
        return new Promise(function (resolve) {
            if (from != null) {
                // 开始淡出
                egret.Tween.removeTweens(_this._tempSnapshot);
                egret.Tween.get(_this._tempSnapshot).to({
                    alpha: 0
                }, 300).call(function () {
                    // 移除截屏
                    if (_this._tempSnapshot.parent != null) {
                        _this._tempSnapshot.parent.removeChild(_this._tempSnapshot);
                    }
                    // 回收资源
                    if (_this._tempSnapshot.texture != null) {
                        _this._tempSnapshot.texture.dispose();
                        _this._tempSnapshot.texture = null;
                    }
                    // 调用回调
                    resolve();
                });
            }
            else {
                // 移除截屏
                if (_this._tempSnapshot.parent != null) {
                    _this._tempSnapshot.parent.removeChild(_this._tempSnapshot);
                }
                // 调用回调
                resolve();
            }
        });
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
