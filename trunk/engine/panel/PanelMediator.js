import * as tslib_1 from "tslib";
import Mediator from "../mediator/Mediator";
import { panelManager } from "./PanelManager";
import MediatorMessage from "../mediator/MediatorMessage";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 实现了IPanel接口的弹窗中介者基类
*/
var PanelMediator = /** @class */ (function (_super) {
    tslib_1.__extends(PanelMediator, _super);
    function PanelMediator(skin, policy) {
        var _this = _super.call(this, skin) || this;
        _this.policy = policy;
        return _this;
    }
    PanelMediator.prototype.__afterOnOpen = function (data, isModel, from) {
        panelManager.pop(this, data, isModel, from);
    };
    PanelMediator.prototype.__afterOnClose = function (data, to) {
        var _this = this;
        // 篡改onAfterDrop，等待关闭动画结束后再执行
        var oriOnAfterDrop = this.onAfterDrop;
        this.onAfterDrop = function (data, to) {
            oriOnAfterDrop.call(_this, data, to);
            // 派发关闭事件
            _this.dispatch(MediatorMessage.MEDIATOR_CLOSED, _this);
        };
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
