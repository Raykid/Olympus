import * as tslib_1 from "tslib";
import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import { bridgeManager } from "../bridge/BridgeManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 *
 * 遮罩管理器
*/
var MaskManager = /** @class */ (function () {
    function MaskManager() {
        this._entityDict = {};
        this._loadingMaskDict = {};
    }
    MaskManager.prototype.getLoadingMaskCount = function () {
        var count = 0;
        for (var key in this._loadingMaskDict) {
            var temp = this._loadingMaskDict[key];
            if (temp > 0)
                count += temp;
        }
        return count;
    };
    MaskManager.prototype.plusLoadingMaskCount = function (key) {
        var count = this._loadingMaskDict[key] || 0;
        if (count < 0)
            count = 0;
        this._loadingMaskDict[key] = ++count;
        return count;
    };
    MaskManager.prototype.minusLoadingMaskCount = function (key) {
        var count = this._loadingMaskDict[key] || 0;
        count--;
        if (count < 0)
            count = 0;
        this._loadingMaskDict[key] = count;
        if (count == 0)
            delete this._loadingMaskDict[key];
        return count;
    };
    /**
     * 初始化MaskUtil
     * @param type 所属表现层桥
     * @param entity 遮罩实体
     */
    MaskManager.prototype.registerMask = function (type, entity) {
        this._entityDict[type] = entity;
    };
    /**
     * 显示遮罩
     */
    MaskManager.prototype.showMask = function (alpha) {
        var type = bridgeManager.currentBridge.type;
        var entity = this._entityDict[type];
        if (entity != null) {
            // 显示遮罩
            entity.showMask(alpha);
            // 调用回调
            entity.maskData.onShowMask && entity.maskData.onShowMask();
        }
    };
    /**
     * 隐藏遮罩
     */
    MaskManager.prototype.hideMask = function () {
        var type = bridgeManager.currentBridge.type;
        var entity = this._entityDict[type];
        if (entity != null) {
            // 调用回调
            entity.maskData.onHideMask && entity.maskData.onHideMask();
            // 隐藏遮罩
            entity.hideMask();
        }
    };
    /**当前是否在显示遮罩*/
    MaskManager.prototype.isShowingMask = function () {
        var type = bridgeManager.currentBridge.type;
        var entity = this._entityDict[type];
        if (entity != null)
            return entity.isShowingMask();
        return false;
    };
    /**
     * 显示加载图
     */
    MaskManager.prototype.showLoading = function (alpha, key) {
        if (key === void 0) { key = null; }
        // 若当前你没有loading则显示loading
        if (this.getLoadingMaskCount() == 0) {
            var type = bridgeManager.currentBridge.type;
            var entity = this._entityDict[type];
            if (entity != null) {
                // 显示遮罩
                entity.showLoading(alpha);
                // 调用回调
                entity.maskData.onShowLoading && entity.maskData.onShowLoading(entity.loadingSkin);
            }
        }
        // 增计数
        this.plusLoadingMaskCount(key);
    };
    /**
     * 隐藏加载图
     */
    MaskManager.prototype.hideLoading = function (key) {
        if (key === void 0) { key = null; }
        // 减计数
        this.minusLoadingMaskCount(key);
        if (this.getLoadingMaskCount() == 0) {
            // 移除loading
            var type = bridgeManager.currentBridge.type;
            var entity = this._entityDict[type];
            if (entity != null) {
                // 调用回调
                entity.maskData.onHideLoading && entity.maskData.onHideLoading(entity.loadingSkin);
                // 隐藏遮罩
                entity.hideLoading();
            }
        }
    };
    /**当前是否在显示loading*/
    MaskManager.prototype.isShowingLoading = function () {
        var type = bridgeManager.currentBridge.type;
        var entity = this._entityDict[type];
        if (entity != null)
            return entity.isShowingLoading();
        return false;
    };
    /** 显示模态窗口遮罩 */
    MaskManager.prototype.showModalMask = function (popup, alpha) {
        var type = popup.bridge.type;
        var entity = this._entityDict[type];
        if (entity != null) {
            // 显示遮罩
            entity.showModalMask(popup, alpha);
            // 调用回调
            entity.maskData.onShowModalMask && entity.maskData.onShowModalMask(popup);
        }
    };
    /** 隐藏模态窗口遮罩 */
    MaskManager.prototype.hideModalMask = function (popup) {
        var type = popup.bridge.type;
        var entity = this._entityDict[type];
        if (entity != null) {
            // 调用回调
            entity.maskData.onHideModalMask && entity.maskData.onHideModalMask(popup);
            // 隐藏遮罩
            entity.hideModalMask(popup);
        }
    };
    /** 当前是否在显示模态窗口遮罩 */
    MaskManager.prototype.isShowingModalMask = function (popup) {
        var type = popup.bridge.type;
        var entity = this._entityDict[type];
        if (entity != null)
            return entity.isShowingModalMask(popup);
        return false;
    };
    MaskManager = tslib_1.__decorate([
        Injectable
    ], MaskManager);
    return MaskManager;
}());
export default MaskManager;
/** 再额外导出一个单例 */
export var maskManager = core.getInject(MaskManager);
