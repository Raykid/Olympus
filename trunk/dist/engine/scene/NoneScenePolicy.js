/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 无任何动画的场景策略，可应用于任何显示层实现
*/
var NoneScenePolicy = /** @class */ (function () {
    function NoneScenePolicy() {
    }
    /**
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    NoneScenePolicy.prototype.prepareSwitch = function (from, to) {
        // 这个策略里啥也不用准备
    };
    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    NoneScenePolicy.prototype.switch = function (from, to, callback) {
        // 直接延迟到下一帧回调（不能同步回调，否则可能会出问题）
        setTimeout(callback, 0);
    };
    return NoneScenePolicy;
}());
export { NoneScenePolicy };
/** 默认导出实例 */
export default new NoneScenePolicy();
