import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import DOMBridge from "../../DOMBridge";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 *
 * DOM遮罩实现
*/
var MaskEntityImpl = /** @class */ (function () {
    function MaskEntityImpl(params) {
        this._showing = false;
        if (params) {
            if (typeof params.loadingSkin == "string") {
                var temp = document.createElement("div");
                temp.innerHTML = params.loadingSkin;
                params.loadingSkin = temp;
            }
            this.loadingSkin = params.loadingSkin;
        }
        this.maskData = params || {};
    }
    /**
     * 显示遮罩
     */
    MaskEntityImpl.prototype.showMask = function (alpha) {
        // DOM框架不需要遮罩，全部依赖CSS实现
    };
    /**
     * 隐藏遮罩
     */
    MaskEntityImpl.prototype.hideMask = function () {
        // DOM框架不需要遮罩，全部依赖CSS实现
    };
    /**当前是否在显示遮罩*/
    MaskEntityImpl.prototype.isShowingMask = function () {
        // DOM框架不需要遮罩，全部依赖CSS实现
        return false;
    };
    /**
     * 显示加载图
     */
    MaskEntityImpl.prototype.showLoading = function (alpha) {
        if (this.loadingSkin == null || this._showing)
            return;
        this._showing = true;
        // 显示
        var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
        bridge.addChild(bridge.maskLayer, this.loadingSkin);
    };
    /**
     * 隐藏加载图
     */
    MaskEntityImpl.prototype.hideLoading = function () {
        if (this.loadingSkin == null || !this._showing)
            return;
        this._showing = false;
        // 隐藏
        var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
        bridge.removeChild(bridge.maskLayer, this.loadingSkin);
    };
    /**当前是否在显示loading*/
    MaskEntityImpl.prototype.isShowingLoading = function () {
        return this._showing;
    };
    /** 显示模态窗口遮罩 */
    MaskEntityImpl.prototype.showModalMask = function (panel, alpha) {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
    };
    /** 隐藏模态窗口遮罩 */
    MaskEntityImpl.prototype.hideModalMask = function (panel) {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
    };
    /** 当前是否在显示模态窗口遮罩 */
    MaskEntityImpl.prototype.isShowingModalMask = function (panel) {
        // DOM框架不需要模态窗口遮罩，全部依赖CSS实现
        return false;
    };
    return MaskEntityImpl;
}());
export default MaskEntityImpl;
