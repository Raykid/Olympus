var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Mediator from "../mediator/Mediator";
import { panelManager } from "./PanelManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 实现了IPanel接口的弹窗中介者基类
*/
var PanelMediator = /** @class */ (function (_super) {
    __extends(PanelMediator, _super);
    function PanelMediator(skin, policy) {
        var _this = _super.call(this, skin) || this;
        _this.policy = policy;
        return _this;
    }
    PanelMediator.prototype.__beforeOnOpen = function (data, isModel, from) {
        panelManager.pop(this, data, isModel, from);
    };
    PanelMediator.prototype.__afterOnClose = function (data, to) {
        panelManager.drop(this, data, to);
    };
    /** 在弹出前调用的方法 */
    PanelMediator.prototype.onBeforePop = function (data, isModel, from) {
        // 可重写
    };
    /** 在弹出后调用的方法 */
    PanelMediator.prototype.onAfterPop = function (data, isModel, from) {
        // 可重写
    };
    /** 在关闭前调用的方法 */
    PanelMediator.prototype.onBeforeDrop = function (data, to) {
        // 可重写
    };
    /** 在关闭后调用的方法 */
    PanelMediator.prototype.onAfterDrop = function (data, to) {
        // 可重写
    };
    return PanelMediator;
}(Mediator));
export default PanelMediator;
