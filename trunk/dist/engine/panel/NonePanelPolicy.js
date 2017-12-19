/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 无任何动画的弹出策略，可应用于任何显示层实现
*/
var NonePanelPolicy = /** @class */ (function () {
    function NonePanelPolicy() {
    }
    NonePanelPolicy.prototype.pop = function (panel, callback, from) {
        setTimeout(callback, 0);
    };
    NonePanelPolicy.prototype.drop = function (panel, callback, from) {
        setTimeout(callback, 0);
    };
    return NonePanelPolicy;
}());
export { NonePanelPolicy };
/** 默认导出实例 */
export default new NonePanelPolicy();
