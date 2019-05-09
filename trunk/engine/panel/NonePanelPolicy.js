import { system } from '../system/System';
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
    NonePanelPolicy.prototype.pop = function (panel, from) {
        return new Promise(function (resolve) { return system.nextFrame(resolve); });
    };
    NonePanelPolicy.prototype.drop = function (panel, from) {
        return new Promise(function (resolve) { return system.nextFrame(resolve); });
    };
    return NonePanelPolicy;
}());
export { NonePanelPolicy };
/** 默认导出实例 */
export default new NonePanelPolicy();
