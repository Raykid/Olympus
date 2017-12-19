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
    /**
     * 弹出当前弹窗（等同于调用PanelManager.pop方法）
     *
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    PanelMediator.prototype.open = function (data, isModel, from) {
        return panelManager.pop(this, data, isModel, from);
    };
    /**
     * 弹出当前弹窗（只能由PanelManager调用）
     *
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @memberof PanelMediator
     */
    PanelMediator.prototype.__open = function (data, isModel, from) {
        _super.prototype.open.call(this, data);
    };
    /**
     * 关闭当前弹窗（等同于调用PanelManager.drop方法）
     *
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    PanelMediator.prototype.close = function (data, to) {
        return panelManager.drop(this, data, to);
    };
    /**
     * 关闭当前弹窗（只能由PanelManager调用）
     *
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @memberof PanelMediator
     */
    PanelMediator.prototype.__close = function (data, to) {
        _super.prototype.close.call(this, data);
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
