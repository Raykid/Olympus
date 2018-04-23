import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import Dictionary from '../../utils/Dictionary';
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
        this._isShowingMask = false;
        this._modalMaskDict = new Dictionary();
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
        // 判断是否已经开启了
        if (this._isShowingMask)
            return;
        this._isShowingMask = true;
        // 每个已注册的表现层都显示遮罩
        for (var _i = 0, _a = bridgeManager.bridges; _i < _a.length; _i++) {
            var bridge = _a[_i];
            var entity = this._entityDict[bridge.type];
            if (entity != null) {
                // 显示遮罩
                entity.showMask(alpha);
                // 调用回调
                entity.maskData.onShowMask && entity.maskData.onShowMask();
            }
        }
    };
    /**
     * 隐藏遮罩
     */
    MaskManager.prototype.hideMask = function () {
        // 判断是否已经开启了
        if (!this._isShowingMask)
            return;
        this._isShowingMask = false;
        // 每个已注册的表现层都移除遮罩
        for (var _i = 0, _a = bridgeManager.bridges; _i < _a.length; _i++) {
            var bridge = _a[_i];
            var entity = this._entityDict[bridge.type];
            if (entity != null) {
                // 调用回调
                entity.maskData.onHideMask && entity.maskData.onHideMask();
                // 隐藏遮罩
                entity.hideMask();
            }
        }
    };
    /**当前是否在显示遮罩*/
    MaskManager.prototype.isShowingMask = function () {
        return this._isShowingMask;
    };
    /**
     * 显示加载图
     */
    MaskManager.prototype.showLoading = function (alpha, key) {
        if (key === void 0) { key = null; }
        // 若当前你没有loading则显示loading
        if (this.getLoadingMaskCount() == 0) {
            for (var _i = 0, _a = bridgeManager.bridges; _i < _a.length; _i++) {
                var bridge = _a[_i];
                var entity = this._entityDict[bridge.type];
                if (entity != null) {
                    // 显示遮罩
                    entity.showLoading(alpha);
                    // 调用回调
                    entity.maskData.onShowLoading && entity.maskData.onShowLoading(entity.loadingSkin);
                }
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
            for (var _i = 0, _a = bridgeManager.bridges; _i < _a.length; _i++) {
                var bridge = _a[_i];
                var entity = this._entityDict[bridge.type];
                if (entity != null) {
                    // 调用回调
                    entity.maskData.onHideLoading && entity.maskData.onHideLoading(entity.loadingSkin);
                    // 隐藏遮罩
                    entity.hideLoading();
                }
            }
        }
    };
    /**当前是否在显示loading*/
    MaskManager.prototype.isShowingLoading = function () {
        return (this.getLoadingMaskCount() > 0);
    };
    /** 显示模态窗口遮罩 */
    MaskManager.prototype.showModalMask = function (popup, alpha) {
        // 判断是否已经在打开了
        if (this.isShowingModalMask(popup))
            return;
        // 开启遮罩
        var bridge = bridgeManager.getBridgeBySkin(popup.skin);
        if (bridge) {
            var entity = this._entityDict[bridge.type];
            if (entity != null) {
                // 记录
                this._modalMaskDict.set(popup, popup);
                // 显示遮罩
                entity.showModalMask(popup, alpha);
                // 调用回调
                entity.maskData.onShowModalMask && entity.maskData.onShowModalMask(popup);
            }
        }
    };
    /** 隐藏模态窗口遮罩 */
    MaskManager.prototype.hideModalMask = function (popup) {
        // 判断是否已经开启了
        if (!this.isShowingModalMask(popup))
            return;
        // 开始关闭遮罩
        var bridge = bridgeManager.getBridgeBySkin(popup.skin);
        if (bridge) {
            var entity = this._entityDict[bridge.type];
            if (entity != null) {
                // 记录
                this._modalMaskDict.delete(popup);
                // 调用回调
                entity.maskData.onHideModalMask && entity.maskData.onHideModalMask(popup);
                // 隐藏遮罩
                entity.hideModalMask(popup);
            }
        }
    };
    /** 当前是否在显示模态窗口遮罩 */
    MaskManager.prototype.isShowingModalMask = function (popup) {
        return (this._modalMaskDict.get(popup) != null);
    };
    MaskManager = tslib_1.__decorate([
        Injectable
    ], MaskManager);
    return MaskManager;
}());
export default MaskManager;
/** 再额外导出一个单例 */
export var maskManager = core.getInject(MaskManager);
