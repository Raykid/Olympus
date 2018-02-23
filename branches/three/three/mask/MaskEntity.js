/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 *
 * Three.js遮罩实现，因为纯3D不方便做UI，因此暂时不实现
*/
var MaskEntityImpl = /** @class */ (function () {
    function MaskEntityImpl() {
    }
    /**
     * 显示遮罩
     */
    MaskEntityImpl.prototype.showMask = function (alpha) {
    };
    /**
     * 隐藏遮罩
     */
    MaskEntityImpl.prototype.hideMask = function () {
    };
    /**当前是否在显示遮罩*/
    MaskEntityImpl.prototype.isShowingMask = function () {
        return false;
    };
    /**
     * 显示加载图
     */
    MaskEntityImpl.prototype.showLoading = function (alpha) {
    };
    /**
     * 隐藏加载图
     */
    MaskEntityImpl.prototype.hideLoading = function () {
    };
    /**当前是否在显示loading*/
    MaskEntityImpl.prototype.isShowingLoading = function () {
        return false;
    };
    /** 显示模态窗口遮罩 */
    MaskEntityImpl.prototype.showModalMask = function (panel, alpha) {
    };
    /** 隐藏模态窗口遮罩 */
    MaskEntityImpl.prototype.hideModalMask = function (panel) {
    };
    /** 当前是否在显示模态窗口遮罩 */
    MaskEntityImpl.prototype.isShowingModalMask = function (panel) {
        return false;
    };
    return MaskEntityImpl;
}());
export default MaskEntityImpl;
