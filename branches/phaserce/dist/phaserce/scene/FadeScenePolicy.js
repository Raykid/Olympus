/**
 * 淡入淡出场景切换策略
 *
 * @author Raykid
 * @date 2019-12-06
 * @export
 * @class FadeScenePolicy
 * @implements {IScenePolicy}
 */
var FadeScenePolicy = /** @class */ (function () {
    function FadeScenePolicy() {
    }
    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    FadeScenePolicy.prototype.switch = function (from, to) {
        return new Promise(function (resolve) {
            if (from) {
                // from所在bridge应该在最上层显示
                from.bridge.htmlWrapper.style.zIndex = "2147483647";
                // 显示to
                if (to) {
                    to.skin.alpha = 1;
                    to.skin.visible = true;
                }
                // 开始淡出
                var game = from.skin.game;
                game.add.tween(from.skin).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                    if (!from.disposed) {
                        // 隐藏from
                        from.skin.visible = false;
                        // 恢复z-index
                        from.bridge.htmlWrapper.style.zIndex = "";
                    }
                    // 调用回调
                    resolve();
                });
            }
            else {
                // 调用回调
                resolve();
            }
        });
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
