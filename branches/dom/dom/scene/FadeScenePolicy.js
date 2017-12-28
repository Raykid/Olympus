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
    };
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    FadeScenePolicy.prototype.switch = function (from, to, callback) {
    };
    return FadeScenePolicy;
}());
export default FadeScenePolicy;
