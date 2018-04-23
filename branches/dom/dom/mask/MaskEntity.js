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
        this._maskAlpha = 0.5;
        this._loadingAlpha = 0.5;
        this._modalPanelAlpha = 0.5;
        if (params != null) {
            this._maskAlpha = (params.maskAlpha != null ? params.maskAlpha : 0.5);
            this._loadingAlpha = (params.loadingAlpha != null ? params.loadingAlpha : 0.5);
            this._modalPanelAlpha = (params.modalPanelAlpha != null ? params.modalPanelAlpha : 0.5);
            // 初始化loading皮肤
            if (typeof params.loadingSkin == "string") {
                var temp = document.createElement("div");
                temp.innerHTML = params.loadingSkin;
                params.loadingSkin = temp;
            }
            this.loadingSkin = params.loadingSkin;
        }
        this.maskData = params || {};
        this._mask = document.createElement("div");
        this._loadingMask = document.createElement("div");
        this._modalPanelList = [];
        this._modalPanelMask = document.createElement("div");
    }
    /**
     * 显示遮罩
     */
    MaskEntityImpl.prototype.showMask = function (alpha) {
        // 显示
        var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
        // 绘制遮罩
        if (alpha == null)
            alpha = this._maskAlpha;
        this._mask.style.backgroundColor = "#000";
        this._mask.style.opacity = alpha.toString();
        this._mask.style.width = "100%";
        this._mask.style.height = "100%";
        // 添加显示
        bridge.maskLayer.appendChild(this._mask);
    };
    /**
     * 隐藏遮罩
     */
    MaskEntityImpl.prototype.hideMask = function () {
        // 隐藏
        if (this._mask.parentElement != null)
            this._mask.parentElement.removeChild(this._mask);
    };
    /**
     * 显示加载图
     */
    MaskEntityImpl.prototype.showLoading = function (alpha) {
        // 显示
        var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
        // 绘制遮罩
        if (alpha == null)
            alpha = this._loadingAlpha;
        this._loadingMask.style.backgroundColor = "#000";
        this._loadingMask.style.opacity = alpha.toString();
        this._loadingMask.style.width = "100%";
        this._loadingMask.style.height = "100%";
        // 添加显示
        bridge.maskLayer.appendChild(this._loadingMask);
        // 添加loading皮肤
        if (this.loadingSkin)
            bridge.maskLayer.appendChild(this.loadingSkin);
    };
    /**
     * 隐藏加载图
     */
    MaskEntityImpl.prototype.hideLoading = function () {
        // 隐藏
        if (this._loadingMask.parentElement != null)
            this._loadingMask.parentElement.removeChild(this._loadingMask);
        if (this.loadingSkin != null && this.loadingSkin.parentElement != null)
            this.loadingSkin.parentElement.removeChild(this.loadingSkin);
    };
    /** 显示模态窗口遮罩 */
    MaskEntityImpl.prototype.showModalMask = function (panel, alpha) {
        this._modalPanelList.push(panel);
        // 绘制遮罩
        if (alpha == null)
            alpha = this._modalPanelAlpha;
        this._modalPanelMask.style.backgroundColor = "#000";
        this._modalPanelMask.style.opacity = alpha.toString();
        this._modalPanelMask.style.width = "100%";
        this._modalPanelMask.style.height = "100%";
        // 添加显示
        var entity = panel.skin;
        var parent = entity.parentElement;
        if (parent != null) {
            if (this._modalPanelMask.parentElement) {
                this._modalPanelMask.parentElement.removeChild(this._modalPanelMask);
            }
            var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
            var index = bridge.getChildIndex(parent, entity);
            bridge.addChildAt(parent, this._modalPanelMask, index);
        }
    };
    /** 隐藏模态窗口遮罩 */
    MaskEntityImpl.prototype.hideModalMask = function (panel) {
        this._modalPanelList.splice(this._modalPanelList.indexOf(panel), 1);
        // 判断是否还需要Mask
        if (this._modalPanelList.length <= 0) {
            // 隐藏
            if (this._modalPanelMask.parentElement != null)
                this._modalPanelMask.parentElement.removeChild(this._modalPanelMask);
        }
        else {
            // 移动Mask
            var entity = this._modalPanelList[this._modalPanelList.length - 1].skin;
            var parent = entity.parentElement;
            if (parent != null) {
                if (this._modalPanelMask.parentElement) {
                    this._modalPanelMask.parentElement.removeChild(this._modalPanelMask);
                }
                var bridge = bridgeManager.getBridge(DOMBridge.TYPE);
                var index = bridge.getChildIndex(parent, entity);
                bridge.addChildAt(parent, this._modalPanelMask, index);
            }
        }
    };
    return MaskEntityImpl;
}());
export default MaskEntityImpl;
